<script context='module' lang='ts'>
      type TextFieldProps = {
name: string;
type?: 'text' | 'email' | 'tel' | 'url';
value: string;
onChange?: (value: string) => void;
labelKey?: string;
label?: string;
placeholder?: string;
autocomplete?: string;
error?: boolean;
required?: boolean;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';





    export let error: TextFieldProps['error']= undefined;
export let name: TextFieldProps['name'];
export let labelKey: TextFieldProps['labelKey']= undefined;
export let label: TextFieldProps['label']= undefined;
export let type: TextFieldProps['type']= undefined;
export let value: TextFieldProps['value'];
export let placeholder: TextFieldProps['placeholder']= undefined;
export let autocomplete: TextFieldProps['autocomplete']= undefined;
export let required: TextFieldProps['required']= undefined;
export let onChange: TextFieldProps['onChange']= undefined;


















  </script>

  <div  class="rdp-textfield"  data-error={error ? 'true' : undefined} ><label  class="rdp-textfield__label"  for={`field-${name}`} >
{#if labelKey }
{t(labelKey)}


{:else}
{label ?? ''}

{/if}</label><input  id={`field-${name}`}  type={type ?? 'text'}  name={name}  value={value}  placeholder={placeholder}  autocomplete={autocomplete}  required={required}  on:input="{(event) => {onChange?.(event.target.value)}}"  /></div>