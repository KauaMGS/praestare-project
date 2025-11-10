<template>
  <div class="pa-6 d-flex flex-column" style="height: 85vh;">
    <v-card elevation="2" rounded="lg" class="d-flex flex-column" style="flex: 1; overflow: hidden;">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon icon="mdi-account-group" class="mr-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-bold">Gerenciamento de Usuários</span>
        <v-spacer></v-spacer>
        <v-btn :color="constants.COLOR_PRIMARY" prepend-icon="mdi-plus" variant="elevated">
          Novo Usuário
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0 flex-grow-1" style="overflow-y: auto;">
        <v-table hover style="height: 100%;">
          <thead>
          <tr>
            <th class="text-left font-weight-bold text-subtitle-2">
              Nome
            </th>
            <th class="text-left font-weight-bold text-subtitle-2">
              Email
            </th>
            <th class="text-center font-weight-bold text-subtitle-2">
              Papel
            </th>
            <th class="text-center font-weight-bold text-subtitle-2" style="width: 80px;">
              Ações
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="usuario in stateUsuarios" :key="usuario.id" class="user-row">
            <td>
              <div class="d-flex align-center">
                <v-avatar size="32" :color="getAvatarColor(usuario.name)" class="mr-3">
                    <span class="text-white text-caption font-weight-bold">
                      {{ getInitials(usuario.name) }}
                    </span>
                </v-avatar>
                <span class="font-weight-medium">{{ usuario.name }}</span>
              </div>
            </td>
            <td class="text-medium-emphasis">
              {{ usuario.email }}
            </td>
            <td class="text-center">
              <v-chip
                  :color="getRoleColor(usuario.usuarioType)"
                  size="small"
                  variant="tonal"
                  class="font-weight-medium"
              >
                {{ formatarTipo(usuario.usuarioType) }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-menu location="start">
                <template v-slot:activator="{ props }">
                  <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-dots-vertical"
                      v-bind="props"
                  />
                </template>
                <v-list density="compact" min-width="160">
                  <v-list-item
                      prepend-icon="mdi-pencil-outline"
                      title="Editar"
                      value="edit"
                  />
                  <v-list-item
                      prepend-icon="mdi-eye-outline"
                      title="Visualizar"
                      value="view"
                  />
                  <v-divider class="my-1"></v-divider>
                  <v-list-item
                      prepend-icon="mdi-delete-outline"
                      title="Excluir"
                      value="delete"
                      class="text-error"
                  />
                </v-list>
              </v-menu>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="d-flex pa-4 text-caption text-medium-emphasis justify-space-between">
        <p>
          Mostrando {{ stateUsuarios.length }} usuários
        </p>

        <div class="d-flex flex-wrap justify-center align-center">
          <v-pagination
              v-model="paginaAtual"
              :length="totalPaginas"
              total-visible="5"
              rounded="circle"
          />
          <v-select
              v-model="itensPorPagina"
              :items="[6, 12, 24, 48]"
              label="Quantidade"
              variant="outlined"
              density="compact"
              hide-details
              min-width="100px"
          />
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Constants from "@/constants/constants.js";
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters([
      "stateUsuarios"
    ]),
  },
  mounted() {
    this.listarUsuarios();
  },
  data() {
    return {
      constants: Constants,
      paginaAtual: 1,
      itensPorPagina: 6,
      totalPaginas: 5,
    }
  },
  methods: {
    ...mapActions([
      "actionListarUsuarios",
    ]),

    async listarUsuarios() {
      await this.actionListarUsuarios();
    },
    getInitials(name) {
      return name
          .split(' ')
          .map(word => word[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
    },
    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'success', 'info', 'warning']
      const index = name.length % colors.length
      return colors[index]
    },
    getRoleColor(role) {
      const roleColors = {
        'ADMIN': 'error',
        'COMUM': 'primary',
      }
      return roleColors[role] || 'grey'
    },
    formatarTipo(tipo) {
      if (!tipo) return 'Sem Tipo';
      return tipo.charAt(0) + tipo.slice(1).toLowerCase();
    }
  }
}
</script>

<style scoped>
.user-row {
  transition: background-color 0.2s ease;
}

.user-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>