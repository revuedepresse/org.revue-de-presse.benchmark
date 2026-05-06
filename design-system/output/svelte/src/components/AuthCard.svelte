<script context='module' lang='ts'>
      type Flow = 'login' | 'signup' | 'reset' | 'edit-email' | 'edit-password' | 'confirm'

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
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  Button from './Button.svelte';
import  EmailField from './EmailField.svelte';
import  PasswordField from './PasswordField.svelte';
import  Checkbox from './Checkbox.svelte';
import  FormError from './FormError.svelte';
import  Notice from './Notice.svelte';
import  Link from './Link.svelte';
import type { ErrorMessage } from '../types';





    export let flow: AuthCardProps['flow'];
export let onSubmit: AuthCardProps['onSubmit']= undefined;
export let noticeKey: AuthCardProps['noticeKey']= undefined;
export let formErrors: AuthCardProps['formErrors']= undefined;



    function submit() {
const values: Record<string, string | boolean> = {};
if (flow === 'login') {
  values.email = email;
  values.password = password;
  values.rememberMe = rememberMe;
} else if (flow === 'signup') {
  values.email = email;
  values.password = password;
  values.tos = tos;
} else if (flow === 'reset') {
  values.email = email;
} else if (flow === 'edit-email') {
  values.email = email;
  values.currentPassword = currentPassword;
} else if (flow === 'edit-password') {
  values.currentPassword = currentPassword;
  values.newPassword = newPassword;
  values.confirmPassword = confirmPassword;
}
onSubmit?.({
  flow: flow,
  values
});
}




    let email = '';
let password = '';
let currentPassword = '';
let newPassword = '';
let confirmPassword = '';
let rememberMe = false;
let tos = false;









  </script>

  <section  class="rdp-auth-card" >
{#if flow === 'confirm' && !!noticeKey }
<Notice  headlineKey={noticeKey.headline}  bodyKey={noticeKey.body} ></Notice>


{/if}
{#if flow !== 'confirm' }
<div  class="rdp-auth-card__panel" ><h2  class="rdp-auth-card__title" >{t(`auth.${flow}.title`)}</h2>
{#if flow === 'reset' }
<p >{t('auth.reset.body')}</p>


{/if}
{#if flow === 'login' || flow === 'signup' || flow === 'reset' || flow === 'edit-email' }
<EmailField  name="email"  value={email}  onChange={(v) => email = v}></EmailField>


{/if}
{#if flow === 'login' }
<PasswordField  name="password"  mode="login"  value={password}  onChange={(v) => password = v}></PasswordField>
<Checkbox  name="rememberMe"  labelKey="auth.remember-me"  checked={rememberMe}  onChange={(v) => rememberMe = v}></Checkbox>


{/if}
{#if flow === 'signup' }
<PasswordField  name="password"  mode="new"  value={password}  onChange={(v) => password = v}></PasswordField>
<Checkbox  name="tos"  labelKey="auth.tos.checkbox-label"  checked={tos}  onChange={(v) => tos = v}></Checkbox>


{/if}
{#if flow === 'edit-email' }
<PasswordField  name="currentPassword"  mode="login"  labelKey="auth.edit-email.current-password-label"  value={currentPassword}  onChange={(v) => currentPassword = v}></PasswordField>


{/if}
{#if flow === 'edit-password' }
<PasswordField  name="currentPassword"  mode="login"  labelKey="auth.edit-password.current-label"  value={currentPassword}  onChange={(v) => currentPassword = v}></PasswordField>
<PasswordField  name="newPassword"  mode="new"  labelKey="auth.edit-password.new-label"  value={newPassword}  onChange={(v) => newPassword = v}></PasswordField>
<PasswordField  name="confirmPassword"  mode="new"  labelKey="auth.edit-password.confirm-label"  value={confirmPassword}  onChange={(v) => confirmPassword = v} showHelper={false} ></PasswordField>


{/if}<Button  variant="form"  labelKey={`auth.${flow}.submit-label`}  onClick={(event) => submit()}></Button>
{#if !!formErrors && formErrors.length > 0 }
<FormError  errors={formErrors} ></FormError>


{/if}
{#if flow === 'login' }
<Link  href="#"  labelKey="auth.login.forgot-password" ></Link>


{/if}</div>


{/if}{@html `<${'style'}  >${}<${'/style'}>`}</section>