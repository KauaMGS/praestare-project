import api from "../api-config.js"

const getDefaultStates = () => {
    return {
        stateDenuncia: {},
        stateDenuncias: {},
        stateFiltroDenuncias: {},
        stateLoadingListarDenuncia: false,
        stateLoadingListarDenuncias: false,
        statePaginacaoDenuncias: { page: 1, size:10 },
        statePaginacaoDenunciasQuantidade: [
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
        stateDenuncia: (state) => state.stateDenuncia,
        stateDenuncias: (state) => state.stateDenuncias,
        stateFiltroDenuncias: (state) => state.stateFiltroDenuncias,
        stateLoadingListarDenuncia: (state) => state.stateLoadingListarDenuncia,
        stateLoadingListarDenuncias: (state) => state.stateLoadingListarDenuncias,
        statePaginacaoDenuncias: (state) => state.statePaginacaoDenuncias,
        statePaginacaoDenunciasQuantidade: (state) => state.statePaginacaoDenunciasQuantidade,
    },
    mutations: {
        _setDenuncia(state, data) {
            state.stateDenuncia = data;
        },
        _setDenuncias(state, data) {
            state.stateDenuncias = data;
        },
        _setFiltroDenuncias(state, data) {
            state.stateFiltroDenuncias = data;
        },
        _resetStateDenuncia(state) {
            Object.assign(state, getDefaultStates());
        }
    },
    actions: {
        actionResetStateDenuncia({commit}) {
            commit('_resetStateDenuncia');
        },
        async actionListarDenunciasPorStatus({commit, dispatch}) {
            const status = this.state.StoreDenuncia.stateFiltroDenuncias.status;

            try {
                const response = await api.get(`/denuncias/status/${status}`);

                commit('_setDenuncias', response.data);
                return response.data;
            } catch (e) {
                throw e;
            }
        },
        async actionCadastrarDenuncia({commit, dispatch}) {
            let denuncia = this.state.StoreDenuncia.stateDenuncia;

            denuncia.usuarioId = this.state.StoreLogin.stateLoginUsuario.id;
            denuncia.status = "PENDENTE";

            try {
                const response = await api.post(`/denuncias`, denuncia);

                commit('_setDenuncia', response.data);
                return response.data;
            } catch (e) {
                throw e;
            } finally {
                dispatch('actionResetStateDenuncia');
            }
        }
    }

}