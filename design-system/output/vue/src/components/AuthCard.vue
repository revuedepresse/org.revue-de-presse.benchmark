<template>
  <section class="rdp-auth-card">
    <template v-if="flow === 'confirm' && !!noticeKey">
      <Notice
        :headlineKey="noticeKey.headline"
        :bodyKey="noticeKey.body"
      ></Notice>
    </template>

    <template v-if="flow !== 'confirm'">
      <div class="rdp-auth-card__panel">
        <h2 class="rdp-auth-card__title">{{ t(`auth.${flow}.title`) }}</h2>
        <template v-if="flow === 'reset'">
          <p>{{ t("auth.reset.body") }}</p>
        </template>

        <template
          v-if="
            flow === 'login' ||
            flow === 'signup' ||
            flow === 'reset' ||
            flow === 'edit-email'
          "
        >
          <EmailField
            name="email"
            :value="email"
            :onChange="(v) => (email = v)"
          ></EmailField>
        </template>

        <template v-if="flow === 'login'">
          <PasswordField
            name="password"
            mode="login"
            :value="password"
            :onChange="(v) => (password = v)"
          ></PasswordField>
          <Checkbox
            name="rememberMe"
            labelKey="auth.remember-me"
            :checked="rememberMe"
            :onChange="(v) => (rememberMe = v)"
          ></Checkbox>
        </template>

        <template v-if="flow === 'signup'">
          <PasswordField
            name="password"
            mode="new"
            :value="password"
            :onChange="(v) => (password = v)"
          ></PasswordField>
          <Checkbox
            name="tos"
            labelKey="auth.tos.checkbox-label"
            :checked="tos"
            :onChange="(v) => (tos = v)"
          ></Checkbox>
        </template>

        <template v-if="flow === 'edit-email'">
          <PasswordField
            name="currentPassword"
            mode="login"
            labelKey="auth.edit-email.current-password-label"
            :value="currentPassword"
            :onChange="(v) => (currentPassword = v)"
          ></PasswordField>
        </template>

        <template v-if="flow === 'edit-password'">
          <PasswordField
            name="currentPassword"
            mode="login"
            labelKey="auth.edit-password.current-label"
            :value="currentPassword"
            :onChange="(v) => (currentPassword = v)"
          ></PasswordField>
          <PasswordField
            name="newPassword"
            mode="new"
            labelKey="auth.edit-password.new-label"
            :value="newPassword"
            :onChange="(v) => (newPassword = v)"
          ></PasswordField>
          <PasswordField
            name="confirmPassword"
            mode="new"
            labelKey="auth.edit-password.confirm-label"
            :value="confirmPassword"
            :onChange="(v) => (confirmPassword = v)"
            :showHelper="false"
          ></PasswordField>
        </template>

        <Button
          variant="form"
          :labelKey="`auth.${flow}.submit-label`"
          :onClick="(event) => submit()"
        ></Button>
        <template v-if="!!formErrors && formErrors.length > 0">
          <FormError :errors="formErrors"></FormError>
        </template>

        <template v-if="flow === 'login'">
          <Link href="#" labelKey="auth.login.forgot-password"></Link>
        </template>
      </div>
    </template>

    <component :is="'style'">{{
      `
        .rdp-auth-card { display: grid; gap: var(--separation-2); }
        .rdp-auth-card__panel {
          background: var(--color-white);
          padding: var(--separation-3);
          border-radius: var(--radius-default);
          display: grid;
          gap: var(--separation-1);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-auth-card__title {
          margin: 0;
          font-family: 'Signika', sans-serif;
          color: var(--color-content-text);
          text-align: center;
        }
      `
    }}</component>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { t } from "../utils/i18n";
import Button from "./Button.vue";
import EmailField from "./EmailField.vue";
import PasswordField from "./PasswordField.vue";
import Checkbox from "./Checkbox.vue";
import FormError from "./FormError.vue";
import Notice from "./Notice.vue";
import Link from "./Link.vue";
import type { ErrorMessage } from "../types";

type Flow =
  | "login"
  | "signup"
  | "reset"
  | "edit-email"
  | "edit-password"
  | "confirm";
type AuthCardProps = {
  flow: Flow;
  formErrors?: ErrorMessage[];
  noticeKey?: {
    headline: string;
    body: string;
  };
  onSubmit?: (payload: {
    flow: Flow;
    values: Record<string, string | boolean>;
  }) => void;
};

const props = defineProps<AuthCardProps>();
const email = ref("");
const password = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const rememberMe = ref(false);
const tos = ref(false);

function submit() {
  const values: Record<string, string | boolean> = {};
  if (props.flow === "login") {
    values.email.value = email.value;
    values.password.value = password.value;
    values.rememberMe.value = rememberMe.value;
  } else if (props.flow === "signup") {
    values.email.value = email.value;
    values.password.value = password.value;
    values.tos.value = tos.value;
  } else if (props.flow === "reset") {
    values.email.value = email.value;
  } else if (props.flow === "edit-email") {
    values.email.value = email.value;
    values.currentPassword.value = currentPassword.value;
  } else if (props.flow === "edit-password") {
    values.currentPassword.value = currentPassword.value;
    values.newPassword.value = newPassword.value;
    values.confirmPassword.value = confirmPassword.value;
  }
  props.onSubmit?.({
    flow: props.flow,
    values,
  });
}
</script>