<script context='module' lang='ts'>
      type BannerAboutProps = {
bodyKey?: string;
dismissible?: boolean;
onDismiss?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  Icon from './Icon.svelte';





    export let onDismiss: BannerAboutProps['onDismiss']= undefined;
export let bodyKey: BannerAboutProps['bodyKey']= undefined;
export let dismissible: BannerAboutProps['dismissible']= undefined;



    function dismiss() {
dismissed = true;
onDismiss?.();
}




    let dismissed = false;









  </script>


{#if !dismissed }
<aside  class="rdp-banner-about"  role="region" ><header  class="rdp-banner-about__heading" ><Icon  name="introducing"  size={24} ></Icon><span >{t('footer.about.heading')}</span></header><p  class="rdp-banner-about__body" >{t(bodyKey ?? 'footer.about.body')}</p>
{#if !!dismissible }
<button  type="button"  class="rdp-banner-about__close"  aria-label={t('actions.quit.label')}  on:click="{(event) => {dismiss()}}" >
          ×
        </button>


{/if}</aside>


{/if}