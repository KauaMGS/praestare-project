package com.praestare.emprestimos.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnaliseEmprestimoResponseDto {
    private String classificacao;
    private int pontuacao;
    private String avaliacaoEmprestimo;
    private String justificativa;
}
