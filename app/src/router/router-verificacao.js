import {MontarRota} from "@/utils/MontarRota.js";
import Papel from "@/utils/Papel.js";

const RouterVerificacao = [
    MontarRota("/verificacao",
        import("@/views/verificacoes/verificacao.vue"),
        "layout-fullscreen",
        [
            Papel.COMUM
        ],
        "Verificação"
    )
]

export default RouterVerificacao;