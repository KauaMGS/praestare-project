import {MontarRota} from "../utils/MontarRota.js";
import Papel from "@/utils/Papel.js";

const RouterLogin = [
    MontarRota("/login",
        import("@/views/login/login.vue"),
        "layout-blank",
        [
            Papel.COMUM
        ],
        "Login"
    )
]

export default RouterLogin;