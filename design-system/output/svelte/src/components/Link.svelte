<script context='module' lang='ts'>
      type LinkProps = {
href: string;
labelKey?: string;
label?: string;
external?: boolean;
variant?: 'underline' | 'inline' | 'plain';
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';





    export let variant: LinkProps['variant']= undefined;
export let href: LinkProps['href'];
export let external: LinkProps['external']= undefined;
export let labelKey: LinkProps['labelKey']= undefined;
export let label: LinkProps['label']= undefined;


















  </script>

  <a  class={`rdp-link rdp-link--${variant ?? 'underline'}`}  href={href}  target={external ? '_blank' : undefined}  rel={external ? 'noopener noreferrer' : undefined} >
{#if labelKey }
{t(labelKey)}


{:else}
{label ?? ''}

{/if}</a>