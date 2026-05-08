<script context='module' lang='ts'>
      type MonthPickerProps = {
year: number;
selectedMonth: number; // 0..11
minDate?: Date;
locale?: Locale;
onSelect?: (monthIndex: number) => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { localizedMonthLong } from '../utils/intl';
import type { Locale } from '../utils/i18n';





    export let locale: MonthPickerProps['locale']= undefined;
export let year: MonthPickerProps['year'];
export let minDate: MonthPickerProps['minDate']= undefined;
export let selectedMonth: MonthPickerProps['selectedMonth'];
export let onSelect: MonthPickerProps['onSelect']= undefined;



    function isFuture(monthIndex: number) {
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
if (year > currentYear) return true;
if (year < currentYear) return false;
return monthIndex > currentMonth;
}
function isBeforeMin(monthIndex: number) {
if (!minDate) return false;
const minYear = minDate.getFullYear();
const minMonth = minDate.getMonth();
if (year < minYear) return true;
if (year > minYear) return false;
return monthIndex < minMonth;
}
function isDisabled(monthIndex: number) {
return isFuture(monthIndex) || isBeforeMin(monthIndex);
}
    $: months = () => {
return Array.from({
  length: 12
}, (_, i) => localizedMonthLong(i, locale ?? 'fr-FR'));
};













  </script>

  <ul  class="rdp-month-picker"  role="listbox"  aria-label={t('calendar.heading.year', {
year: year
})} >
{#each months() as name, index }
<li  role="option"  aria-selected={index === selectedMonth ? 'true' : 'false'}  aria-disabled={isDisabled(index) ? 'true' : undefined}  data-future={isDisabled(index) ? 'true' : undefined}  class={`rdp-month-picker__item${index === selectedMonth ? ' rdp-month-picker__item--selected' : ''}`}  on:click="{(event) => {
if (!isDisabled(index)) onSelect?.(index);
}}" >{name}</li>
{/each}
</ul>