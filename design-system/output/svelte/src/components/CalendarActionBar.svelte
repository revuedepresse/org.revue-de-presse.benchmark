<script context='module' lang='ts'>
      type CalendarActionBarProps = {
date: Date;
locale?: Locale;
onPrev?: () => void;
onNext?: () => void;
onPillClick?: () => void;
prevDisabled?: boolean;
nextDisabled?: boolean;
position?: 'top' | 'bottom';
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { formatLegacyShortDay } from '../utils/intl';
import  Icon from './Icon.svelte';
import type { Locale } from '../utils/i18n';





    export let position: CalendarActionBarProps['position']= undefined;
export let locale: CalendarActionBarProps['locale']= undefined;
export let onPillClick: CalendarActionBarProps['onPillClick']= undefined;
export let date: CalendarActionBarProps['date'];
export let prevDisabled: CalendarActionBarProps['prevDisabled']= undefined;
export let onPrev: CalendarActionBarProps['onPrev']= undefined;
export let nextDisabled: CalendarActionBarProps['nextDisabled']= undefined;
export let onNext: CalendarActionBarProps['onNext']= undefined;


















  </script>

  <div  class={`rdp-calendar-action-bar rdp-calendar-action-bar--${position ?? 'top'}`} ><button  type="button"  class="rdp-calendar-action-bar__pill"  aria-label={t('actions.pick-month.aria-label', undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onPillClick?.()}}" ><Icon  name="pick-day"  size={16}  decorative={true} ></Icon><span >{formatLegacyShortDay(date, locale ?? 'fr-FR')}</span></button><div  class="rdp-calendar-action-bar__nav" ><button  type="button"  class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--prev"  aria-label={t('actions.prev-day', undefined, locale ?? 'fr-FR')}  aria-disabled={prevDisabled === true ? 'true' : undefined}  disabled={prevDisabled === true}  on:click="{(event) => {
if (prevDisabled !== true) onPrev?.();
}}" ><Icon  name="previous-item"  size={32}  decorative={true} ></Icon></button><button  type="button"  class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--next"  aria-label={t('actions.next-day', undefined, locale ?? 'fr-FR')}  aria-disabled={nextDisabled === true ? 'true' : undefined}  disabled={nextDisabled === true}  on:click="{(event) => {
if (nextDisabled !== true) onNext?.();
}}" ><Icon  name="next-item"  size={32}  decorative={true} ></Icon></button></div></div>