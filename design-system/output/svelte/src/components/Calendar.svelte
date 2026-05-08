<script context='module' lang='ts'>
      type CalendarProps = {
selectedDate: Date;
locale?: Locale;
yearRange: {
  min: number;
  max: number;
};
minDate?: Date;
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
export let minDate: CalendarProps['minDate']= undefined;
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
onSelect?.(next);
}
function nextDay() {
const next = new Date(focusedDate);
next.setDate(next.getDate() + 1);
focusedDate = next;
focusedYear = next.getFullYear();
focusedMonth = next.getMonth();
onSelect?.(next);
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
    $: prevDayDisabled = () => {
if (!minDate) return false;
const cur = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate());
const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
return cur.getTime() <= min.getTime();
};
$: nextDayDisabled = () => {
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);
const cur = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate());
return cur.getTime() >= yesterday.getTime();
};
$: prevMonthDisabled = () => {
if (viewMode === 'year') {
  if (!yearRange) return false;
  return focusedYear <= yearRange.min;
}
if (!minDate) return false;
const minY = minDate.getFullYear();
const minM = minDate.getMonth();
if (focusedYear < minY) return true;
if (focusedYear > minY) return false;
return focusedMonth <= minM;
};
$: nextMonthDisabled = () => {
const today = new Date();
const curY = today.getFullYear();
const curM = today.getMonth();
if (viewMode === 'year') {
  if (!yearRange) return false;
  return focusedYear >= yearRange.max;
}
if (focusedYear > curY) return true;
if (focusedYear < curY) return false;
return focusedMonth >= curM;
};



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


{/if}<div  class="rdp-calendar__panel" >
{#if presentation !== 'sheet' }
<CalendarActionBar  position="top"  date={focusedDate}  locale={locale}  onPrev={(event) => prevDay()} onNext={(event) => nextDay()} prevDisabled={prevDayDisabled()}  nextDisabled={nextDayDisabled()} ></CalendarActionBar>


{/if}<CalendarMonthBar  viewMode={viewMode}  focusedYear={focusedYear}  focusedMonth={focusedMonth}  locale={locale}  onTitleClick={(event) => titleClick()} onPrev={(event) => prevMonth()} onNext={(event) => nextMonth()} prevDisabled={prevMonthDisabled()}  nextDisabled={nextMonthDisabled()} ></CalendarMonthBar>
{#if viewMode === 'day' }
<DateGrid  year={focusedYear}  month={focusedMonth}  selectedDate={focusedDate}  minDate={minDate}  locale={locale}  onSelect={(d) => selectDay(d)}></DateGrid>


{/if}
{#if viewMode === 'month' }
<MonthPicker  year={focusedYear}  selectedMonth={focusedMonth}  minDate={minDate}  locale={locale}  onSelect={(idx) => selectMonth(idx)}></MonthPicker>


{/if}
{#if viewMode === 'year' }
<YearPicker  yearRange={yearRange}  selectedYear={focusedYear}  onSelect={(y) => selectYear(y)}></YearPicker>


{/if}</div></div>