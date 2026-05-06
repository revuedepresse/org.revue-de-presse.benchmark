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
import type { Locale } from '../utils/i18n';





    export let locale: MonthPickerProps['locale']= undefined;
export let year: MonthPickerProps['year'];
export let selectedMonth: MonthPickerProps['selectedMonth'];
export let onSelect: MonthPickerProps['onSelect']= undefined;




    $: months = () => {
return Array.from({
  length: 12
}, (_, i) => new Intl.DateTimeFormat(locale ?? 'fr-FR', {
  month: 'long'
}).format(new Date(year, i, 1)));
};













  </script>

  <ul  class="rdp-month-picker"  role="listbox"  aria-label={t('calendar.heading.year', {
year: year
})} >
{#each months() as name, index }
<li  role="option"  aria-selected={index === selectedMonth ? 'true' : 'false'}  class={`rdp-month-picker__item${index === selectedMonth ? ' rdp-month-picker__item--selected' : ''}`}  on:click="{(event) => {onSelect?.(index)}}" >{name}</li>
{/each}
{@html `<${'style'}  >${}<${'/style'}>`}</ul>