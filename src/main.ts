import { createApp } from "vue";
//引入ckeditor CSS
import "./styles/ckeditor.css";

import App from "./App.vue";
import router from "@/router";

import { setupStore } from "@/store";
import { setupDirective } from "@/directive";
import { setupElIcons, setupI18n, setupPermission } from "@/plugins";
import CKEditor from "@ckeditor/ckeditor5-vue";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";



const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);
// 全局注册Element-plus图标
setupElIcons(app);
// 国际化
setupI18n(app);
// 注册动态路由,每次變更路由都會執行
setupPermission();

//最後才進行掛載
app.use(router).use(CKEditor).mount("#app");
