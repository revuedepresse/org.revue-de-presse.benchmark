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
publicationUrl?: string;
}

type BlueskyPostCardProps = {
post: BlueskyPost;
locale?: Locale;
}

type Segment = {
kind: 'text' | 'mention' | 'url';
value: string;
href: string;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  { formatDate, formatTime } from '../utils/intl';
import  MetricsBar from './MetricsBar.svelte';
import  MediaPlaceholder from './MediaPlaceholder.svelte';
import type { Locale } from '../utils/i18n';





    export let post: BlueskyPostCardProps['post'];
export let locale: BlueskyPostCardProps['locale']= undefined;




    $: profileUrl = () => {
return `https://bsky.app/profile/${post.authorHandle}`;
};
$: publicationUrl = () => {
return post.publicationUrl ?? `https://bsky.app/profile/${post.authorHandle}`;
};
$: bodySegments = () => {
const text = post.body ?? '';
const out: Segment[] = [];
const re = /(https?:\/\/[^\s]+|@[A-Za-z0-9._-]+(?:\.[A-Za-z]{2,})?|[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/[^\s]*)/g;
let last = 0;
let m: RegExpExecArray | null = re.exec(text);
while (m !== null) {
  if (m.index > last) {
    out.push({
      kind: 'text',
      value: text.slice(last, m.index),
      href: ''
    });
  }
  const matched = m[0];
  if (matched.charAt(0) === '@') {
    const handle = matched.slice(1).replace(/[.,;:!?)]+$/, '');
    out.push({
      kind: 'mention',
      value: `@${handle}`,
      href: `https://bsky.app/profile/${handle}`
    });
    const trailing = matched.length - 1 - handle.length;
    if (trailing > 0) {
      out.push({
        kind: 'text',
        value: matched.slice(matched.length - trailing),
        href: ''
      });
    }
  } else if (matched.charAt(0) === 'h') {
    const trimmed = matched.replace(/[.,;:!?)]+$/, '');
    const trailing = matched.length - trimmed.length;
    out.push({
      kind: 'url',
      value: trimmed,
      href: trimmed
    });
    if (trailing > 0) {
      out.push({
        kind: 'text',
        value: matched.slice(matched.length - trailing),
        href: ''
      });
    }
  } else {
    const trimmed = matched.replace(/[.,;:!?)]+$/, '');
    const trailing = matched.length - trimmed.length;
    out.push({
      kind: 'url',
      value: trimmed,
      href: `https://${trimmed}`
    });
    if (trailing > 0) {
      out.push({
        kind: 'text',
        value: matched.slice(matched.length - trailing),
        href: ''
      });
    }
  }
  last = m.index + matched.length;
  m = re.exec(text);
}
if (last < text.length) {
  out.push({
    kind: 'text',
    value: text.slice(last),
    href: ''
  });
}
return out;
};













  </script>

  <div  class="rdp-bsky-post-frame" ><div  class="rdp-bsky-post__metrics"  aria-hidden="false" ><MetricsBar  replies={post.metrics.replies}  reposts={post.metrics.reposts}  likes={post.metrics.likes}  locale={locale} ></MetricsBar></div><article  class="rdp-bsky-post" ><a  class="rdp-bsky-post__bluesky"  aria-label="Bluesky"  rel="noreferrer nofollow noopener"  target="_blank"  href={publicationUrl()} ><svg  viewBox="0 0 600 530"  width="20"  height="20"  fill="currentColor"  aria-hidden="true" ><path  d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.158 217.613 10 86.535 10 68.825c0-88.687 77.742-60.816 125.72-24.795z" ></path></svg></a><header  class="rdp-bsky-post__header" ><a  class="rdp-bsky-post__avatar"  rel="noreferrer nofollow noopener"  target="_blank"  aria-label={post.authorName}  href={profileUrl()} >
{#if !!post.authorAvatarUrl }
<img  alt=""  src={post.authorAvatarUrl}  />


{/if}</a><a  class="rdp-bsky-post__author"  rel="noreferrer nofollow noopener"  target="_blank"  href={profileUrl()} ><strong >{post.authorName}</strong><span  class="rdp-bsky-post__handle" >{t('bluesky.handle.prefix')}{post.authorHandle}</span></a></header><p  class="rdp-bsky-post__body" >
{#each bodySegments() as seg }

{#if seg.kind === 'text' }
{seg.value}


{/if}

{#if seg.kind === 'mention' }
<a  class="rdp-bsky-post__body-link rdp-bsky-post__body-link--mention"  rel="noreferrer nofollow noopener"  target="_blank"  href={seg.href} >{seg.value}</a>


{/if}

{#if seg.kind === 'url' }
<a  class="rdp-bsky-post__body-link rdp-bsky-post__body-link--url"  rel="noreferrer nofollow noopener"  target="_blank"  href={seg.href} >{seg.value}</a>


{/if}
{/each}
</p>
{#if !!post.hasMedia }
<MediaPlaceholder  width={270}  height={160} ></MediaPlaceholder>


{/if}<footer  class="rdp-bsky-post__footer" ><a  class="rdp-bsky-post__timestamp-link"  rel="noreferrer nofollow noopener"  target="_blank"  href={publicationUrl()} ><time  class="rdp-bsky-post__timestamp" >{formatTime(post.publishedAt, locale ?? 'fr-FR')} · {formatDate(post.publishedAt, 'longDay', locale ?? 'fr-FR')}</time></a></footer></article></div>