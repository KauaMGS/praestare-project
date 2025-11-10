<template>
  <div class="pa-6 d-flex flex-column align-center text-center">
    <div class="mb-6">
      <div class="text-center mb-10">
        <h2 class="text-h4 font-weight-bold mb-2" style="color: #ffffff;">
          Aprovar denuncias
        </h2>
      </div>

      <div class="d-flex flex-wrap justify-center align-center mt-4 gap-4">
        <v-pagination
            v-model="paginaAtual"
            :length="totalPaginas"
            total-visible="5"
            rounded="circle"
        />
        <v-select
            v-model="itensPorPagina"
            :items="[6, 12, 24, 48]"
            label="Itens por página"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 150px;"
        />
      </div>
    </div>

    <v-row class="w-100">
      <v-col
          v-for="(denuncia, index) in denunciasPaginadas"
          :key="index"
          cols="12"
          md="6"
          lg="4"
      >
        <DenunciaCard :denuncia="denuncia" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DenunciaCard from "@/components/denuncia-card.vue";

export default {
  components: { DenunciaCard },
  computed: {
    totalPaginas() {
      return Math.ceil(this.quantidadeDenuncias / this.itensPorPagina);
    },
    denunciasPaginadas() {
      const denuncias = Array.from({ length: this.quantidadeDenuncias }, (_, i) => ({
        ...this.sampleDenuncia,
        id: i + 1
      }));
      const start = (this.paginaAtual - 1) * this.itensPorPagina;
      const end = start + this.itensPorPagina;
      return denuncias.slice(start, end);
    }
  },
  data() {
    return {
      paginaAtual: 1,
      itensPorPagina: 6,
      quantidadeDenuncias: 50,
      sampleDenuncia: {
        id: 1,
        anonimo: false,
        nomeUsuario: "João Silva",
        data: "2024-11-07T14:30:00",
        instituicao: "Crédito Fácil Express LTDA",
        descricao:
            "Recebi uma ligação oferecendo empréstimo com juros muito baixos, mas ao solicitar mais informações, começaram a pedir pagamento antecipado de taxas. A empresa não possui registro no Banco Central e o CNPJ não confere.",
        proposta: { valor: 15000, prazo: 24, taxaJuros: 2.5 },
        votos: 127
      }
    };
  }
};
</script>
