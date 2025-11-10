import {MontarRota} from "../utils/MontarRota.js";
import Papel from "@/utils/Papel.js";

const RouterUsuarios = [
    MontarRota("/admin/usuarios",
        import("@/views/usuarios/usuarios.vue"),
        "layout-fullscreen",
        [
            Papel.ADMIN
        ],
        "Usuários"
    )
]

export default RouterUsuarios;