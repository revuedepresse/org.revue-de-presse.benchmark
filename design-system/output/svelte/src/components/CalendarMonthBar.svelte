<script context='module' lang='ts'>
      type ViewMode = 'day' | 'month' | 'year'

type CalendarMonthBarProps = {
viewMode?: ViewMode;
focusedYear?: number;
focusedMonth?: number;
locale?: Locale;
onTitleClick?: () => void;
onPrev?: () => void;
onNext?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { localizedMonthLong } from '../utils/intl';
import  Icon from './Icon.svelte';
import type { Locale } from '../utils/i18n';





    export let viewMode: CalendarMonthBarProps['viewMode']= undefined;
export let locale: CalendarMonthBarProps['locale']= undefined;
export let focusedYear: CalendarMonthBarProps['focusedYear']= undefined;
export let focusedMonth: CalendarMonthBarProps['focusedMonth']= undefined;
export let onTitleClick: CalendarMonthBarProps['onTitleClick']= undefined;
export let onPrev: CalendarMonthBarProps['onPrev']= undefined;
export let onNext: CalendarMonthBarProps['onNext']= undefined;




    $: title = () => {
const m: ViewMode = viewMode ?? 'day';
const loc = locale ?? 'fr-FR';
const year = focusedYear ?? new Date().getFullYear();
if (m === 'month') return String(year);
if (m === 'year') return t('calendar.year-picker.heading', undefined, loc);
return `${localizedMonthLong(focusedMonth ?? 0, loc)} ${year}`;
};
$: titleAriaKey = () => {
const m: ViewMode = viewMode ?? 'day';
if (m === 'day') return 'actions.pick-month.aria-label';
if (m === 'month') return 'actions.pick-year.aria-label';
return 'calendar.year-picker.heading';
};
$: prevAriaKey = () => {
const m: ViewMode = viewMode ?? 'day';
return m === 'year' ? 'actions.prev-year' : 'actions.prev-month';
};
$: nextAriaKey = () => {
const m: ViewMode = viewMode ?? 'day';
return m === 'year' ? 'actions.next-year' : 'actions.next-month';
};













  </script>

  <div  class="rdp-calendar-month-bar" ><button  type="button"  class="rdp-calendar-month-bar__pill"  aria-label={t(titleAriaKey(), undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onTitleClick?.()}}" ><Icon  name="pick-item"  size={16}  decorative={true} ></Icon><span  class="rdp-calendar-month-bar__label" >{title()}</span></button><div  class="rdp-calendar-month-bar__nav" ><button  type="button"  class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--prev"  aria-label={t(prevAriaKey(), undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onPrev?.()}}" ><Icon  name="previous-item"  size={20}  decorative={true} ></Icon></button><button  type="button"  class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--next"  aria-label={t(nextAriaKey(), undefined, locale ?? 'fr-FR')}  on:click="{(event) => {onNext?.()}}" ><Icon  name="next-item"  size={20}  decorative={true} ></Icon></button></div></div>