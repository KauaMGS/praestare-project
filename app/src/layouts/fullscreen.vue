<template>
  <v-app>
    <v-app-bar
        app
        :color="constants.COLOR_PRIMARY"
        elevation="2"
        height="80"
    >
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-2">mdi-cash</v-icon>
          <span class="text-h5 font-weight-bold">Praestare</span>
        </div>

        <v-tabs
            :color="constants.COLOR_ACTIVE"
            class="d-none d-md-flex"
            height="80"
        >
          <v-tab
              v-for="item in menuItemsFiltrados"
              :key="item.path"
              :to="item.path"
              :prepend-icon="item.icon"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>

        <div class="d-flex align-center gap-2">
          <Avatar />

          <v-app-bar-nav-icon
              @click="drawer = !drawer"
              class="d-md-none"
          ></v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        temporary
        width="280"
        :color="constants.COLOR_SECONDARY"
        class="d-md-none"
    >
      <v-list nav density="comfortable" class="py-2">
        <v-list-item
            v-for="item in menuItemsFiltrados"
            :key="item.path"
            :to="item.path"
            :prepend-icon="item.icon"
            :title="item.title"
            rounded="xl"
            class="mx-2 my-1"
            :color="constants.COLOR_ACTIVE"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main :style="{ backgroundColor: constants.COLOR_SECONDARY }">
      <v-container fluid>
        <v-row>
          <v-col>
            <v-sheet
                min-height="70vh"
                rounded="lg"
                :color="constants.COLOR_SECONDARY"
                elevation="0"
            >
              <div class="mb-16">
                <slot />
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app :color="constants.COLOR_PRIMARY" class="text-end" height="45">
      <v-col class="text-end" cols="12">
        <span class="text-sm-body-2">© 2025 - Versão 1.0</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Constants from "@/constants/constants.js";
import Avatar from "@/components/avatar.vue";
import Papel from "@/utils/Papel.js";
import {mapGetters} from "vuex";

export default {
  name: 'LayoutComponent',
  components: {Avatar},

  data() {
    return {
      drawer: false,
      constants: Constants,
      menuItems: [
        {
          title: 'Denúncias recentes',
          icon: 'mdi-view-dashboard',
          path: '/inicio',
          papeis: [Papel.COMUM]
        },
        {
          title: 'Verificar proposta',
          icon: 'mdi-check-circle',
          path: '/verificacao',
          papeis: [Papel.COMUM]
        },
        {
          title: 'Reportar golpe',
          icon: 'mdi-alert-circle',
          path: '/denuncias',
          papeis: [Papel.COMUM]
        },

        {
          title: 'Gerenciar Usuários',
          icon: 'mdi-account-multiple',
          path: '/admin/usuarios',
          papeis: [Papel.ADMIN]
        },
        {
          title: 'Aprovar denuncia',
          icon: 'mdi-check-circle',
          path: '/admin/aprovar-denuncias',
          papeis: [Papel.ADMIN]
        },
      ]
    }
  },

  computed: {
    ...mapGetters(['stateLogin']),

    userPapel() {
      return this.stateLogin.usuario?.papel;
    },

    menuItemsFiltrados() {
      if (!this.userPapel) return [];

      return this.menuItems.filter(item => {
        return item.papeis.includes(this.userPapel);
      });
    }
  }
}
</script>