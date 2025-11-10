<template>
  <v-menu
      attach="body"
      transition="scale-transition"
      offset-y
  >
    <template v-slot:activator="{ props }">
      <div class="d-flex align-center" v-bind="props">
        <p>{{stateLoginUsuario.name}}</p>
        <v-btn
            icon="mdi-account-circle"
            variant="text"
        />
      </div>
    </template>

    <v-card>
      <v-list>
        <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="logout"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters([
        "stateLoginUsuario"
    ])
  },
  methods: {
    ...mapActions(["actionLogout"]),

    logout() {
      this.actionLogout();
      location.reload();
    },
  },
};
</script>