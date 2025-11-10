<template>
  <v-container class="d-flex justify-center">
    <div style="max-width: 600px; min-width: 1000px">
      <div class="text-center mb-10">
        <h2 class="text-h4 font-weight-bold mb-1" style="color: #fff;">
          Reportar Golpe ou Empresa Suspeita
        </h2>
        <p class="text-subtitle-1" style="color: rgba(255,255,255,0.7);">
          Ajude a comunidade compartilhando informações sobre possíveis fraudes ou empresas suspeitas.
        </p>
      </div>
      <v-card class="pa-6" elevation="4" rounded="lg">
        <v-form ref="form" v-model="valid" lazy-validation>
          <p class="mb-2">
            Caso não opte pelo envio anônimo, sua denúncia será exibida junto ao seu nome de usuário.
          </p>
          <v-checkbox
              v-model="stateDenuncia.anonimo"
              label="Enviar denúncia como anônimo"
              color="primary"
              class="mb-2"
          />

          <div class="d-flex ga-3 mb-2">
            <v-text-field
                v-model="stateDenuncia.banco"
                label="Nome da Empresa"
                variant="outlined"
                density="comfortable"
                :rules="camposParaValidacao.banco"
            ></v-text-field>
          </div>

          <v-textarea
              v-model="stateDenuncia.descricao"
              label="Descrição do ocorrido"
              variant="outlined"
              :rules="camposParaValidacao.descricao"
              auto-grow
              rows="4"
              class="mb-2"
          ></v-textarea>

          <v-divider class="mb-2" />

          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon size="20" class="me-1">mdi-file-document-outline</v-icon>
            Proposta Oferecida
          </div>

          <div class="d-flex ga-3 mb-4">
            <v-text-field
                v-model.number="stateDenuncia.valor"
                label="Valor do Empréstimo (R$)"
                variant="outlined"
                density="comfortable"
                type="number"
                prefix="R$"
                :rules="camposParaValidacao.valor"
            ></v-text-field>

            <v-text-field
                v-model.number="stateDenuncia.prazo"
                label="Prazo (meses)"
                variant="outlined"
                density="comfortable"
                type="number"
                :rules="camposParaValidacao.prazo"
            ></v-text-field>

            <v-text-field
                v-model.number="stateDenuncia.taxa"
                label="Taxa de Juros (% a.m.)"
                variant="outlined"
                density="comfortable"
                type="number"
                suffix="%"
                :rules="camposParaValidacao.taxa"
            ></v-text-field>
          </div>

          <v-btn
              block
              size="large"
              color="red-darken-3"
              class="text-none mb-2"
              @click="enviarDenuncia"
          >
            ENVIAR DENÚNCIA
          </v-btn>
        </v-form>
      </v-card>
    </div>
    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        location="top"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import Constants from "@/constants/constants.js";
import {mapActions, mapGetters} from "vuex";
import CamposParaValidacao from "@/utils/CamposParaValidacao.js";

export default {
  computed: {
    ...mapGetters([
      "stateDenuncia"
    ]),
  },
  data() {
    return {
      valid: false,
      constants: Constants,
      camposParaValidacao: CamposParaValidacao,
      snackbar: {
        show: false,
        message: "",
        color: ""
      },
    };
  },

  methods: {
    ...mapActions([
      "actionCadastrarDenuncia"
    ]),

    async enviarDenuncia() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        await this.actionCadastrarDenuncia();

        this.showSnackbar(
            "Denuncia enviada com sucesso!",
            this.constants.COLOR_SUCCESS,
        )

        this.$refs.form.resetValidation();
      }

    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },
};
</script>