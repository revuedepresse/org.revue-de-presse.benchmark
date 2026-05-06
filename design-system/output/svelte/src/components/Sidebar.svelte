<script context='module' lang='ts'>
      type ListItem = {
id: string;
label: string;
}

type SidebarProps = {
lists: ListItem[];
selectedListId?: string;
selectedDate: Date;
yearRange: {
  min: number;
  max: number;
};
locale?: Locale;
onListSelect?: (id: string) => void;
onDateSelect?: (date: Date) => void;
}

    </script>
    

    
<script lang='ts'>




import  SnapshotsList from './SnapshotsList.svelte';
import  Calendar from './Calendar.svelte';
import  BannerAbout from './BannerAbout.svelte';
import  Footer from './Footer.svelte';
import type { Locale } from '../utils/i18n';





  export let lists: SidebarProps['lists'];
export let selectedListId: SidebarProps['selectedListId']= undefined;
export let onListSelect: SidebarProps['onListSelect']= undefined;
export let selectedDate: SidebarProps['selectedDate'];
export let locale: SidebarProps['locale']= undefined;
export let yearRange: SidebarProps['yearRange'];
export let onDateSelect: SidebarProps['onDateSelect']= undefined;


















</script>

<aside  class="rdp-sidebar" ><SnapshotsList  items={lists}  selectedId={selectedListId}  onSelect={(id) => onListSelect?.(id)}></SnapshotsList><Calendar  selectedDate={selectedDate}  locale={locale}  yearRange={yearRange}  onSelect={(d) => onDateSelect?.(d)}></Calendar><BannerAbout ></BannerAbout><Footer ></Footer></aside>