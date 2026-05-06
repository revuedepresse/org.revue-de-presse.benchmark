<script context='module' lang='ts'>
      export type BlueskyPost = {
id: string;
authorName: string;
authorHandle: string;
authorAvatarUrl?: string;
body: string;
publishedAt: Date;
metrics: {
  replies: number;
  reposts: number;
  likes: number;
};
hasMedia?: boolean;
}

type BlueskyPostCardProps = {
post: BlueskyPost;
locale?: Locale;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';
import  { formatDate } from '../utils/intl';
import  MetricsBar from './MetricsBar.svelte';
import  WebIntents from './WebIntents.svelte';
import  MediaPlaceholder from './MediaPlaceholder.svelte';
import type { Locale } from '../utils/i18n';





  export let post: BlueskyPostCardProps['post'];
export let locale: BlueskyPostCardProps['locale']= undefined;


















</script>

<article  class="rdp-bsky-post" ><MetricsBar  replies={post.metrics.replies}  reposts={post.metrics.reposts}  likes={post.metrics.likes}  locale={locale} ></MetricsBar><header  class="rdp-bsky-post__header" ><span  class="rdp-bsky-post__avatar"  aria-hidden="true" >
{#if !!post.authorAvatarUrl }
<img  alt=""  src={post.authorAvatarUrl}  />


{/if}</span><span  class="rdp-bsky-post__author" ><strong >{post.authorName}</strong><span  class="rdp-bsky-post__handle" >{t('bluesky.handle.prefix')}{post.authorHandle}</span></span></header><p  class="rdp-bsky-post__body" >{post.body}</p>
{#if !!post.hasMedia }
<MediaPlaceholder  width={270}  height={160} ></MediaPlaceholder>


{/if}<footer  class="rdp-bsky-post__footer" ><time  class="rdp-bsky-post__timestamp" >{formatDate(post.publishedAt, 'longDay', locale ?? 'fr-FR')}</time><WebIntents  postId={post.id} ></WebIntents></footer>{@html `<${'style'}  >${}<${'/style'}>`}</article>