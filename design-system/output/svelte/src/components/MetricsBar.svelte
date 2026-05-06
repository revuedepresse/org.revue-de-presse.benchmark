<script context='module' lang='ts'>
      type MetricsBarProps = {
replies: number;
reposts: number;
likes: number;
locale?: Locale;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { formatCount } from '../utils/intl';
import type { Locale } from '../utils/i18n';
import  Icon from './Icon.svelte';





    export let replies: MetricsBarProps['replies'];
export let locale: MetricsBarProps['locale']= undefined;
export let reposts: MetricsBarProps['reposts'];
export let likes: MetricsBarProps['likes'];


















  </script>

  <div  class="rdp-metrics-bar" ><span  class="rdp-metrics-bar__pill rdp-metrics-bar__pill--reply"  aria-label={t('metrics.replies.aria-label', {
count: replies
}, locale ?? 'fr-FR')} ><Icon  name="reply"  size={16}  decorative={true} ></Icon>{formatCount(replies, locale ?? 'fr-FR')}</span><span  class="rdp-metrics-bar__pill rdp-metrics-bar__pill--repost"  aria-label={t('metrics.reposts.aria-label', {
count: reposts
}, locale ?? 'fr-FR')} ><Icon  name="retweet"  size={16}  decorative={true} ></Icon>{formatCount(reposts, locale ?? 'fr-FR')}</span><span  class="rdp-metrics-bar__pill rdp-metrics-bar__pill--like"  aria-label={t('metrics.likes.aria-label', {
count: likes
}, locale ?? 'fr-FR')} ><Icon  name="like-metric"  size={16}  decorative={true} ></Icon>{formatCount(likes, locale ?? 'fr-FR')}</span></div>