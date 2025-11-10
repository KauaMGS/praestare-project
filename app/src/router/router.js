import {createRouter, createWebHistory} from "vue-router";

import RouterInicio from "./router-inicio.js";
import RouterVerificacao from "./router-verificacao.js";
import RouterDenuncias from "./router-denuncias.js";
import RouterLogin from "@/router/router-login.js";
import store from "@/store/index.js";
import RouterAcessoNegado from "@/router/router-acesso-negado.js";
import RouterUsuarios from "@/router/router-usuarios.js";

const routes = [
    ...RouterInicio,
    ...RouterVerificacao,
    ...RouterDenuncias,
    ...RouterLogin,
    ...RouterAcessoNegado,
    ...RouterUsuarios,
    {
        path: "/",
        redirect: (to) => {
            const usuario = store.getters.stateLogin.usuario;

            if (!usuario) {
                return "/login";
            }

            if (usuario.papel === 'ADMIN') {
                return "/admin/aprovar-denuncias";
            }

            return "/inicio";
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const user = store.getters.stateLogin.usuario;
    const paginasPublicas = ['/login', '/acesso-negado'];
    const ehPaginaPublica = paginasPublicas.includes(to.path);

    if (ehPaginaPublica) {
        if (to.path === '/login' && user) {
            if (user.papel === 'ADMIN') {
                next('/admin/aprovar-denuncias');
            } else {
                next('/inicio');
            }
        } else {
            next();
        }
        return;
    }

    if (!user) {
        next('/login');
        return;
    }

    const requiredRoles = to.meta.papeis;

    if (requiredRoles && requiredRoles.length > 0) {
        const userRole = user.papel;

        if (requiredRoles.includes(userRole)) {
            next();
        } else {
            next('/acesso-negado');
        }
    } else {
        next();
    }
});

export default router;