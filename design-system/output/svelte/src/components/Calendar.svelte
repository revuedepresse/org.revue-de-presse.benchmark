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




  import  DateGrid from './DateGrid.svelte';
import  MonthPicker from './MonthPicker.svelte';
import  YearPicker from './YearPicker.svelte';
import  CalendarActionBar from './CalendarActionBar.svelte';
import type { Locale } from '../utils/i18n';





    export let selectedDate: CalendarProps['selectedDate'];
export let onSelect: CalendarProps['onSelect']= undefined;
export let presentation: CalendarProps['presentation']= undefined;
export let onDismiss: CalendarProps['onDismiss']= undefined;
export let locale: CalendarProps['locale']= undefined;
export let yearRange: CalendarProps['yearRange'];



    function ensureInit() {
if (!initialised) {
  focusedYear = selectedDate.getFullYear();
  focusedMonth = selectedDate.getMonth();
  initialised = true;
}
}
function setView(mode: 'day' | 'month' | 'year') {
viewMode = mode;
}
function selectDay(d: Date) {
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
function prev() {
if (viewMode === 'day') {
  const m = focusedMonth - 1;
  if (m < 0) {
    focusedMonth = 11;
    focusedYear -= 1;
  } else focusedMonth = m;
}
}
function next() {
if (viewMode === 'day') {
  const m = focusedMonth + 1;
  if (m > 11) {
    focusedMonth = 0;
    focusedYear += 1;
  } else focusedMonth = m;
}
}




    let viewMode = 'day';
let focusedYear = 0;
let focusedMonth = 0;
let initialised = false;









  </script>

  <div  role="dialog"  class={`rdp-calendar rdp-calendar--${presentation ?? 'inline'}`}  aria-modal={presentation === 'sheet' ? 'true' : 'false'} >
{#if presentation === 'sheet' }
<div  class="rdp-calendar__scrim"  aria-hidden="true"  on:click="{(event) => {onDismiss?.()}}" ></div>


{/if}<div  class="rdp-calendar__panel" ><CalendarActionBar  position="top"  date={selectedDate}  locale={locale}  onDateClick={(event) => setView('month')} onPrev={(event) => prev()} onNext={(event) => next()}></CalendarActionBar>
{#if viewMode === 'day' }
<DateGrid  year={focusedYear}  month={focusedMonth}  selectedDate={selectedDate}  locale={locale}  onSelect={(d) => selectDay(d)}></DateGrid>


{/if}
{#if viewMode === 'month' }
<MonthPicker  year={focusedYear}  selectedMonth={focusedMonth}  locale={locale}  onSelect={(idx) => selectMonth(idx)}></MonthPicker>


{/if}
{#if viewMode === 'year' }
<YearPicker  yearRange={yearRange}  selectedYear={focusedYear}  onSelect={(y) => selectYear(y)}></YearPicker>


{/if}</div></div>