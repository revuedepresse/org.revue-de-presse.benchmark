<script context='module' lang='ts'>
      type IconProps = {
name: IconName;
size?: 24 | 32;
ariaLabel?: string;
decorative?: boolean;
}

    </script>
    

    
<script lang='ts'>




import type { IconName } from '../types';





  export let size: IconProps['size']= undefined;
export let decorative: IconProps['decorative']= undefined;
export let ariaLabel: IconProps['ariaLabel']= undefined;
export let name: IconProps['name'];


















</script>

<svg  class="rdp-icon"  viewBox="0 0 24 24"  width={size ?? 24}  height={size ?? 24}  aria-hidden={decorative ?? !ariaLabel ? 'true' : undefined}  aria-label={decorative ?? !ariaLabel ? undefined : ariaLabel}  role={decorative ?? !ariaLabel ? undefined : 'img'} ><use  href={`#${name}`} ></use></svg>