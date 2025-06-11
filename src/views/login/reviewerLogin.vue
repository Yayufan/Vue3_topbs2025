<template>
  <div class="login-container">
    <!-- 顶部 -->
    <div class="absolute-lt flex-x-end p-3 w-full">
      <el-switch v-model="isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" @change="toggleTheme" />
      <lang-select class="ml-2 cursor-pointer" />
    </div>
    <!-- 登录表单 -->
    <el-card class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <el-tag class="ml-2 absolute-rt">{{ defaultSettings.version }}</el-tag>
      </div>

      <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="account">
          <div class="flex-y-center w-full">
            <svg-icon icon-class="user" class="mx-2" />
            <el-input ref="email" v-model="loginData.account" :placeholder="$t('login.username')" name="email"
              size="large" class="h-[48px]" />
          </div>
        </el-form-item>

        <!-- 密碼 -->
        <el-tooltip :visible="isCapslock" :content="$t('login.capsLock')" placement="right">
          <el-form-item prop="password">
            <div class="flex-y-center w-full">
              <svg-icon icon-class="lock" class="mx-2" />
              <el-input v-model="loginData.password" :placeholder="$t('login.password')" type="password" name="password"
                @keyup="checkCapslock" @keyup.enter="handleLogin" size="large" class="h-[48px] pr-2" show-password />
            </div>
          </el-form-item>
        </el-tooltip>

        <div class="captcha-box">
          <el-form-item prop="captcha">
            <div class="flex-y-center w-full">
              <svg-icon icon-class="captcha" class="mx-2" />
              <el-input v-model="loginData.verificationCode" placeholder="驗證碼" name="captcha" size="large"
                class="h-[48px] pr-2" />
              <img :src="captchaImage" alt="验证码" @click="getCaptcha" class="cursor-pointer ml-2 h-[48px] w-[120px]" />
            </div>

          </el-form-item>

        </div>



        <!-- 登录按钮 -->
        <el-button :loading="loading" type="primary" size="large" class="w-full" @click.prevent="handleLogin">{{
          $t("login.login") }}
        </el-button>


      </el-form>
    </el-card>

    <!-- ICP备案 -->
    <div class="absolute bottom-1 text-[10px] text-center" v-show="icpVisible">
      <p>
        Copyright © 2024 ZF All Rights Reserved.
        版權所有
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, useUserStore } from "@/store";
import { getCaptchaApi } from "@/api/auth";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import router from "@/router";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { tryCatch } from "@/utils/tryCatch";

// Stores
const userStore = useUserStore();
const settingsStore = useSettingsStore();

// Internationalization
const { t } = useI18n();

// Reactive states
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
const icpVisible = ref(true);
const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const captchaBase64 = ref(); // 驗證碼图片Base64字符串
const loginFormRef = ref(ElForm); // 登录表单ref
const { height } = useWindowSize();

let loginData = reactive({
  account: "",
  password: "",
  verificationCode: "",
  verificationKey: "",
});

const loginRules = computed(() => {
  return {
    account: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],

  };
});



/**
 * 登录
 */
const route = useRoute();

function handleLogin() {
  console.log("loginData", loginData);
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .reviewerLogin(loginData)
        .then(() => {
          const query: LocationQuery = route.query;
          console.log("query", query);
          const redirect = (query.redirect as LocationQueryValue) ?? "/";
          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );
          console.log("redirect", redirect);
          console.log("otherQueryParams", otherQueryParams);
          router.push('/dashboard');
          // router.push({ path: redirect, query: otherQueryParams });
        })
        .catch((err) => {
          console.log("登录失败:", err);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/**
 * 主題切換
 */

const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};
/**
 * 根据屏幕宽度切換设备模式
 */

watchEffect(() => {
  if (height.value < 600) {
    icpVisible.value = false;
  } else {
    icpVisible.value = true;
  }
});

/**
 * 检查输入大小写
 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密碼自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

const captchaImage = ref("");
const getCaptcha = async () => {
  const { res, error } = await tryCatch(getCaptchaApi());
  if (error) {
    console.error("获取验证码失败:", error);
    return;
  }

  console.log("获取验证码成功:", res);
  captchaImage.value = res.data.image;
  loginData.verificationKey = res.data.key;
}


onMounted(() => {
  getCaptcha();

});
</script>

<style lang="scss" scoped>
html.dark .login-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  @apply wh-full flex-center;

  .login-form {
    padding: 30px 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景顏色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}
</style>
