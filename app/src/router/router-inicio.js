import {MontarRota} from "../utils/MontarRota.js";
import Papel from "@/utils/Papel.js";

const RouterInicio = [
    MontarRota("/inicio",
        import("@/views/dashboard/dashboard.vue"),
        "layout-fullscreen",
        [
            Papel.COMUM
        ],
        "Inicio"
    )
]

export default RouterInicio;