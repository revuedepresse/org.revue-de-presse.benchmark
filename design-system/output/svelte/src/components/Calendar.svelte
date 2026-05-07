<script context='module' lang='ts'>
      type CalendarProps = {
selectedDate: Date;
locale?: Locale;
yearRange: {
  min: number;
  max: number;
};
presentation?: 'inline' | 'sheet';
onSelect?: (date: Date) => void;
onDismiss?: () => void;
}

    </script>
    

    
<script lang='ts'>
    import { onMount } from 'svelte'



  import  DateGrid from './DateGrid.svelte';
import  MonthPicker from './MonthPicker.svelte';
import  YearPicker from './YearPicker.svelte';
import  CalendarActionBar from './CalendarActionBar.svelte';
import  CalendarMonthBar from './CalendarMonthBar.svelte';
import type { Locale } from '../utils/i18n';





    export let selectedDate: CalendarProps['selectedDate'];
export let onSelect: CalendarProps['onSelect']= undefined;
export let yearRange: CalendarProps['yearRange'];
export let presentation: CalendarProps['presentation']= undefined;
export let onDismiss: CalendarProps['onDismiss']= undefined;
export let locale: CalendarProps['locale']= undefined;



    function selectDay(d: Date) {
focusedDate = d;
focusedYear = d.getFullYear();
focusedMonth = d.getMonth();
onSelect?.(d);
}
function selectMonth(idx: number) {
focusedMonth = idx;
viewMode = 'day';
}
function selectYear(y: number) {
focusedYear = y;
viewMode = 'month';
}
function prevDay() {
const next = new Date(focusedDate);
next.setDate(next.getDate() - 1);
focusedDate = next;
focusedYear = next.getFullYear();
focusedMonth = next.getMonth();
}
function nextDay() {
const next = new Date(focusedDate);
next.setDate(next.getDate() + 1);
focusedDate = next;
focusedYear = next.getFullYear();
focusedMonth = next.getMonth();
}
function prevMonth() {
if (viewMode === 'year') {
  const next = focusedYear - 1;
  if (next >= yearRange.min) focusedYear = next;
  return;
}
const m = focusedMonth - 1;
if (m < 0) {
  focusedMonth = 11;
  focusedYear -= 1;
} else {
  focusedMonth = m;
}
}
function nextMonth() {
if (viewMode === 'year') {
  const next = focusedYear + 1;
  if (next <= yearRange.max) focusedYear = next;
  return;
}
const m = focusedMonth + 1;
if (m > 11) {
  focusedMonth = 0;
  focusedYear += 1;
} else {
  focusedMonth = m;
}
}
function titleClick() {
if (viewMode === 'day') {
  viewMode = 'month';
} else if (viewMode === 'month') {
  viewMode = 'year';
}
}




    let viewMode = 'day';
let focusedDate = new Date();
let focusedYear = 0;
let focusedMonth = 0;
let initialised = false;


    onMount(() => { focusedDate = selectedDate;
focusedYear = selectedDate.getFullYear();
focusedMonth = selectedDate.getMonth();
initialised = true; });


            function onUpdateFn_0(..._args: any[]) {
              focusedDate = selectedDate;
focusedYear = selectedDate.getFullYear();
focusedMonth = selectedDate.getMonth();
            }

            $: onUpdateFn_0(...[selectedDate]);





  </script>

  <div  role="dialog"  class={`rdp-calendar rdp-calendar--${presentation ?? 'inline'}`}  aria-modal={presentation === 'sheet' ? 'true' : 'false'} >
{#if presentation === 'sheet' }
<div  class="rdp-calendar__scrim"  aria-hidden="true"  on:click="{(event) => {onDismiss?.()}}" ></div>


{/if}<div  class="rdp-calendar__panel" ><CalendarActionBar  position="top"  date={focusedDate}  locale={locale}  onPrev={(event) => prevDay()} onNext={(event) => nextDay()}></CalendarActionBar><CalendarMonthBar  viewMode={viewMode}  focusedYear={focusedYear}  focusedMonth={focusedMonth}  locale={locale}  onTitleClick={(event) => titleClick()} onPrev={(event) => prevMonth()} onNext={(event) => nextMonth()}></CalendarMonthBar>
{#if viewMode === 'day' }
<DateGrid  year={focusedYear}  month={focusedMonth}  selectedDate={focusedDate}  locale={locale}  onSelect={(d) => selectDay(d)}></DateGrid>


{/if}
{#if viewMode === 'month' }
<MonthPicker  year={focusedYear}  selectedMonth={focusedMonth}  locale={locale}  onSelect={(idx) => selectMonth(idx)}></MonthPicker>


{/if}
{#if viewMode === 'year' }
<YearPicker  yearRange={yearRange}  selectedYear={focusedYear}  onSelect={(y) => selectYear(y)}></YearPicker>


{/if}</div></div>