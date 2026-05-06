<script context='module' lang='ts'>
      type AppHeaderProps = {
layout: 'mobile' | 'desktop';
authenticated: boolean;
onAccountClick?: () => void;
onMySpaceClick?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  Logo from './Logo.svelte';
import  Icon from './Icon.svelte';





    export let layout: AppHeaderProps['layout'];
export let authenticated: AppHeaderProps['authenticated'];
export let onMySpaceClick: AppHeaderProps['onMySpaceClick']= undefined;
export let onAccountClick: AppHeaderProps['onAccountClick']= undefined;


















  </script>

  <header  class={`rdp-app-header rdp-app-header--${layout}`} ><Logo  showWordmark={true}  size={layout === 'mobile' ? 'sm' : 'md'} ></Logo>
{#if layout === 'desktop' }
<a  href="#"  class="rdp-app-header__myspace"  aria-disabled={!authenticated ? 'true' : undefined}  on:click="{(event) => {
if (!authenticated) {
  event.preventDefault();
  return;
}
onMySpaceClick?.();
}}" >{t('header.my-space')}</a>


{/if}<button  type="button"  class="rdp-app-header__account"  aria-label={t('header.my-account.aria-label')}  on:click="{(event) => {onAccountClick?.()}}" ><Icon  name="pick-item"  size={32}  decorative={true} ></Icon></button>{@html `<${'style'}  >${}<${'/style'}>`}</header>