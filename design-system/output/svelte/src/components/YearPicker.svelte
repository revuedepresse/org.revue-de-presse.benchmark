<script context='module' lang='ts'>
      type YearPickerProps = {
yearRange: {
  min: number;
  max: number;
};
selectedYear: number;
onSelect?: (year: number) => void;
}

    </script>
    

    
<script lang='ts'>










    export let yearRange: YearPickerProps['yearRange'];
export let selectedYear: YearPickerProps['selectedYear'];
export let onSelect: YearPickerProps['onSelect']= undefined;




    $: years = () => {
return Array.from({
  length: yearRange.max - yearRange.min + 1
}, (_, i) => yearRange.min + i);
};













  </script>

  <ul  class="rdp-year-picker"  role="listbox" >
{#each years() as y }
<li  role="option"  aria-selected={y === selectedYear ? 'true' : 'false'}  class={`rdp-year-picker__item${y === selectedYear ? ' rdp-year-picker__item--selected' : ''}`}  on:click="{(event) => {onSelect?.(y)}}" >{y}</li>
{/each}
{@html `<${'style'}  >${}<${'/style'}>`}</ul>