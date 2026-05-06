<script context='module' lang='ts'>
      type ButtonProps = {
variant: ButtonVariant;
labelKey?: string;
label?: string;
icon?: IconName;
iconAfter?: IconName;
disabled?: boolean;
loading?: boolean;
ariaLabel?: string;
onClick?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import type { ButtonVariant, IconName } from '../types';





    export let variant: ButtonProps['variant'];
export let loading: ButtonProps['loading']= undefined;
export let disabled: ButtonProps['disabled']= undefined;
export let ariaLabel: ButtonProps['ariaLabel']= undefined;
export let onClick: ButtonProps['onClick']= undefined;
export let icon: ButtonProps['icon']= undefined;
export let labelKey: ButtonProps['labelKey']= undefined;
export let label: ButtonProps['label']= undefined;
export let iconAfter: ButtonProps['iconAfter']= undefined;


















  </script>

  <button  type="button"  class={`rdp-button rdp-button--${variant}`}  data-loading={loading ? 'true' : undefined}  disabled={disabled || loading}  aria-label={ariaLabel}  on:click="{(event) => {onClick?.()}}" >
{#if icon }
<span  class="rdp-button__icon" >{icon}</span>


{/if}
{#if variant !== 'scrollTop' && variant !== 'avatar' }
<span  class="rdp-button__label" >
{#if labelKey }
{t(labelKey)}


{:else}
{label ?? ''}

{/if}</span>


{/if}
{#if iconAfter }
<span  class="rdp-button__icon-after" >{iconAfter}</span>


{/if}{@html `<${'style'}  >${}<${'/style'}>`}</button>