<script context='module' lang='ts'>
      type EmailFieldProps = {
name: string;
value: string;
onChange?: (value: string) => void;
labelKey?: string;
error?: boolean;
required?: boolean;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';





  export let error: EmailFieldProps['error']= undefined;
export let name: EmailFieldProps['name'];
export let labelKey: EmailFieldProps['labelKey']= undefined;
export let value: EmailFieldProps['value'];
export let required: EmailFieldProps['required']= undefined;
export let onChange: EmailFieldProps['onChange']= undefined;


















</script>

<div  class="rdp-textfield"  data-error={error ? 'true' : undefined} ><label  class="rdp-textfield__label"  for={`field-${name}`} >{t(labelKey ?? 'auth.email-label')}</label><input  type="email"  autocomplete="email"  id={`field-${name}`}  name={name}  value={value}  required={required}  on:input="{(event) => {onChange?.(event.target.value)}}"  /></div>