<template>
  <v-card max-width="600" elevation="3" rounded="lg" class="mx-auto d-flex flex-column h-100">
    <v-card-title class="py-3">
      <div class="d-flex align-center justify-space-between" style="width:100%">
        <div class="d-flex align-center">
          <v-avatar :color="denuncia.anonimo ? 'grey' : 'primary'" size="40">
            <v-icon color="white">
              {{ denuncia.anonimo ? "mdi-incognito" : "mdi-account" }}
            </v-icon>
          </v-avatar>

          <div class="ms-3">
            <div class="text-subtitle-1 font-weight-medium">
              {{ denuncia.anonimo ? "Usuário Anônimo" : denuncia.nomeUsuario }}
            </div>
            <div class="text-caption text--secondary">
              {{ formatarData(denuncia.data) }}
            </div>
          </div>
        </div>

        <v-chip
            color="error"
            variant="flat"
            size="small"
            prepend-icon="mdi-alert-circle"
            class="font-weight-medium"
        >
          Denúncia
        </v-chip>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pt-3">
      <div class="d-flex align-center mb-3">
        <v-icon class="me-2" color="error">mdi-bank-off</v-icon>
        <div class="text-h6 font-weight-bold text-error">
          {{ denuncia.instituicao }}
        </div>
      </div>

      <div class="mb-4">
        <div class="text-subtitle-2 mb-1 text--secondary">Descrição do ocorrido:</div>
        <div class="text-body-2">
          {{ denuncia.descricao }}
        </div>
      </div>

      <v-sheet rounded="sm" elevation="0" class="pa-3">
        <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center">
          <v-icon size="20" class="me-1">mdi-file-document-outline</v-icon>
          Proposta Oferecida
        </div>

        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="text-caption text--secondary">Valor do Empréstimo</div>
            <div class="text-h6 font-weight-bold text-success">
              {{ formatarMoeda(denuncia.proposta.valor) }}
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="text-caption text--secondary">Prazo</div>
            <div class="text-h6 font-weight-bold">
              {{ denuncia.proposta.prazo }} meses
            </div>
          </v-col>

          <v-col cols="12" sm="4">
            <div class="text-caption text--secondary">Taxa de Juros</div>
            <div class="text-h6 font-weight-bold text-warning">
              {{ denuncia.proposta.taxaJuros }}% a.m.
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card-text>
    <div v-if="exibirControles">
      <v-divider />
      <v-card-actions class="d-flex py-3 justify-end">
        <v-btn
          text="Reprovar"
          :color="constants.COLOR_BUTTON"
          variant="outlined"
        />
        <v-btn
            text="Aprovar"
            :color="constants.COLOR_SUCCESS"
            variant="flat"
        />
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import constants from "@/constants/constants.js";

export default {
  name: "DenunciaCard",
  computed: {
    constants() {
      return constants
    }
  },
  props: {
    denuncia: {
      type: Object,
      default: () => ({
        anonimo: false,
        nomeUsuario: "João Silva",
        data: new Date().toISOString(),
        instituicao: "Empresa Exemplo LTDA",
        descricao: "Descrição do ocorrido.",
        proposta: { valor: 0, prazo: 0, taxaJuros: 0 }
      })
    },
    exibirControles: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    },
    formatarData(data) {
      const date = new Date(data);
      const agora = new Date();
      const diffMs = agora - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHoras = Math.floor(diffMs / 3600000);
      const diffDias = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `há ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
      if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras !== 1 ? "s" : ""}`;
      if (diffDias < 7) return `há ${diffDias} dia${diffDias !== 1 ? "s" : ""}`;
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  }
};
</script>
