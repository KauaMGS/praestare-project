import {MontarRota} from "../utils/MontarRota.js";
import Papel from "@/utils/Papel.js";

const RouterDenuncias = [
    MontarRota("/denuncias",
        import("@/views/denuncias/denuncias.vue"),
        "layout-fullscreen",
        [
            Papel.COMUM
        ]
        ,"Denuncias"
    ),
    MontarRota("/admin/aprovar-denuncias",
        import("@/views/denuncias/aprovar-denuncias.vue"),
        "layout-fullscreen",
        [
            Papel.ADMIN
        ]
        ,"Aprovar denuncias"
    )
]

export default RouterDenuncias;