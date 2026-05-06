<script context='module' lang='ts'>
      type FieldErrorProps = {
messageKey?: string;
message?: string;
vars?: Record<string, string | number>;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';





    export let messageKey: FieldErrorProps['messageKey']= undefined;
export let message: FieldErrorProps['message']= undefined;
export let vars: FieldErrorProps['vars']= undefined;


















  </script>


{#if !!(messageKey || message) }
<p  class="rdp-field-error"  role="alert" >
{#if messageKey }
{t(messageKey, vars)}


{:else}
{message ?? ''}

{/if}{@html `<${'style'}  >${}<${'/style'}>`}</p>


{/if}