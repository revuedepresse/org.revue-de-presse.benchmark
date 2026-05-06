<script context='module' lang='ts'>
      type AlertProps = {
variant?: 'empty' | 'info' | 'warning';
messageKey: string;
vars?: Record<string, string | number>;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';





  export let variant: AlertProps['variant']= undefined;
export let messageKey: AlertProps['messageKey'];
export let vars: AlertProps['vars']= undefined;


















</script>

<div  role="status"  class={`rdp-alert rdp-alert--${variant ?? 'empty'}`} ><span  aria-hidden="true"  class="rdp-alert__icon" >⚠</span><span  class="rdp-alert__text" >{t(messageKey, vars)}</span></div>