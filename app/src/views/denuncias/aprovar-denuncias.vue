<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Aprovar Denúncias</h1>
            <p class="text-subtitle-1 text--secondary">
              Revise e aprove ou reprove as denúncias pendentes
            </p>
          </div>

          <v-chip
              :color="constants.COLOR_WARNING"
              variant="flat"
              size="large"
              prepend-icon="mdi-clock-outline"
          >
            {{ denunciasPendentes.length }} Pendentes
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-tabs
            v-model="tabAtiva"
            :color="constants.COLOR_PRIMARY"
            class="mb-4"
        >
          <v-tab value="pendentes" :color="tabAtiva === 'pendentes' ? '#FFD54F' : ''">
            <v-icon start>mdi-clock-outline</v-icon>
            Pendentes ({{ denunciasPendentes.length }})
          </v-tab>
          <v-tab value="aprovadas" :color="tabAtiva === 'aprovadas' ? '#66BB6A' : ''">
            <v-icon start>mdi-check-circle</v-icon>
            Aprovadas ({{ denunciasAprovadas.length }})
          </v-tab>
          <v-tab value="reprovadas" :color="tabAtiva === 'reprovadas' ? '#EF5350' : ''">
            <v-icon start>mdi-close-circle</v-icon>
            Reprovadas ({{ denunciasReprovadas.length }})
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-window v-model="tabAtiva">
      <v-window-item value="pendentes">
        <v-row v-if="denunciasPendentes.length > 0" align="stretch">
          <v-col
              v-for="denuncia in denunciasPendentes"
              :key="denuncia.id"
              cols="12"
              md="6"
              lg="4"
          >
            <DenunciaCard
                :denuncia="denuncia"
                :exibir-controles="true"
                @aprovar="aprovarDenuncia(denuncia.id)"
                @reprovar="reprovarDenuncia(denuncia.id)"
            />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-alert
                type="info"
                variant="tonal"
                prominent
                icon="mdi-information"
            >
              Não há denúncias pendentes no momento.
            </v-alert>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="aprovadas">
        <v-row v-if="denunciasAprovadas.length > 0">
          <v-col
              v-for="denuncia in denunciasAprovadas"
              :key="denuncia.id"
              cols="12"
              md="6"
              lg="4"
          >
            <DenunciaCard :denuncia="denuncia" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-alert
                type="info"
                variant="tonal"
                prominent
                icon="mdi-information"
            >
              Nenhuma denúncia aprovada ainda.
            </v-alert>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item value="reprovadas" >
        <v-row v-if="denunciasReprovadas.length > 0">
          <v-col
              v-for="denuncia in denunciasReprovadas"
              :key="denuncia.id"
              cols="12"
              md="6"
              lg="4"
          >
            <DenunciaCard :denuncia="denuncia" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-alert
                type="info"
                variant="tonal"
                prominent
                icon="mdi-information"
            >
              Nenhuma denúncia reprovada ainda.
            </v-alert>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import DenunciaCard from "@/components/denuncia-card.vue";
import Constants from "@/constants/constants.js";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {
    DenunciaCard
  },
  computed: {
    ...mapGetters([
      "stateDenuncias",
      "stateFiltroDenuncias"
    ]),

    denunciasPendentes() {
      return this.denuncias.filter(d => d.status === "pendente");
    },
    denunciasAprovadas() {
      return this.denuncias.filter(d => d.status === "aprovada");
    },
    denunciasReprovadas() {
      return this.denuncias.filter(d => d.status === "reprovada");
    }
  },
  mounted() {
    this.stateFiltroDenuncias.status = "PENDENTE";
    this.listarDenuncias();
  },
  data() {
    return {
      constants: Constants,
      tabAtiva: "pendentes",
      dialogConfirmacao: false,
      acaoAtual: null,
      denunciaIdAtual: null,
      snackbar: {
        show: false,
        message: "",
        color: ""
      },
      denuncias: [
        {
          id: 1,
          status: "pendente",
          anonimo: false,
          nomeUsuario: "João Silva",
          data: new Date(Date.now() - 3600000).toISOString(),
          instituicao: "FinanceCorp LTDA",
          descricao: "Proposta com taxas abusivas e cobrança de tarifas não informadas inicialmente. Tentaram me fazer assinar sem ler o contrato completo.",
          proposta: {
            valor: 15000,
            prazo: 24,
            taxaJuros: 8.5
          }
        },
        {
          id: 2,
          status: "pendente",
          anonimo: true,
          nomeUsuario: "",
          data: new Date(Date.now() - 7200000).toISOString(),
          instituicao: "CréditoFácil S.A.",
          descricao: "Ofereceram empréstimo com juros muito altos e pediram depósito antecipado como garantia. Suspeita de fraude.",
          proposta: {
            valor: 25000,
            prazo: 36,
            taxaJuros: 12.0
          }
        },
        {
          id: 3,
          status: "pendente",
          anonimo: false,
          nomeUsuario: "Maria Santos",
          data: new Date(Date.now() - 86400000).toISOString(),
          instituicao: "BancoRápido",
          descricao: "Taxa de juros muito superior ao informado inicialmente. Descobri apenas na hora da assinatura.",
          proposta: {
            valor: 8000,
            prazo: 12,
            taxaJuros: 15.5
          }
        },
        {
          id: 4,
          status: "aprovada",
          anonimo: false,
          nomeUsuario: "Pedro Costa",
          data: new Date(Date.now() - 172800000).toISOString(),
          instituicao: "Financeira XYZ",
          descricao: "Cobrança de tarifas não previstas em contrato e pressão psicológica para aceitar.",
          proposta: {
            valor: 12000,
            prazo: 18,
            taxaJuros: 9.8
          }
        },
        {
          id: 5,
          status: "reprovada",
          anonimo: true,
          nomeUsuario: "",
          data: new Date(Date.now() - 259200000).toISOString(),
          instituicao: "CréditoExpress",
          descricao: "Denúncia sem informações suficientes para validação.",
          proposta: {
            valor: 5000,
            prazo: 6,
            taxaJuros: 5.5
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      "actionListarDenunciasPorStatus",
    ]),

    async listarDenuncias() {
      await this.actionListarDenunciasPorStatus();
    },
    aprovarDenuncia(id) {
      this.acaoAtual = "aprovar";
      this.denunciaIdAtual = id;
      this.dialogConfirmacao = true;
    },
    reprovarDenuncia(id) {
      this.acaoAtual = "reprovar";
      this.denunciaIdAtual = id;
      this.dialogConfirmacao = true;
    },
    confirmarAcao() {
      const denuncia = this.denuncias.find(d => d.id === this.denunciaIdAtual);

      if (denuncia) {
        denuncia.status = this.acaoAtual === "aprovar" ? "aprovada" : "reprovada";

        this.showSnackbar(
            `Denúncia ${this.acaoAtual === "aprovar" ? "aprovada" : "reprovada"} com sucesso!`,
            this.acaoAtual === "aprovar" ? this.constants.COLOR_SUCCESS : this.constants.COLOR_WARNING
        );
      }

      this.dialogConfirmacao = false;
      this.denunciaIdAtual = null;
      this.acaoAtual = null;
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>