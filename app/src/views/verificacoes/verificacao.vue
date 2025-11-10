<template>
  <v-container class="d-flex justify-center">
    <div v-if="!exibirRelatorio" style="max-width: 600px; min-width: 1000px">
      <div class="text-center mb-10">
        <h2 class="text-h4 font-weight-bold mb-1" style="color: #fff;">
          Confira se a proposta é confiável
        </h2>
        <p class="text-subtitle-1" style="color: rgba(255,255,255,0.7);">
          Use esta ferramenta para avaliar possíveis indícios de fraude ou inconsistências nas condições oferecidas.
        </p>
      </div>
      <v-card
          class="pa-6"
          elevation="4"
          rounded="lg"
      >
        <v-form ref="form">
          <div class="d-flex ga-3 mb-4">
            <v-text-field
                v-model="stateVerificacao.instituicao"
                label="Nome da Instituição"
                variant="outlined"
                density="comfortable"
                class="mb-1"
            ></v-text-field>
            <v-select
                v-model="stateVerificacao.tipoEmprestimo"
                label="Tipo de empréstimo"
                :items="[
                  {name: 'Pessoal', value: 'pessoal'},
                  {name: 'Consignado', value: 'consignado'},
                  {name: 'Veicular', value: 'veicular'},
                ]"
                item-title="name"
                item-value="value"
                variant="outlined"
                density="compact"
                class="mb-1"
                max-width="30%"
            />
          </div>

          <div class="d-flex ga-3 mb-4">
            <v-text-field
                v-model="stateVerificacao.scoreSerasa"
                label="Score (Serasa)"
                variant="outlined"
                density="comfortable"
            ></v-text-field>
            <v-text-field
                v-model="stateVerificacao.valorEmprestimo"
                label="Valor do Empréstimo (R$)"
                variant="outlined"
                density="comfortable"
                type="number"
                prefix="R$"
            ></v-text-field>
          </div>

          <div class="d-flex ga-3 mb-4">
            <v-text-field
                v-model="stateVerificacao.taxaJuros"
                label="Taxa de Juros (%)"
                variant="outlined"
                density="comfortable"
                type="number"
                suffix="%"
            ></v-text-field>
            <v-text-field
                v-model="stateVerificacao.prazoMeses"
                label="Prazo (Meses)"
                variant="outlined"
                density="comfortable"
                type="number"
            ></v-text-field>
          </div>

          <v-switch
              v-model="stateVerificacao.solicitacaoOnline"
              label="Solicitação online (feita via site, app, WhatsApp, redes sociais ou anúncio.)"
              density="compact"
              hide-details
              class="mb-4"
          />

          <v-btn
              block
              size="large"
              color="red-darken-3"
              class="text-none mb-4"
              @click="analisarEmprestimo()"
          >
            VERIFICAR CONFIABILIDADE
          </v-btn>

          <div class="text-center">
            <v-btn
                variant="text"
                color="grey-darken-2"
                class="text-none text-decoration-underline"
                @click="consultarDenunciasComunidade()"
            >
              Consultar denuncias da comunidade
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

    <!-- Resultado da Verificação -->
    <div v-else style="max-width: 600px; min-width: 1000px">
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-bold mb-1" style="color: #fff;">
          Resultado da Análise
        </h2>
        <p class="text-subtitle-1" style="color: rgba(255,255,255,0.7);">
          Confira os detalhes da verificação do empréstimo
        </p>
      </div>

      <v-card
          class="pa-8"
          elevation="8"
          rounded="lg"
      >
        <!-- Status Principal -->
        <div class="text-center mb-6">
          <v-chip
              :color="getClassificacaoColor(stateRespostaVerificacao.classificacao)"
              size="large"
              class="px-6 py-6 mb-4"
              label
          >
            <v-icon start size="24">{{ getClassificacaoIcon(stateRespostaVerificacao.classificacao) }}</v-icon>
            <span class="text-h6 font-weight-bold">{{ stateRespostaVerificacao.classificacao }}</span>
          </v-chip>

          <!-- Confiabilidade Percentual -->
          <div class="mb-4">
            <h3 class="text-h4 font-weight-bold mb-2" :style="{ color: getConfiabilidadeColor() }">
              {{ extrairConfiabilidade() }}%
            </h3>
            <p class="text-body-2 text-grey-darken-1">Índice de Confiabilidade</p>
          </div>

          <!-- Barra de Progresso -->
          <v-progress-linear
              :model-value="parseFloat(extrairConfiabilidade())"
              :color="getConfiabilidadeColor()"
              height="12"
              rounded
              class="mb-2"
          ></v-progress-linear>
        </div>

        <v-divider class="my-6"></v-divider>

        <!-- Avaliação da Taxa -->
        <div class="mb-6">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">mdi-percent</v-icon>
            <h4 class="text-h6 font-weight-bold">Avaliação da Taxa de Juros</h4>
          </div>
          <v-alert
              :color="getAvaliacaoTaxaColor(stateRespostaVerificacao.avaliacaoEmprestimo)"
              variant="tonal"
              prominent
              class="mb-0"
          >
            <div class="d-flex align-center">
              <v-icon size="28" class="mr-3">{{ getAvaliacaoTaxaIcon(stateRespostaVerificacao.avaliacaoEmprestimo) }}</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  {{ stateRespostaVerificacao.avaliacaoEmprestimo }}
                </div>
              </div>
            </div>
          </v-alert>
        </div>

        <v-divider class="my-6"></v-divider>

        <div class="mb-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="info" class="mr-2">mdi-text-box-check-outline</v-icon>
            <h4 class="text-h6 font-weight-bold">Análise Detalhada</h4>
          </div>

          <div class="text-body-1 line-height-relaxed">
            <div v-for="(frase, index) in formatarJustificativa()" :key="index" class="mb-3">
              <v-chip
                  size="x-small"
                  color="grey-lighten-2"
                  class="mr-2"
              >
                {{ index + 1 }}
              </v-chip>
              <span>{{ frase }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex ga-3 mt-8">
          <v-btn
              variant="outlined"
              color="grey-darken-2"
              size="large"
              class="text-none flex-grow-1"
              @click="novaVerificacao()"
          >
            <v-icon start>mdi-refresh</v-icon>
            Nova Verificação
          </v-btn>

          <v-btn
              color="red-darken-3"
              size="large"
              class="text-none flex-grow-1"
              @click="consultarDenunciasComunidade()"
          >
            <v-icon start>mdi-shield-alert</v-icon>
            Ver Denúncias
          </v-btn>
        </div>

        <v-alert
            type="info"
            variant="tonal"
            class="mt-6"
            density="compact"
        >
          <template v-slot:prepend>
            <v-icon>mdi-alert-circle</v-icon>
          </template>
          <div class="text-caption">
            <strong>Importante:</strong> Esta análise é automatizada e serve apenas como orientação.
            Sempre verifique o CNPJ da instituição, consulte o Banco Central e desconfie de ofertas muito vantajosas.
          </div>
        </v-alert>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import Constants from "@/constants/constants.js";
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters([
      "stateVerificacao",
      "stateRespostaVerificacao"
    ]),
  },
  mounted() {
    this.actionResetStateVerificacao();
    this.exibirRelatorio = false;
  },
  beforeUnmount() {
    this.actionSetStateRespostaVerificacao({});
    this.actionResetStateVerificacao();
  },
  data() {
    return {
      constants: Constants,
      exibirRelatorio: false,
    }
  },
  methods: {
    ...mapActions([
      "actionAnalisarEmprestimo",
      "actionResetStateVerificacao",
      "actionSetStateRespostaVerificacao"
    ]),

    async analisarEmprestimo() {
      await this.actionAnalisarEmprestimo();
      this.exibirRelatorio = true;
    },

    consultarDenunciasComunidade() {
      this.$router.push("/inicio");
    },

    novaVerificacao() {
      this.exibirRelatorio = false;
      this.actionResetStateVerificacao();
    },

    getClassificacaoColor(classificacao) {
      const colors = {
        'Confiável': 'success',
        'Mediano': 'warning',
        'Não confiável': 'orange-darken-2',
        'Possível golpe': 'error'
      };
      return colors[classificacao] || 'grey';
    },

    getClassificacaoIcon(classificacao) {
      const icons = {
        'Confiável': 'mdi-shield-check',
        'Mediano': 'mdi-shield-alert',
        'Não confiável': 'mdi-shield-off',
        'Possível golpe': 'mdi-shield-remove'
      };
      return icons[classificacao] || 'mdi-shield';
    },

    getAvaliacaoTaxaColor(avaliacao) {
      if (avaliacao.includes('Excelente')) return 'success';
      if (avaliacao.includes('Justa')) return 'info';
      if (avaliacao.includes('Alta')) return 'warning';
      if (avaliacao.includes('Abusiva')) return 'error';
      return 'grey';
    },

    getAvaliacaoTaxaIcon(avaliacao) {
      if (avaliacao.includes('Excelente')) return 'mdi-thumb-up';
      if (avaliacao.includes('Justa')) return 'mdi-equal';
      if (avaliacao.includes('Alta')) return 'mdi-alert';
      if (avaliacao.includes('Abusiva')) return 'mdi-alert-octagon';
      return 'mdi-information';
    },

    extrairConfiabilidade() {
      const match = this.stateRespostaVerificacao.justificativa.match(/Confiabilidade estimada: ([\d,]+)%/);
      return match ? match[1].replace(',', '.') : '0';
    },

    getConfiabilidadeColor() {
      const valor = parseFloat(this.extrairConfiabilidade());
      if (valor >= 80) return '#4CAF50';
      if (valor >= 60) return '#FFC107';
      if (valor >= 40) return '#FF9800';
      return '#F44336';
    },

    formatarJustificativa() {
      return this.stateRespostaVerificacao.justificativa
          .split('. ')
          .filter(frase => frase.trim() && !frase.includes('🔎'))
          .map(frase => frase.trim().replace(/\.$/, ''));
    }
  }
}
</script>

<style scoped>
.line-height-relaxed {
  line-height: 1.8;
}
</style>