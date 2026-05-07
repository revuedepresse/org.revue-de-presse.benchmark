<script context='module' lang='ts'>
      type MonthPickerProps = {
year: number;
selectedMonth: number; // 0..11
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
<li  role="option"  aria-selected={index === selectedMonth ? 'true' : 'false'}  aria-disabled={isFuture(index) ? 'true' : undefined}  data-future={isFuture(index) ? 'true' : undefined}  class={`rdp-month-picker__item${index === selectedMonth ? ' rdp-month-picker__item--selected' : ''}`}  on:click="{(event) => {
if (!isFuture(index)) onSelect?.(index);
}}" >{name}</li>
{/each}
</ul>