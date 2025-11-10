import api from "../api-config.js"
import Papel from "@/utils/Papel.js";
import router from "@/router/router.js";

const getDefaultStates = () => {
    return {
        stateLogin: [],
        stateLoginUsuario: {},
        stateLoadingLogin: false,
    }
};

export default {
    state: getDefaultStates(),
    getters: {
        stateLogin: (state) => state.stateLogin,
        stateLoginUsuario: (state) => state.stateLoginUsuario,
        stateLoadingLogin: (state) => state.stateLoadingLogin,
    },
    mutations: {
        _setLogin(state, data) {
            state.stateLogin = data;
        },
        _setLoginUsuario(state, data) {
            state.stateLoginUsuario = data;
        },
        _setLoadingLogin(state, data) {
            state.stateLoadingLogin = data;
        },
        _resetStateLogin(state) {
            Object.assign(state, getDefaultStates());
        }
    },
    actions: {
        async actionRegistrar({ commit }) {
            commit("_setLoadingLogin", true);

            const dados = this.state.StoreLogin.stateLoginUsuario;

            const payload = {
                name: dados.nome,
                email: dados.email,
                password: dados.senha,
                usuarioType: Papel.COMUM
            };

            try {
                const response = await api.post("/usuario", payload);
                console.log("Usuário registrado:", response.data);
                return response.data;
            } catch (error) {
                console.error("Erro ao registrar:", error.response?.data || error.message);
                throw error.response?.data || "Erro ao registrar usuário.";
            } finally {
                commit("_setLoadingLogin", false);
            }
        },

        async actionLogin({ commit }) {
            commit("_setLoadingLogin", true);

            const credentials = this.state.StoreLogin.stateLoginUsuario;

            const payload = {
                email: credentials.email,
                password: credentials.senha,
            };

            try {
                const response = await api.post("/login", payload);

                const { tokenJWT, id, name, email, usuarioType } = response.data;

                localStorage.setItem("token", tokenJWT);
                localStorage.setItem("usuario", JSON.stringify({ id, name, email, papel: usuarioType }));

                commit("_setLogin", { token: tokenJWT, usuario: { id, name, email, papel: usuarioType } });
                return { id, name, email };
            } catch (error) {
                console.error("Erro ao fazer login:", error.response?.data || error.message);
                throw error;
            } finally {
                commit("_setLoadingLogin", false);
                await router.push("/");
            }
        },
        async actionLogout({ commit }) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            commit("_resetStateLogin");
        },
    }

}