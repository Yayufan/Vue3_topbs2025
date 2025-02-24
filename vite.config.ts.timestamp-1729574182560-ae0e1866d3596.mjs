// vite.config.ts
import vue from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { loadEnv, defineConfig } from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/vite/dist/node/index.js";
import AutoImport from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unplugin-icons/dist/resolver.js";
import { createSvgIconsPlugin } from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import mockDevServerPlugin from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import UnoCSS from "file:///D:/GitHub/GitHub_local/Vue3_organ/node_modules/unocss/dist/vite.mjs";
import { resolve } from "path";

// package.json
var name = "vue3-element-admin";
var version = "2.9.3";
var dependencies = {
  "@ckeditor/ckeditor5-vue": "^6.0.0",
  "@element-plus/icons-vue": "^2.3.1",
  "@vueuse/core": "^10.9.0",
  "animate.css": "^4.1.1",
  axios: "^1.6.8",
  ckeditor5: "^42.0.0",
  echarts: "^5.5.0",
  "element-plus": "^2.7.4",
  "lodash-es": "^4.17.21",
  net: "^1.0.2",
  nprogress: "^0.2.0",
  "path-browserify": "^1.0.1",
  "path-to-regexp": "^6.2.2",
  pinia: "^2.1.7",
  "sockjs-client": "1.6.1",
  sortablejs: "^1.15.2",
  stompjs: "^2.3.3",
  vue: "^3.4.21",
  "vue-i18n": "9.9.1",
  "vue-router": "^4.3.0",
  xlsx: "^0.18.5"
};
var devDependencies = {
  "@commitlint/cli": "^18.6.1",
  "@commitlint/config-conventional": "^18.6.3",
  "@iconify-json/ep": "^1.1.15",
  "@types/lodash": "^4.17.0",
  "@types/node": "^20.12.7",
  "@types/nprogress": "^0.2.3",
  "@types/path-browserify": "^1.0.2",
  "@types/sockjs-client": "^1.5.4",
  "@types/sortablejs": "^1.15.8",
  "@types/stompjs": "^2.3.9",
  "@typescript-eslint/eslint-plugin": "^7.6.0",
  "@typescript-eslint/parser": "^7.6.0",
  "@vitejs/plugin-vue": "^5.0.4",
  "@vitejs/plugin-vue-jsx": "^3.1.0",
  autoprefixer: "^10.4.19",
  commitizen: "^4.3.0",
  "cz-git": "^1.9.1",
  eslint: "^8.57.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-import": "^2.29.1",
  "eslint-plugin-prettier": "^5.1.3",
  "eslint-plugin-vue": "^9.25.0",
  "fast-glob": "^3.3.2",
  husky: "^9.0.11",
  "lint-staged": "^15.2.2",
  postcss: "^8.4.38",
  "postcss-html": "^1.6.0",
  "postcss-scss": "^4.0.9",
  prettier: "^3.2.5",
  sass: "^1.75.0",
  stylelint: "^16.3.1",
  "stylelint-config-html": "^1.1.0",
  "stylelint-config-recess-order": "^4.6.0",
  "stylelint-config-recommended-scss": "^14.0.0",
  "stylelint-config-recommended-vue": "^1.5.0",
  "stylelint-config-standard": "^36.0.0",
  terser: "^5.30.3",
  typescript: "^5.4.5",
  unocss: "^0.58.9",
  "unplugin-auto-import": "^0.17.5",
  "unplugin-icons": "^0.18.5",
  "unplugin-vue-components": "^0.26.0",
  vite: "^5.2.8",
  "vite-plugin-mock-dev-server": "^1.5.0",
  "vite-plugin-svg-icons": "^2.0.1",
  "vue-tsc": "^2.0.13"
};
var engines = {
  node: ">=18.0.0"
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\GitHub\\GitHub_local\\Vue3_organ";
var __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now()
};
var pathSrc = resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    //基礎路徑,預設為/,如果需要放在Nginx內的子目錄這邊也要進行設置
    base: "/background",
    resolve: {
      alias: {
        "@": pathSrc
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    server: {
      // 允许IP访问
      host: "0.0.0.0",
      // 应用端口 (默認:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "")
        },
        [env.VITE_MINIO_API]: {
          changeOrigin: true,
          // Minio接口地址
          target: env.VITE_MINIO_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_MINIO_API), "")
        }
      }
    },
    plugins: [
      vue(),
      // jsx、tsx语法支持
      vueJsx(),
      // MOCK 服务
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS({
        hmrTopLevelAwait: false
      }),
      // 自动导入参考： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({})
        ],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后設置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/typings/auto-imports.d.ts",
      }),
      //unplugin-vue-components 
      /**
       * 
       * unplugin-vue-components 是一個 Vue.js 生態系統的 Vite 插件，它提供了一種簡單的方式來自動掃描和註冊 Vue 組件，
       * 使其成為全局組件，從而讓你在整個應用程式中都能夠使用這些組件。
       * 具體來說，在 Vite 專案中使用 unplugin-vue-components，它可以幫助你：
       * 
       * 1.自動掃描組件: 通過設置適當的目錄或模式，它可以自動從指定的目錄中掃描 Vue 組件。
       * 2.註冊全局組件: 掃描到的組件將被自動註冊為全局組件，這樣你就無需在每個單獨的組件中進行手動的引入和註冊，而是可以直接在任何地方使用這些組件。
       * 3.動態載入: 在需要時動態地載入和註冊組件，從而使得你的應用程式可以更靈活地管理組件的使用。
       * 4.總的來說，unplugin-vue-components 能夠節省開發者的時間，提高開發效率，同時也能夠幫助保持代碼的整潔和一致性，使得在 Vue.js 應用程式中管理和使用組件變得更加容易。
       * 
       */
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ["ep"]
          })
        ],
        // 指定自定义组件位置(默認:src/components),這邊正是引入了
        //dirs: ["src/components", "src/**/components"],
        //dirs 配置項是用於指定要掃描的目錄的相對路徑或匹配模式。
        //當使用像 unplugin-vue-components 這樣的工具時，dirs 配置項用於告訴它去哪裡尋找 Vue 組件，並將它們自動註冊為全局組件。
        //這邊要注意,像是這樣寫, 是在src的任意目錄下的/components的 index.vue喔, 不是就不會登入成全局組件
        dirs: ["src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/typings/components.d.ts",
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹,這裡的pathSrc 就是 src
        iconDirs: [resolve(pathSrc, "assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "path-browserify",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/statistic/style/css",
        "element-plus/es/components/watermark/style/css",
        "element-plus/es/components/config-provider/style/css",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/drawer/style/css",
        "element-plus/es/components/color-picker/style/css"
      ]
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2e3,
      // 消除打包大小超过500kb警告
      minify: "terser",
      // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true,
          // 生产环境去除 console
          drop_debugger: true
          // 生产环境去除 debugger
        },
        format: {
          comments: false
          // 删除注释
        }
      },
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          }
        }
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcR2l0SHViXFxcXEdpdEh1Yl9sb2NhbFxcXFxWdWUzX29yZ2FuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxHaXRIdWJcXFxcR2l0SHViX2xvY2FsXFxcXFZ1ZTNfb3JnYW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0dpdEh1Yi9HaXRIdWJfbG9jYWwvVnVlM19vcmdhbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCB7IFVzZXJDb25maWcsIENvbmZpZ0VudiwgbG9hZEVudiwgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCBJY29ucyBmcm9tIFwidW5wbHVnaW4taWNvbnMvdml0ZVwiO1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcclxuXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgbW9ja0RldlNlcnZlclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tbW9jay1kZXYtc2VydmVyXCI7XHJcblxyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHtcclxuICBuYW1lLFxyXG4gIHZlcnNpb24sXHJcbiAgZW5naW5lcyxcclxuICBkZXBlbmRlbmNpZXMsXHJcbiAgZGV2RGVwZW5kZW5jaWVzLFxyXG59IGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xyXG5cclxuLyoqIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTQwRFx1NzlGMFx1MzAwMVx1NzI0OFx1NjcyQ1x1MzAwMVx1OEZEMFx1ODg0Q1x1NjI0MFx1OTcwMFx1NzY4NGBub2RlYFx1NzI0OFx1NjcyQ1x1MzAwMVx1NEY5RFx1OEQ1Nlx1MzAwMVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NjNEMFx1NzkzQSAqL1xyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGVuZ2luZXMsIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXHJcbiAgYnVpbGRUaW1lc3RhbXA6IERhdGUubm93KCksXHJcbn07XHJcblxyXG5jb25zdCBwYXRoU3JjID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xyXG4vLyAgaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xyXG4gIHJldHVybiB7XHJcbiAgICAvL1x1NTdGQVx1NzkwRVx1OERFRlx1NUY5MSxcdTk4MTBcdThBMkRcdTcwQkEvLFx1NTk4Mlx1Njc5Q1x1OTcwMFx1ODk4MVx1NjUzRVx1NTcyOE5naW54XHU1MTY3XHU3Njg0XHU1QjUwXHU3NkVFXHU5MzA0XHU5MDE5XHU5MDhBXHU0RTVGXHU4OTgxXHU5MDMyXHU4ODRDXHU4QTJEXHU3RjZFXHJcbiAgICBiYXNlOiBcIi9iYWNrZ3JvdW5kXCIsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGhTcmMsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIC8vIENTUyBcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIC8vIFx1NUI5QVx1NEU0OVx1NTE2OFx1NUM0MCBTQ1NTIFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICAgICAgQHVzZSBcIkAvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcclxuICAgICAgICAgIGAsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gXHU1MTQxXHU4QkI4SVBcdThCQkZcdTk1RUVcclxuICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICAgIC8vIFx1NUU5NFx1NzUyOFx1N0FFRlx1NTNFMyAoXHU5RUQ4XHU4QThEOjMwMDApXHJcbiAgICAgIHBvcnQ6IE51bWJlcihlbnYuVklURV9BUFBfUE9SVCksXHJcbiAgICAgIC8vIFx1OEZEMFx1ODg0Q1x1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIC8qKiBcdTRFRTNcdTc0MDZcdTUyNERcdTdGMDBcdTRFM0EgL2Rldi1hcGkgXHU3Njg0XHU4QkY3XHU2QzQyICAqL1xyXG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOiB7XHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAvLyBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcclxuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBQX0FQSV9VUkwsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT5cclxuICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBlbnYuVklURV9BUFBfQkFTRV9BUEkpLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFtlbnYuVklURV9NSU5JT19BUEldOiB7XHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAvLyBNaW5pb1x1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFxyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9NSU5JT19BUElfVVJMLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XHJcbiAgICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgZW52LlZJVEVfTUlOSU9fQVBJKSwgXCJcIiksXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIC8vIGpzeFx1MzAwMXRzeFx1OEJFRFx1NkNENVx1NjUyRlx1NjMwMVxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgLy8gTU9DSyBcdTY3MERcdTUyQTFcclxuICAgICAgZW52LlZJVEVfTU9DS19ERVZfU0VSVkVSID09PSBcInRydWVcIiA/IG1vY2tEZXZTZXJ2ZXJQbHVnaW4oKSA6IG51bGwsXHJcbiAgICAgIFVub0NTUyh7XHJcbiAgICAgICAgaG1yVG9wTGV2ZWxBd2FpdDogZmFsc2UsXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTUzQzJcdTgwMDNcdUZGMUEgaHR0cHM6Ly9naXRodWIuY29tL3N4enovZWxlbWVudC1wbHVzLWJlc3QtcHJhY3RpY2VzL2Jsb2IvbWFpbi92aXRlLmNvbmZpZy50c1xyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgVnVlIFx1NzZGOFx1NTE3M1x1NTFGRFx1NjU3MFx1RkYwQ1x1NTk4Mlx1RkYxQXJlZiwgcmVhY3RpdmUsIHRvUmVmIFx1N0I0OVxyXG4gICAgICAgIGltcG9ydHM6IFtcInZ1ZVwiLCBcIkB2dWV1c2UvY29yZVwiLCBcInBpbmlhXCIsIFwidnVlLXJvdXRlclwiLCBcInZ1ZS1pMThuXCJdLFxyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFFbE1lc3NhZ2UsIEVsTWVzc2FnZUJveC4uLiAoXHU1RTI2XHU2ODM3XHU1RjBGKVxyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHt9KSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTAgZXNsaW50IFx1ODlDNFx1NTIxOVx1RkYwQ1x1NUVGQVx1OEJBRVx1NzUxRlx1NjIxMFx1NEU0Qlx1NTQwRVx1OEEyRFx1N0Y2RSBmYWxzZVxyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTUxRkRcdTY1NzAgZXNsaW50IFx1ODlDNFx1NTIxOVx1NzY4NFx1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgZmlsZXBhdGg6IFwiLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvblwiLFxyXG4gICAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1NjYyRlx1NTQyNlx1NTcyOCB2dWUgXHU2QTIxXHU2NzdGXHU0RTJEXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHJcbiAgICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXHJcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1MUZEXHU2NTcwVFNcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODQgKGZhbHNlOlx1NTE3M1x1OTVFRFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMClcclxuICAgICAgICBkdHM6IGZhbHNlLFxyXG4gICAgICAgIC8vIGR0czogXCJzcmMvdHlwaW5ncy9hdXRvLWltcG9ydHMuZC50c1wiLFxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBcclxuICAgICAgICogdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgXHU2NjJGXHU0RTAwXHU1MDBCIFZ1ZS5qcyBcdTc1MUZcdTYxNEJcdTdDRkJcdTdENzFcdTc2ODQgVml0ZSBcdTYzRDJcdTRFRjZcdUZGMENcdTVCODNcdTYzRDBcdTRGOUJcdTRFODZcdTRFMDBcdTdBMkVcdTdDMjFcdTU1QUVcdTc2ODRcdTY1QjlcdTVGMEZcdTRGODZcdTgxRUFcdTUyRDVcdTYzODNcdTYzQ0ZcdTU0OENcdThBM0JcdTUxOEEgVnVlIFx1N0Q0NFx1NEVGNlx1RkYwQ1xyXG4gICAgICAgKiBcdTRGN0ZcdTUxNzZcdTYyMTBcdTcwQkFcdTUxNjhcdTVDNDBcdTdENDRcdTRFRjZcdUZGMENcdTVGOUVcdTgwMENcdThCOTNcdTRGNjBcdTU3MjhcdTY1NzRcdTUwMEJcdTYxQzlcdTc1MjhcdTdBMEJcdTVGMEZcdTRFMkRcdTkwRkRcdTgwRkRcdTU5MjBcdTRGN0ZcdTc1MjhcdTkwMTlcdTRFOUJcdTdENDRcdTRFRjZcdTMwMDJcclxuICAgICAgICogXHU1MTc3XHU5QUQ0XHU0Rjg2XHU4QUFBXHVGRjBDXHU1NzI4IFZpdGUgXHU1QzA4XHU2ODQ4XHU0RTJEXHU0RjdGXHU3NTI4IHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzXHVGRjBDXHU1QjgzXHU1M0VGXHU0RUU1XHU1RTZCXHU1MkE5XHU0RjYwXHVGRjFBXHJcbiAgICAgICAqIFxyXG4gICAgICAgKiAxLlx1ODFFQVx1NTJENVx1NjM4M1x1NjNDRlx1N0Q0NFx1NEVGNjogXHU5MDFBXHU5MDRFXHU4QTJEXHU3RjZFXHU5MDY5XHU3NTc2XHU3Njg0XHU3NkVFXHU5MzA0XHU2MjE2XHU2QTIxXHU1RjBGXHVGRjBDXHU1QjgzXHU1M0VGXHU0RUU1XHU4MUVBXHU1MkQ1XHU1RjlFXHU2MzA3XHU1QjlBXHU3Njg0XHU3NkVFXHU5MzA0XHU0RTJEXHU2MzgzXHU2M0NGIFZ1ZSBcdTdENDRcdTRFRjZcdTMwMDJcclxuICAgICAgICogMi5cdThBM0JcdTUxOEFcdTUxNjhcdTVDNDBcdTdENDRcdTRFRjY6IFx1NjM4M1x1NjNDRlx1NTIzMFx1NzY4NFx1N0Q0NFx1NEVGNlx1NUMwN1x1ODhBQlx1ODFFQVx1NTJENVx1OEEzQlx1NTE4QVx1NzBCQVx1NTE2OFx1NUM0MFx1N0Q0NFx1NEVGNlx1RkYwQ1x1OTAxOVx1NkEyM1x1NEY2MFx1NUMzMVx1NzEyMVx1OTcwMFx1NTcyOFx1NkJDRlx1NTAwQlx1NTVBRVx1NzM2OFx1NzY4NFx1N0Q0NFx1NEVGNlx1NEUyRFx1OTAzMlx1ODg0Q1x1NjI0Qlx1NTJENVx1NzY4NFx1NUYxNVx1NTE2NVx1NTQ4Q1x1OEEzQlx1NTE4QVx1RkYwQ1x1ODAwQ1x1NjYyRlx1NTNFRlx1NEVFNVx1NzZGNFx1NjNBNVx1NTcyOFx1NEVGQlx1NEY1NVx1NTczMFx1NjVCOVx1NEY3Rlx1NzUyOFx1OTAxOVx1NEU5Qlx1N0Q0NFx1NEVGNlx1MzAwMlxyXG4gICAgICAgKiAzLlx1NTJENVx1NjE0Qlx1OEYwOVx1NTE2NTogXHU1NzI4XHU5NzAwXHU4OTgxXHU2NjQyXHU1MkQ1XHU2MTRCXHU1NzMwXHU4RjA5XHU1MTY1XHU1NDhDXHU4QTNCXHU1MThBXHU3RDQ0XHU0RUY2XHVGRjBDXHU1RjlFXHU4MDBDXHU0RjdGXHU1Rjk3XHU0RjYwXHU3Njg0XHU2MUM5XHU3NTI4XHU3QTBCXHU1RjBGXHU1M0VGXHU0RUU1XHU2NkY0XHU5NzQ4XHU2RDNCXHU1NzMwXHU3QkExXHU3NDA2XHU3RDQ0XHU0RUY2XHU3Njg0XHU0RjdGXHU3NTI4XHUzMDAyXHJcbiAgICAgICAqIDQuXHU3RTNEXHU3Njg0XHU0Rjg2XHU4QUFBXHVGRjBDdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgXHU4MEZEXHU1OTIwXHU3QkMwXHU3NzAxXHU5NThCXHU3NjdDXHU4MDA1XHU3Njg0XHU2NjQyXHU5NTkzXHVGRjBDXHU2M0QwXHU5QUQ4XHU5NThCXHU3NjdDXHU2NTQ4XHU3Mzg3XHVGRjBDXHU1NDBDXHU2NjQyXHU0RTVGXHU4MEZEXHU1OTIwXHU1RTZCXHU1MkE5XHU0RkREXHU2MzAxXHU0RUUzXHU3OEJDXHU3Njg0XHU2NTc0XHU2RjU0XHU1NDhDXHU0RTAwXHU4MUY0XHU2MDI3XHVGRjBDXHU0RjdGXHU1Rjk3XHU1NzI4IFZ1ZS5qcyBcdTYxQzlcdTc1MjhcdTdBMEJcdTVGMEZcdTRFMkRcdTdCQTFcdTc0MDZcdTU0OENcdTRGN0ZcdTc1MjhcdTdENDRcdTRFRjZcdThCOEFcdTVGOTdcdTY2RjRcdTUyQTBcdTVCQjlcdTY2MTNcdTMwMDJcclxuICAgICAgICogXHJcbiAgICAgICAqL1xyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXHJcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICAvLyBlbGVtZW50LXBsdXNcdTU2RkVcdTY4MDdcdTVFOTNcdUZGMENcdTUxNzZcdTRFRDZcdTU2RkVcdTY4MDdcdTVFOTMgaHR0cHM6Ly9pY29uLXNldHMuaWNvbmlmeS5kZXNpZ24vXHJcbiAgICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogW1wiZXBcIl0sXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1ODFFQVx1NUI5QVx1NEU0OVx1N0VDNFx1NEVGNlx1NEY0RFx1N0Y2RShcdTlFRDhcdThBOEQ6c3JjL2NvbXBvbmVudHMpLFx1OTAxOVx1OTA4QVx1NkI2M1x1NjYyRlx1NUYxNVx1NTE2NVx1NEU4NlxyXG4gICAgICAgIC8vZGlyczogW1wic3JjL2NvbXBvbmVudHNcIiwgXCJzcmMvKiovY29tcG9uZW50c1wiXSxcclxuICAgICAgICAvL2RpcnMgXHU5MTREXHU3RjZFXHU5ODA1XHU2NjJGXHU3NTI4XHU2NUJDXHU2MzA3XHU1QjlBXHU4OTgxXHU2MzgzXHU2M0NGXHU3Njg0XHU3NkVFXHU5MzA0XHU3Njg0XHU3NkY4XHU1QzBEXHU4REVGXHU1RjkxXHU2MjE2XHU1MzM5XHU5MTREXHU2QTIxXHU1RjBGXHUzMDAyXHJcbiAgICAgICAgLy9cdTc1NzZcdTRGN0ZcdTc1MjhcdTUwQ0YgdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMgXHU5MDE5XHU2QTIzXHU3Njg0XHU1REU1XHU1MTc3XHU2NjQyXHVGRjBDZGlycyBcdTkxNERcdTdGNkVcdTk4MDVcdTc1MjhcdTY1QkNcdTU0NEFcdThBMzRcdTVCODNcdTUzQkJcdTU0RUFcdTg4RTFcdTVDMEJcdTYyN0UgVnVlIFx1N0Q0NFx1NEVGNlx1RkYwQ1x1NEUyNlx1NUMwN1x1NUI4M1x1NTAxMVx1ODFFQVx1NTJENVx1OEEzQlx1NTE4QVx1NzBCQVx1NTE2OFx1NUM0MFx1N0Q0NFx1NEVGNlx1MzAwMlxyXG4gICAgICAgIC8vXHU5MDE5XHU5MDhBXHU4OTgxXHU2Q0U4XHU2MTBGLFx1NTBDRlx1NjYyRlx1OTAxOVx1NkEyM1x1NUJFQiwgXHU2NjJGXHU1NzI4c3JjXHU3Njg0XHU0RUZCXHU2MTBGXHU3NkVFXHU5MzA0XHU0RTBCXHU3Njg0L2NvbXBvbmVudHNcdTc2ODQgaW5kZXgudnVlXHU1NTk0LCBcdTRFMERcdTY2MkZcdTVDMzFcdTRFMERcdTY3MDNcdTc2N0JcdTUxNjVcdTYyMTBcdTUxNjhcdTVDNDBcdTdENDRcdTRFRjZcclxuICAgICAgICBkaXJzOiBbXCJzcmMvKiovY29tcG9uZW50c1wiLF0sXHJcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2VFNcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODQgKGZhbHNlOlx1NTE3M1x1OTVFRFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMClcclxuICAgICAgICBkdHM6IGZhbHNlLFxyXG4gICAgICAgIC8vIGR0czogXCJzcmMvdHlwaW5ncy9jb21wb25lbnRzLmQudHNcIixcclxuICAgICAgfSksXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCODlcdTg4QzVcdTU2RkVcdTY4MDdcdTVFOTNcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzksXHU5MDE5XHU4OEUxXHU3Njg0cGF0aFNyYyBcdTVDMzFcdTY2MkYgc3JjXHJcbiAgICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHBhdGhTcmMsIFwiYXNzZXRzL2ljb25zXCIpXSxcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxyXG4gICAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIC8vIFx1OTg4NFx1NTJBMFx1OEY3RFx1OTg3OVx1NzZFRVx1NUZDNVx1OTcwMFx1NzY4NFx1N0VDNFx1NEVGNlxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICBcInZ1ZVwiLFxyXG4gICAgICAgIFwidnVlLXJvdXRlclwiLFxyXG4gICAgICAgIFwicGluaWFcIixcclxuICAgICAgICBcImF4aW9zXCIsXHJcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcclxuICAgICAgICBcInNvcnRhYmxlanNcIixcclxuICAgICAgICBcInBhdGgtdG8tcmVnZXhwXCIsXHJcbiAgICAgICAgXCJlY2hhcnRzXCIsXHJcbiAgICAgICAgXCJAd2FuZ2VkaXRvci9lZGl0b3JcIixcclxuICAgICAgICBcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCIsXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgIFwicGF0aC1icm93c2VyaWZ5XCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnV0dG9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW5wdXQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC1udW1iZXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zd2l0Y2gvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy91cGxvYWQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaWNvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Jvdy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhZy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RpYWxvZy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xvYWRpbmcvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhZGlvLWdyb3VwL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcG9wb3Zlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Njcm9sbGJhci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Rvb2x0aXAvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLW1lbnUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3ViLW1lbnUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51LWl0ZW0vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaXZpZGVyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FyZC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xpbmsvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFibGUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlLXNlbGVjdC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYmxlLWNvbHVtbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlbGVjdC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL29wdGlvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BhZ2luYXRpb24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYWxlcnQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1idXR0b24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1ncm91cC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrYm94L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFicy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYi1wYW5lL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmF0ZS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RhdGUtcGlja2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW1hZ2Uvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zdGF0aXN0aWMvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy93YXRlcm1hcmsvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb25maWctcHJvdmlkZXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZXh0L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJhd2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sb3ItcGlja2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIC8vIFx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RVxyXG4gICAgYnVpbGQ6IHtcclxuXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMCwgLy8gXHU2RDg4XHU5NjY0XHU2MjUzXHU1MzA1XHU1OTI3XHU1QzBGXHU4RDg1XHU4RkM3NTAwa2JcdThCNjZcdTU0NEFcclxuICAgICAgbWluaWZ5OiBcInRlcnNlclwiLCAvLyBWaXRlIDIuNi54IFx1NEVFNVx1NEUwQVx1OTcwMFx1ODk4MVx1OTE0RFx1N0Y2RSBtaW5pZnk6IFwidGVyc2VyXCIsIHRlcnNlck9wdGlvbnMgXHU2MjREXHU4MEZEXHU3NTFGXHU2NTQ4XHJcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgICBjb21wcmVzczoge1xyXG4gICAgICAgICAga2VlcF9pbmZpbml0eTogdHJ1ZSwgLy8gXHU5NjMyXHU2QjYyIEluZmluaXR5IFx1ODhBQlx1NTM4Qlx1N0YyOVx1NjIxMCAxLzBcdUZGMENcdThGRDlcdTUzRUZcdTgwRkRcdTRGMUFcdTVCRkNcdTgxRjQgQ2hyb21lIFx1NEUwQVx1NzY4NFx1NjAyN1x1ODBGRFx1OTVFRVx1OTg5OFxyXG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzQkJcdTk2NjQgY29uc29sZVxyXG4gICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSwgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU1M0JCXHU5NjY0IGRlYnVnZ2VyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXQ6IHtcclxuICAgICAgICAgIGNvbW1lbnRzOiBmYWxzZSwgLy8gXHU1MjIwXHU5NjY0XHU2Q0U4XHU5MUNBXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgLy8gbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAvLyAgIFwidnVlLWkxOG5cIjogW1widnVlLWkxOG5cIl0sXHJcbiAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU0RUNFXHU1MTY1XHU1M0UzXHU3MEI5XHU1MjFCXHU1RUZBXHU3Njg0XHU1NzU3XHU3Njg0XHU2MjUzXHU1MzA1XHU4RjkzXHU1MUZBXHU2ODNDXHU1RjBGW25hbWVdXHU4ODY4XHU3OTNBXHU2NTg3XHU0RUY2XHU1NDBELFtoYXNoXVx1ODg2OFx1NzkzQVx1OEJFNVx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOWhhc2hcdTUwM0NcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImpzL1tuYW1lXS5baGFzaF0uanNcIixcclxuICAgICAgICAgIC8vIFx1NzUyOFx1NEU4RVx1NTQ3RFx1NTQwRFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlx1NjVGNlx1NTIxQlx1NUVGQVx1NzY4NFx1NTE3MVx1NEVBQlx1NTc1N1x1NzY4NFx1OEY5M1x1NTFGQVx1NTQ3RFx1NTQwRFxyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwianMvW25hbWVdLltoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU4RjkzXHU1MUZBXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3Njg0XHU1NDdEXHU1NDBEXHVGRjBDW2V4dF1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTYyNjlcdTVDNTVcdTU0MERcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IGFzc2V0SW5mby5uYW1lLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgbGV0IGV4dFR5cGUgPSBpbmZvW2luZm8ubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdcdTY1ODdcdTRFRjZcdTRGRTFcdTYwNkYnLCBhc3NldEluZm8ubmFtZSlcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIC9cXC4obXA0fHdlYm18b2dnfG1wM3x3YXZ8ZmxhY3xhYWMpKFxcPy4qKT8kL2kudGVzdChhc3NldEluZm8ubmFtZSlcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgZXh0VHlwZSA9IFwibWVkaWFcIjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFwuKHBuZ3xqcGU/Z3xnaWZ8c3ZnKShcXD8uKik/JC8udGVzdChhc3NldEluZm8ubmFtZSkpIHtcclxuICAgICAgICAgICAgICBleHRUeXBlID0gXCJpbWdcIjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFwuKHdvZmYyP3xlb3R8dHRmfG90ZikoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xyXG4gICAgICAgICAgICAgIGV4dFR5cGUgPSBcImZvbnRzXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGAke2V4dFR5cGV9L1tuYW1lXS5baGFzaF0uW2V4dF1gO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBfX0FQUF9JTkZPX186IEpTT04uc3RyaW5naWZ5KF9fQVBQX0lORk9fXyksXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iLCAie1xuICBcIm5hbWVcIjogXCJ2dWUzLWVsZW1lbnQtYWRtaW5cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMi45LjNcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwicHJlaW5zdGFsbFwiOiBcIm5weCBvbmx5LWFsbG93IHBucG1cIixcbiAgICBcImRldlwiOiBcInZpdGUgc2VydmUgLS1tb2RlIGRldmVsb3BtZW50XCIsXG4gICAgXCJidWlsZDpwcm9kXCI6IFwidml0ZSBidWlsZCAtLW1vZGUgcHJvZHVjdGlvbiAmJiB2dWUtdHNjIC0tbm9FbWl0XCIsXG4gICAgXCJwcmVwYXJlXCI6IFwiaHVza3lcIixcbiAgICBcImxpbnQ6ZXNsaW50XCI6IFwiZXNsaW50ICAtLWZpeCAtLWV4dCAudHMsLmpzLC52dWUgLi9zcmMgXCIsXG4gICAgXCJsaW50OnByZXR0aWVyXCI6IFwicHJldHRpZXIgLS13cml0ZSBcXFwiKiovKi57anMsY2pzLHRzLGpzb24sdHN4LGNzcyxsZXNzLHNjc3MsdnVlLGh0bWwsbWR9XFxcIlwiLFxuICAgIFwibGludDpzdHlsZWxpbnRcIjogXCJzdHlsZWxpbnQgIFxcXCIqKi8qLntjc3Msc2Nzcyx2dWV9XFxcIiAtLWZpeFwiLFxuICAgIFwibGludDpsaW50LXN0YWdlZFwiOiBcImxpbnQtc3RhZ2VkXCIsXG4gICAgXCJjb21taXRcIjogXCJnaXQtY3pcIlxuICB9LFxuICBcImNvbmZpZ1wiOiB7XG4gICAgXCJjb21taXRpemVuXCI6IHtcbiAgICAgIFwicGF0aFwiOiBcIm5vZGVfbW9kdWxlcy9jei1naXRcIlxuICAgIH1cbiAgfSxcbiAgXCJsaW50LXN0YWdlZFwiOiB7XG4gICAgXCIqLntqcyx0c31cIjogW1xuICAgICAgXCJlc2xpbnQgLS1maXhcIixcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXG4gICAgXSxcbiAgICBcIioue2Nqcyxqc29ufVwiOiBbXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxuICAgIF0sXG4gICAgXCIqLnt2dWUsaHRtbH1cIjogW1xuICAgICAgXCJlc2xpbnQgLS1maXhcIixcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiLFxuICAgICAgXCJzdHlsZWxpbnQgLS1maXhcIlxuICAgIF0sXG4gICAgXCIqLntzY3NzLGNzc31cIjogW1xuICAgICAgXCJzdHlsZWxpbnQgLS1maXhcIixcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXG4gICAgXSxcbiAgICBcIioubWRcIjogW1xuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcbiAgICBdXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBja2VkaXRvci9ja2VkaXRvcjUtdnVlXCI6IFwiXjYuMC4wXCIsXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjMuMVwiLFxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjkuMFwiLFxuICAgIFwiYW5pbWF0ZS5jc3NcIjogXCJeNC4xLjFcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNi44XCIsXG4gICAgXCJja2VkaXRvcjVcIjogXCJeNDIuMC4wXCIsXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNS4wXCIsXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJeMi43LjRcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJuZXRcIjogXCJeMS4wLjJcIixcbiAgICBcIm5wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxuICAgIFwicGF0aC1icm93c2VyaWZ5XCI6IFwiXjEuMC4xXCIsXG4gICAgXCJwYXRoLXRvLXJlZ2V4cFwiOiBcIl42LjIuMlwiLFxuICAgIFwicGluaWFcIjogXCJeMi4xLjdcIixcbiAgICBcInNvY2tqcy1jbGllbnRcIjogXCIxLjYuMVwiLFxuICAgIFwic29ydGFibGVqc1wiOiBcIl4xLjE1LjJcIixcbiAgICBcInN0b21wanNcIjogXCJeMi4zLjNcIixcbiAgICBcInZ1ZVwiOiBcIl4zLjQuMjFcIixcbiAgICBcInZ1ZS1pMThuXCI6IFwiOS45LjFcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4zLjBcIixcbiAgICBcInhsc3hcIjogXCJeMC4xOC41XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGNvbW1pdGxpbnQvY2xpXCI6IFwiXjE4LjYuMVwiLFxuICAgIFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiOiBcIl4xOC42LjNcIixcbiAgICBcIkBpY29uaWZ5LWpzb24vZXBcIjogXCJeMS4xLjE1XCIsXG4gICAgXCJAdHlwZXMvbG9kYXNoXCI6IFwiXjQuMTcuMFwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjAuMTIuN1wiLFxuICAgIFwiQHR5cGVzL25wcm9ncmVzc1wiOiBcIl4wLjIuM1wiLFxuICAgIFwiQHR5cGVzL3BhdGgtYnJvd3NlcmlmeVwiOiBcIl4xLjAuMlwiLFxuICAgIFwiQHR5cGVzL3NvY2tqcy1jbGllbnRcIjogXCJeMS41LjRcIixcbiAgICBcIkB0eXBlcy9zb3J0YWJsZWpzXCI6IFwiXjEuMTUuOFwiLFxuICAgIFwiQHR5cGVzL3N0b21wanNcIjogXCJeMi4zLjlcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjcuNi4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjcuNi4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4wLjRcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjogXCJeMy4xLjBcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE5XCIsXG4gICAgXCJjb21taXRpemVuXCI6IFwiXjQuMy4wXCIsXG4gICAgXCJjei1naXRcIjogXCJeMS45LjFcIixcbiAgICBcImVzbGludFwiOiBcIl44LjU3LjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjkuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl41LjEuM1wiLFxuICAgIFwiZXNsaW50LXBsdWdpbi12dWVcIjogXCJeOS4yNS4wXCIsXG4gICAgXCJmYXN0LWdsb2JcIjogXCJeMy4zLjJcIixcbiAgICBcImh1c2t5XCI6IFwiXjkuMC4xMVwiLFxuICAgIFwibGludC1zdGFnZWRcIjogXCJeMTUuMi4yXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4zOFwiLFxuICAgIFwicG9zdGNzcy1odG1sXCI6IFwiXjEuNi4wXCIsXG4gICAgXCJwb3N0Y3NzLXNjc3NcIjogXCJeNC4wLjlcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMi41XCIsXG4gICAgXCJzYXNzXCI6IFwiXjEuNzUuMFwiLFxuICAgIFwic3R5bGVsaW50XCI6IFwiXjE2LjMuMVwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1odG1sXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY2Vzcy1vcmRlclwiOiBcIl40LjYuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC1zY3NzXCI6IFwiXjE0LjAuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC12dWVcIjogXCJeMS41LjBcIixcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeMzYuMC4wXCIsXG4gICAgXCJ0ZXJzZXJcIjogXCJeNS4zMC4zXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNC41XCIsXG4gICAgXCJ1bm9jc3NcIjogXCJeMC41OC45XCIsXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE3LjVcIixcbiAgICBcInVucGx1Z2luLWljb25zXCI6IFwiXjAuMTguNVwiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNi4wXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuMi44XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXJcIjogXCJeMS41LjBcIixcbiAgICBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiOiBcIl4yLjAuMVwiLFxuICAgIFwidnVlLXRzY1wiOiBcIl4yLjAuMTNcIlxuICB9LFxuICBcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGVlLmNvbS95b3VsYWlvcmcvdnVlMy1lbGVtZW50LWFkbWluLmdpdFwiLFxuICBcImF1dGhvclwiOiBcIlpGXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIj49MTguMC4wXCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UixPQUFPLFNBQVM7QUFDN1MsT0FBTyxZQUFZO0FBQ25CLFNBQWdDLFNBQVMsb0JBQW9CO0FBRTdELE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUUxQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLHlCQUF5QjtBQUVoQyxPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlOzs7QUNidEIsV0FBUTtBQUNSLGNBQVc7QUF3Q1gsbUJBQWdCO0FBQUEsRUFDZCwyQkFBMkI7QUFBQSxFQUMzQiwyQkFBMkI7QUFBQSxFQUMzQixnQkFBZ0I7QUFBQSxFQUNoQixlQUFlO0FBQUEsRUFDZixPQUFTO0FBQUEsRUFDVCxXQUFhO0FBQUEsRUFDYixTQUFXO0FBQUEsRUFDWCxnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixLQUFPO0FBQUEsRUFDUCxXQUFhO0FBQUEsRUFDYixtQkFBbUI7QUFBQSxFQUNuQixrQkFBa0I7QUFBQSxFQUNsQixPQUFTO0FBQUEsRUFDVCxpQkFBaUI7QUFBQSxFQUNqQixZQUFjO0FBQUEsRUFDZCxTQUFXO0FBQUEsRUFD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Q1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFFTCx1QkFBdUI7QUFBQTtBQUFBLE1BQ3ZCLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsZUFBZTtBQUFBO0FBQUEsVUFDZixjQUFjO0FBQUE7QUFBQSxVQUNkLGVBQWU7QUFBQTtBQUFBLFFBQ2pCO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUE7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFLTixnQkFBZ0I7QUFBQTtBQUFBLFVBRWhCLGdCQUFnQjtBQUFBO0FBQUEsVUFFaEIsZ0JBQWdCLENBQUMsY0FBbUI7QUFDbEMsa0JBQU0sT0FBTyxVQUFVLEtBQUssTUFBTSxHQUFHO0FBQ3JDLGdCQUFJLFVBQVUsS0FBSyxLQUFLLFNBQVMsQ0FBQztBQUVsQyxnQkFDRSw2Q0FBNkMsS0FBSyxVQUFVLElBQUksR0FDaEU7QUFDQSx3QkFBVTtBQUFBLFlBQ1osV0FBVyxnQ0FBZ0MsS0FBSyxVQUFVLElBQUksR0FBRztBQUMvRCx3QkFBVTtBQUFBLFlBQ1osV0FBVyxrQ0FBa0MsS0FBSyxVQUFVLElBQUksR0FBRztBQUNqRSx3QkFBVTtBQUFBLFlBQ1o7QUFDQSxtQkFBTyxHQUFHLE9BQU87QUFBQSxVQUNuQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sY0FBYyxLQUFLLFVBQVUsWUFBWTtBQUFBLElBQzNDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
