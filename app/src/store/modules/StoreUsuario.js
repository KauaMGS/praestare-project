import api from "../api-config.js"
import {ca} from "vuetify/locale";

const getDefaultStates = () => {
    return {
        stateUsuario: {},
        stateUsuarios: {},
        stateLoadingListarUsuario: false,
        stateLoadingListarUsuarios: false,
        statePaginacaoUsuarios: { page: 1, size:10 },
        statePaginacaoUsuariosQuantidade: [
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
        ]
    }
};

export default {
    state: getDefaultStates(),
    getters: {
        stateUsuario: (state) => state.stateUsuario,
        stateUsuarios: (state) => state.stateUsuarios,
        stateLoadingListarUsuario: (state) => state.stateLoadingListarUsuario,
        stateLoadingListarUsuarios: (state) => state.stateLoadingListarUsuarios,
        statePaginacaoUsuarios: (state) => state.statePaginacaoUsuarios,
        statePaginacaoUsuariosQuantidade: (state) => state.statePaginacaoUsuariosQuantidade,
    },
    mutations: {
        _setUsuario(state, data) {
            state.stateUsuario = data;
        },
        _setLoadingListarUsuarios(state, data) {
            state.stateLoadingListarUsuarios = data;
        },
        _setLoadingListarUsuario(state, data) {
            state.stateLoadingListarUsuario = data;
        },
        _setPaginacaoUsuarios(state, data) {
            state.statePaginacaoUsuarios = data;
        },
        _setUsuarios(state, data) {
            state.stateUsuarios = data;
        },
        _resetStateUsuario(state) {
            Object.assign(state, getDefaultStates());
        }
    },
    actions: {
        actionResetStateUsuario({commit}) {
            commit('_resetStateUsuario');
        },
        async actionListarUsuarios({commit, dispatch}) {
            commit('_setLoadingListarUsuarios', true);

            try {
                const response = await api.get(`/usuario`);

                commit('_setUsuarios', response.data);
                return response.data;
            } catch (e) {
                throw e;
            } finally {
                commit('_setLoadingListarUsuarios', false);
            }
        }
    }

}