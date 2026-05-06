<script context='module' lang='ts'>
      type FormErrorProps = {
errors: ErrorMessage[];
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import type { ErrorMessage } from '../types';





    export let errors: FormErrorProps['errors'];




    $: items = () => {
return (errors ?? []).map(e => ({
  key: e.key,
  text: t(e.key, e.vars)
}));
};
$: prefix = () => {
return (errors ?? []).length > 1 ? '- ' : '';
};













  </script>


{#if items().length > 0 }
<div  class="rdp-form-error"  role="alert"  aria-live="polite" >
{#each items() as item }
<p  class="rdp-form-error__item" >{prefix()}{item.text}</p>
{/each}
{@html `<${'style'}  >${}<${'/style'}>`}</div>


{/if}