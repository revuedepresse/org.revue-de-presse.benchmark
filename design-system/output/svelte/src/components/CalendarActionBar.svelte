<script context='module' lang='ts'>
      type CalendarActionBarProps = {
date: Date;
locale?: Locale;
onDateClick?: () => void;
onPrev?: () => void;
onNext?: () => void;
position?: 'top' | 'bottom';
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';
import  { formatLegacyShortDay } from '../utils/intl';
import type { Locale } from '../utils/i18n';





  export let position: CalendarActionBarProps['position']= undefined;
export let onDateClick: CalendarActionBarProps['onDateClick']= undefined;
export let date: CalendarActionBarProps['date'];
export let locale: CalendarActionBarProps['locale']= undefined;
export let onPrev: CalendarActionBarProps['onPrev']= undefined;
export let onNext: CalendarActionBarProps['onNext']= undefined;


















</script>

<div  class={`rdp-calendar-action-bar rdp-calendar-action-bar--${position ?? 'bottom'}`} ><button  type="button"  class="rdp-calendar-action-bar__pill"  on:click="{(event) => {onDateClick?.()}}" >{formatLegacyShortDay(date, locale ?? 'fr-FR')}</button><button  type="button"  class="rdp-calendar-action-bar__nav"  aria-label={t('actions.previous', undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onPrev?.()}}" >
    ‹
  </button><button  type="button"  class="rdp-calendar-action-bar__nav"  aria-label={t('actions.next', undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onNext?.()}}" >
    ›
  </button></div>