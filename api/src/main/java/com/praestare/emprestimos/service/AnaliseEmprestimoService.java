package com.praestare.emprestimos.service;

import java.time.YearMonth;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.praestare.emprestimos.model.dto.AnaliseEmprestimoDto;
import com.praestare.emprestimos.model.dto.AnaliseEmprestimoResponseDto;

@Service
public class AnaliseEmprestimoService {

    @Autowired
    private TaxaMercadoService taxaMercadoService;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String API_INSTITUICOES_BACEN =
            "https://olinda.bcb.gov.br/olinda/servico/CCR/versao/v1/odata/InstituicoesFinanceirasAutorizadas?$format=json";

    private static final Set<String> INSTITUICOES_CONHECIDAS = Set.of(
            "Banco do Brasil", "Caixa Econômica Federal", "Bradesco", "Itaú", "Santander", "Nubank", "Inter", "C6 Bank"
    );

    public AnaliseEmprestimoResponseDto avaliarEmprestimo(AnaliseEmprestimoDto dto) {

        double pontuacao = 0.0;
        double pontuacaoMaxima = 10.0;
        StringBuilder justificativa = new StringBuilder();

        double PESO_INSTITUICAO = 1.0;
        double PESO_SCORE = 1.2;
        double PESO_TAXA = 2.0;
        double PESO_PRAZO_VALOR = 0.8;
        double PESO_SOLICITACAO_ONLINE = 0.5;

        switch (dto.getTipoEmprestimo().toLowerCase()) {
            case "consignado":
                PESO_TAXA = 1.8;
                PESO_PRAZO_VALOR = 1.0;
                break;
            case "veicular":
                PESO_TAXA = 2.2;
                break;
            default:
                PESO_TAXA = 2.5;
                break;
        }

        boolean autorizada = verificarInstituicaoAutorizada(dto.getInstituicao());
        if (autorizada) {
            pontuacao += 2 * PESO_INSTITUICAO;
            justificativa.append("Instituição autorizada pelo Banco Central. ");
        } else {
            pontuacao -= 2 * PESO_INSTITUICAO;
            justificativa.append("Instituição não consta entre as autorizadas pelo BACEN. ");
        }

        if (INSTITUICOES_CONHECIDAS.contains(dto.getInstituicao())) {
            pontuacao += 1 * PESO_INSTITUICAO;
            justificativa.append("Instituição reconhecida no mercado. ");
        }

        // 2️⃣ Score Serasa
        if (dto.getScoreSerasa() >= 700) {
            pontuacao += 2 * PESO_SCORE;
            justificativa.append("Score alto — bom histórico de crédito. ");
        } else if (dto.getScoreSerasa() >= 500) {
            pontuacao += 1 * PESO_SCORE;
            justificativa.append("Score médio — risco moderado. ");
        } else {
            pontuacao -= 2 * PESO_SCORE;
            justificativa.append("Score baixo — risco alto de inadimplência. ");
        }

        String mesReferencia = YearMonth.now().toString();
        Double taxaMercado = taxaMercadoService.buscarTaxaMensalPorBanco(dto.getInstituicao(), mesReferencia);
        if (taxaMercado == null) {
            taxaMercado = 8.05;
            justificativa.append("Taxa média de mercado indisponível — valor padrão usado (8.05%). ");
        }

        double taxaOferecida = dto.getTaxaJuros();
        double dif = ((taxaOferecida - taxaMercado) / taxaMercado) * 100;
        String avaliacaoEmprestimo;

        if (dif <= -10) {
            pontuacao += 2.5 * PESO_TAXA;
            avaliacaoEmprestimo = "Excelente — taxa abaixo da média.";
            justificativa.append("Taxa abaixo da média — ótimo negócio. ");
        } else if (Math.abs(dif) <= 10) {
            pontuacao += 1.5 * PESO_TAXA;
            avaliacaoEmprestimo = "Justa — próxima à média.";
            justificativa.append("Taxa próxima da média — aceitável. ");
        } else if (dif <= 30) {
            pontuacao -= 1.5 * PESO_TAXA;
            avaliacaoEmprestimo = "Alta — acima do mercado.";
            justificativa.append("Taxa acima da média — atenção. ");
        } else {
            pontuacao -= 3 * PESO_TAXA;
            avaliacaoEmprestimo = "Abusiva — muito acima do mercado.";
            justificativa.append("Taxa muito acima da média — possível golpe. ");
        }

        double relacaoPrazoValor = dto.getValorEmprestimo() / dto.getPrazoMeses();
        if (relacaoPrazoValor >= 1000 && relacaoPrazoValor <= 5000) {
            pontuacao += 1 * PESO_PRAZO_VALOR;
            justificativa.append("Relação valor/prazo adequada. ");
        } else if (relacaoPrazoValor > 10000) {
            pontuacao -= 1 * PESO_PRAZO_VALOR;
            justificativa.append("Valor muito alto para o prazo — risco elevado. ");
        }

        if (dto.isSolicitacaoOnline()) {
            pontuacao -= 1 * PESO_SOLICITACAO_ONLINE;
            justificativa.append("Solicitação online requer cuidado — verifique CNPJ e site. ");
        } else {
            pontuacao += 0.5 * PESO_SOLICITACAO_ONLINE;
            justificativa.append("Canal físico/oficial informado. ");
        }

        String classificacao;
        if (pontuacao >= 8) classificacao = "Confiável";
        else if (pontuacao >= 5) classificacao = "Mediano";
        else if (pontuacao >= 2) classificacao = "Não confiável";
        else classificacao = "Possível golpe";

        double confiabilidadePercentual = Math.min(100, Math.max(0, (pontuacao / pontuacaoMaxima) * 100));

        justificativa.append(String.format("🔎 Confiabilidade estimada: %.1f%%", confiabilidadePercentual));

        return new AnaliseEmprestimoResponseDto(classificacao, (int) Math.round(pontuacao), avaliacaoEmprestimo, justificativa.toString());
    }

    @Cacheable("instituicoesAutorizadas")
    public boolean verificarInstituicaoAutorizada(String nomeInstituicao) {
        try {
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(API_INSTITUICOES_BACEN, JsonNode.class);
            JsonNode results = response.getBody().get("value");
            if (results != null) {
                for (JsonNode node : results) {
                    String nome = node.get("Nome").asText().trim().toLowerCase();
                    if (nome.contains(nomeInstituicao.toLowerCase())) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Erro ao consultar instituições BACEN: " + e.getMessage());
        }
        return false;
    }
}
