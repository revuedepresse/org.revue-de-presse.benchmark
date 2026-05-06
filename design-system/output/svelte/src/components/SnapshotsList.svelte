<script context='module' lang='ts'>
      type ListItem = {
id: string;
label: string;
}

type SnapshotsListProps = {
items: ListItem[];
selectedId?: string;
presentation?: 'inline' | 'sheet';
onSelect?: (id: string) => void;
onDismiss?: () => void;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';
import  Icon from './Icon.svelte';





  export let presentation: SnapshotsListProps['presentation']= undefined;
export let onDismiss: SnapshotsListProps['onDismiss']= undefined;
export let items: SnapshotsListProps['items'];
export let selectedId: SnapshotsListProps['selectedId']= undefined;
export let onSelect: SnapshotsListProps['onSelect']= undefined;


















</script>

<div  class={`rdp-snapshots-list rdp-snapshots-list--${presentation ?? 'inline'}`} >
{#if presentation === 'sheet' }
<div  class="rdp-snapshots-list__scrim"  aria-hidden="true"  on:click="{(event) => {onDismiss?.()}}" ></div>


{/if}<div  class="rdp-snapshots-list__panel" ><header  class="rdp-snapshots-list__header" ><Icon  name="pick-list"  size={24}  decorative={true} ></Icon><span >{t('snapshots-list.heading')}</span></header>
{#if items.length === 0 }
<p  class="rdp-snapshots-list__empty" >{t('snapshots-list.empty')}</p>


{/if}
{#if items.length > 0 }
<ul  class="rdp-snapshots-list__items"  role="listbox" >
{#each items as item }
<li  role="option"  aria-selected={item.id === selectedId ? 'true' : 'false'}  class={`rdp-snapshots-list__item${item.id === selectedId ? ' rdp-snapshots-list__item--selected' : ''}`}  on:click="{(event) => {onSelect?.(item.id)}}" >{item.label}</li>
{/each}
</ul>


{/if}</div>{@html `<${'style'}  >${}<${'/style'}>`}</div>