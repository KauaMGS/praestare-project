import api from "../api-config.js"

const getDefaultStates = () => {
    return {
        stateVerificacao: {},
        stateRespostaVerificacao: {}
    }
};

export default {
    state: getDefaultStates(),
    getters: {
        stateVerificacao: (state) => state.stateVerificacao,
        stateRespostaVerificacao: (state) => state.stateRespostaVerificacao
    },
    mutations: {
        _setStateVerificacao(state, data) {
            state.stateVerificacao = data;
        },
        _setStateRespostaVerificacao(state, data) {
            state.stateRespostaVerificacao = data;
        }
    },
    actions: {
        actionResetStateVerificacao({commit}) {
            commit('_setStateVerificacao', Object.assign({}));
        },
        actionSetStateRespostaVerificacao({commit}, data) {
            commit('_setStateRespostaVerificacao', data);
        },
        async actionAnalisarEmprestimo({commit, dispatch}) {
            const data = this.state.StoreVerificacao.stateVerificacao;

            try {
                const response = await api.post(`/analise-emprestimo`, data);

                commit('_setStateRespostaVerificacao', response.data);
                return response.data;
            } catch (e) {
                throw e;
            } finally {
                dispatch('actionResetStateVerificacao');
            }
        }
    }

}