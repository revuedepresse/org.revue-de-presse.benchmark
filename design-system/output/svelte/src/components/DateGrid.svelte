<script context='module' lang='ts'>
      type DateGridProps = {
year: number;
month: number; // 0..11
selectedDate?: Date;
locale?: Locale;
onSelect?: (date: Date) => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import type { Locale } from '../utils/i18n';





    export let year: DateGridProps['year'];
export let month: DateGridProps['month'];
export let selectedDate: DateGridProps['selectedDate']= undefined;
export let locale: DateGridProps['locale']= undefined;
export let onSelect: DateGridProps['onSelect']= undefined;



    function isSelected(d: Date) {
const sel = selectedDate;
return !!sel && sel.getFullYear() === d.getFullYear() && sel.getMonth() === d.getMonth() && sel.getDate() === d.getDate();
}
    $: rows = () => {
const first = new Date(year, month, 1);
const offset = (first.getDay() + 6) % 7;
const start = new Date(year, month, 1 - offset);
const all = Array.from({
  length: 42
}, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
return [0, 1, 2, 3, 4, 5].map(row => all.slice(row * 7, row * 7 + 7));
};



    let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];









  </script>

  <table  class="rdp-date-grid"  role="grid" ><thead ><tr >
{#each weekdays as w }
<th  scope="col"  class="rdp-date-grid__weekday" >{t(`calendar.weekdays.short.${w}`, undefined, locale ?? 'fr-FR')}</th>
{/each}
</tr></thead><tbody >
{#each rows() as row }
<tr >
{#each row as d }
<td  role="gridcell"  aria-selected={isSelected(d) ? 'true' : 'false'}  data-other-month={d.getMonth() !== month ? 'true' : undefined}  class={`rdp-date-grid__cell${isSelected(d) ? ' rdp-date-grid__cell--selected' : ''}`}  on:click="{(event) => {onSelect?.(d)}}" >{d.getDate()}</td>
{/each}
</tr>
{/each}
</tbody>{@html `<${'style'}  >${}<${'/style'}>`}</table>