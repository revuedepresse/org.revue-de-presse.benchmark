<script context='module' lang='ts'>
      type ListItem = {
id: string;
label: string;
}

type SidebarProps = {
lists?: ListItem[];
selectedListId?: string;
selectedDate: Date;
yearRange: {
  min: number;
  max: number;
};
minDate?: Date;
locale?: Locale;
onListSelect?: (id: string) => void;
onDateSelect?: (date: Date) => void;
onLegalNoticeClick?: () => void;
onContactClick?: () => void;
onSupportClick?: () => void;
onSourcesClick?: () => void;
}

    </script>
    

    
<script lang='ts'>




import  Calendar from './Calendar.svelte';
import  BannerAbout from './BannerAbout.svelte';
import type { Locale } from '../utils/i18n';





  export let selectedDate: SidebarProps['selectedDate'];
export let locale: SidebarProps['locale']= undefined;
export let yearRange: SidebarProps['yearRange'];
export let minDate: SidebarProps['minDate']= undefined;
export let onDateSelect: SidebarProps['onDateSelect']= undefined;
export let onLegalNoticeClick: SidebarProps['onLegalNoticeClick']= undefined;
export let onContactClick: SidebarProps['onContactClick']= undefined;
export let onSupportClick: SidebarProps['onSupportClick']= undefined;
export let onSourcesClick: SidebarProps['onSourcesClick']= undefined;


















</script>

<aside  class="rdp-sidebar" ><Calendar  selectedDate={selectedDate}  locale={locale}  yearRange={yearRange}  minDate={minDate}  onSelect={(d) => onDateSelect?.(d)}></Calendar><BannerAbout  onLegalNoticeClick={(event) => onLegalNoticeClick()} onContactClick={(event) => onContactClick()} onSupportClick={(event) => onSupportClick()} onSourcesClick={(event) => onSourcesClick()}></BannerAbout></aside>