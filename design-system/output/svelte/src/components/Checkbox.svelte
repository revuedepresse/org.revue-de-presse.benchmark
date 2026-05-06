<script context='module' lang='ts'>
      type CheckboxProps = {
name: string;
checked?: boolean;
onChange?: (checked: boolean) => void;
labelKey?: string;
label?: string;
labelChildren?: any;
disabled?: boolean;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';





    export let name: CheckboxProps['name'];
export let checked: CheckboxProps['checked']= undefined;
export let disabled: CheckboxProps['disabled']= undefined;
export let onChange: CheckboxProps['onChange']= undefined;
export let labelKey: CheckboxProps['labelKey']= undefined;
export let label: CheckboxProps['label']= undefined;
export let labelChildren: CheckboxProps['labelChildren']= undefined;


















  </script>

  <label  class="rdp-checkbox" ><input  type="checkbox"  name={name}  checked={checked ?? false}  disabled={disabled}  on:change="{(event) => {onChange?.(event.target.checked)}}"  /><span  class="rdp-checkbox__label" >
{#if labelKey }
{t(labelKey)}


{:else}
{label ?? ''}

{/if}{labelChildren}</span></label>