<template>
  <v-container fluid class="pa-0 main-container" style="height: 100%;">
    <div class="gradient-top">
      <div class="logo-container">
        <h1 class="company-name">Praestare</h1>
      </div>
    </div>

    <v-row align="center" justify="center" style="min-height: 100vh; position: relative; z-index: 2;">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="8" rounded="lg">
          <v-card-text class="pa-8">
            <div class="text-center mb-6">
              <h1 :style="{ color: constants.COLOR_PRIMARY }" class="text-h4 font-weight-bold mb-2">
                {{ isLogin ? 'Entrar' : 'Criar Conta' }}
              </h1>
              <p :style="{ color: constants.COLOR_TEXT_SECONDARY }">
                {{ isLogin ? 'Acesse sua conta' : 'Cadastre-se para começar' }}
              </p>
            </div>

            <v-form ref="form">
              <v-text-field
                  v-if="!isLogin"
                  v-model="stateLoginUsuario.nome"
                  label="Nome completo"
                  :rules="camposParaValidacao.nome"
                  variant="outlined"
                  :color="constants.COLOR_PRIMARY"
                  prepend-inner-icon="mdi-account"
                  class="mb-2"
              ></v-text-field>

              <v-text-field
                  v-model="stateLoginUsuario.email"
                  label="E-mail"
                  type="email"
                  :rules="camposParaValidacao.email"
                  variant="outlined"
                  :color="constants.COLOR_PRIMARY"
                  prepend-inner-icon="mdi-email"
                  class="mb-2"
              ></v-text-field>

              <v-text-field
                  v-model="stateLoginUsuario.senha"
                  :label="isLogin ? 'Senha' : 'Criar senha'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="camposParaValidacao.senha"
                  variant="outlined"
                  :color="constants.COLOR_PRIMARY"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  class="mb-2"
              ></v-text-field>

              <v-text-field
                  v-if="!isLogin"
                  v-model="stateLoginUsuario.confirmacaoSenha"
                  label="Confirmar senha"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="camposParaValidacao.confirmacaoSenha(stateLoginUsuario.senha)"
                  variant="outlined"
                  :color="constants.COLOR_PRIMARY"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  class="mb-4"
              ></v-text-field>

              <div v-if="isLogin" class="text-right mb-4">
                <a href="#"
                   :style="{ color: constants.COLOR_PRIMARY }"
                   class="text-decoration-none text-body-2"
                   @click.prevent="handleForgotPassword"
                >
                  Esqueci minha senha
                </a>
              </div>

              <v-btn
                  block
                  size="large"
                  :color="constants.COLOR_BUTTON"
                  :loading="loading"
                  class="mb-4"
                  @click="isLogin ? login() : cadastrar()"
              >
                {{ isLogin ? 'Entrar' : 'Cadastrar' }}
              </v-btn>

              <v-divider class="my-4"></v-divider>

              <div class="text-center">
                <span :style="{ color: constants.COLOR_TEXT_SECONDARY }" class="text-body-2">
                  {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
                </span>

                <a href="#"
                   :style="{ color: constants.COLOR_PRIMARY }"
                   class="text-decoration-none font-weight-bold ml-1"
                   @click.prevent="toggleMode"
                >
                  {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
                </a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
            location="top"
        >
          {{ snackbar.message }}
        </v-snackbar>
      </v-col>
    </v-row>

    <div class="gradient-bottom"></div>
  </v-container>
</template>

<script>
import Constants from "@/constants/constants.js";
import CamposParaValidacao from "@/utils/CamposParaValidacao.js";
import {mapActions, mapGetters} from "vuex";
import Papel from "@/utils/Papel.js";

export default {
  computed: {
    ...mapGetters([
      "stateLoginUsuario"
    ]),
  },
  data() {
    return {
      Papel: Papel,
      camposParaValidacao: CamposParaValidacao,
      constants: Constants,
      isLogin: true,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      snackbar: {
        show: false,
        message: '',
        color: ''
      },
    };
  },
  methods: {
    ...mapActions([
      "actionLogin",
      "actionRegistrar"
    ]),

    async login() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        await this.actionLogin();
      }
    },
    async cadastrar() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        await this.actionRegistrar();
        this.showSnackbar('Conta criada com sucesso', this.constants.COLOR_SUCCESS);
        this.toggleMode();
        this.resetForm();
      }
    },
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.resetForm();
    },
    resetForm() {

      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    handleForgotPassword() {
      this.showSnackbar('Funcionalidade em desenvolvimento', this.constants.COLOR_INFO);
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.main-container {
  background-color: #cfcfcf;
  position: relative;
  min-height: 100vh;
}

.gradient-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(90deg, #8b0606 0%, #af2929 50%, #cd545c 100%);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.company-name {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
  margin: 0;
}

.gradient-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(90deg, #cd545c 0%, #af2929 50%, #8b0606 100%);
  z-index: 1;
}

</style>