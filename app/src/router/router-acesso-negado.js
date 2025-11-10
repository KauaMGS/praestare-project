import {MontarRota} from "../utils/MontarRota.js";

const RouterAcessoNegado = [
    MontarRota("/acesso-negado",
        import("@/views/acesso-negado/acesso-negado.vue"),
        "layout-blank",
        [],
        "Acesso negado"
    )
]

export default RouterAcessoNegado;