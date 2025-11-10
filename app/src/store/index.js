import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import StoreLogin from "./modules/StoreLogin.js";
import StoreUsuario from "@/store/modules/StoreUsuario.js";
import StoreVerificacao from "@/store/modules/StoreVerificacao.js";
import StoreDenuncia from "@/store/modules/StoreDenuncia.js";

export default createStore({
    modules: {
        StoreLogin,
        StoreUsuario,
        StoreVerificacao,
        StoreDenuncia
    },
    plugins: [createPersistedState({
        storage: window.localStorage,
        paths: [
            'StoreLogin',
            'StoreUsuario',
            'StoreVerificacao',
            'StoreDenuncia'
        ]
    })],
});