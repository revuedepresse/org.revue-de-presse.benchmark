<script context='module' lang='ts'>
      type SpinnerProps = {
label?: string;
}

    </script>
    

    
<script lang='ts'>










  export let label: SpinnerProps['label']= undefined;


















</script>

<div  class="rdp-spinner"  role="status"  aria-live="polite"  aria-busy="true" ><span  class="rdp-spinner__ring"  aria-hidden="true" ></span><span  class="rdp-spinner__label" >{label ?? 'Chargement…'}</span></div>