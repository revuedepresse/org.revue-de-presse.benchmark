<script context='module' lang='ts'>
      type PasswordFieldProps = {
name: string;
value: string;
onChange?: (value: string) => void;
mode: 'login' | 'new';
labelKey?: string;
error?: boolean;
showHelper?: boolean;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { MIN_LENGTH_NO_MFA } from '../utils/password';





    export let error: PasswordFieldProps['error']= undefined;
export let name: PasswordFieldProps['name'];
export let labelKey: PasswordFieldProps['labelKey']= undefined;
export let mode: PasswordFieldProps['mode'];
export let value: PasswordFieldProps['value'];
export let onChange: PasswordFieldProps['onChange']= undefined;
export let showHelper: PasswordFieldProps['showHelper']= undefined;


















  </script>

  <div  class="rdp-textfield"  data-error={error ? 'true' : undefined} ><label  class="rdp-textfield__label"  for={`field-${name}`} >{t(labelKey ?? 'auth.password-label')}</label><input  type="password"  id={`field-${name}`}  autocomplete={mode === 'new' ? 'new-password' : 'current-password'}  name={name}  value={value}  on:input="{(event) => {onChange?.(event.target.value)}}"  />
{#if showHelper ?? mode === 'new' }
<p  class="rdp-textfield__helper" >{t('auth.password.helper-text', {
min: MIN_LENGTH_NO_MFA
})}</p>


{/if}</div>