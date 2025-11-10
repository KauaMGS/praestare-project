import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Fullscreen from "./layouts/fullscreen.vue";
import Blank from "./layouts/blank.vue";
import vuetify from "./plugins/vuetify.js";
import router from "./router/router.js";
import store from "@/store/index.js";

const app = createApp(App);

const token = localStorage.getItem('token');
const usuarioStr = localStorage.getItem('usuario');

if (token && usuarioStr) {
    try {
        const usuario = JSON.parse(usuarioStr);
        store.commit('_setLogin', { token, usuario });
        store.commit('_setLoginUsuario', usuario);
    } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }
}


app.component('layout-fullscreen', Fullscreen);
app.component('layout-blank', Blank);

app.use(store);
app.use(vuetify);
app.use(router);

app.mount('#app');