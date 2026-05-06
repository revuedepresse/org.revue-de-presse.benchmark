<script context='module' lang='ts'>
      type WebIntentsProps = {
postId: string;
onReply?: (id: string) => void;
onRepost?: (id: string) => void;
onLike?: (id: string) => void;
onShare?: (id: string) => void;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';





  export let onReply: WebIntentsProps['onReply']= undefined;
export let postId: WebIntentsProps['postId'];
export let onRepost: WebIntentsProps['onRepost']= undefined;
export let onLike: WebIntentsProps['onLike']= undefined;
export let onShare: WebIntentsProps['onShare']= undefined;


















</script>

<div  class="rdp-web-intents" ><button  type="button"  class="rdp-web-intents__btn"  aria-label={t('web-intents.reply.aria-label')}  on:click="{(event) => {onReply?.(postId)}}" >
    ↩
  </button><button  type="button"  class="rdp-web-intents__btn"  aria-label={t('web-intents.repost.aria-label')}  on:click="{(event) => {onRepost?.(postId)}}" >
    🔁
  </button><button  type="button"  class="rdp-web-intents__btn"  aria-label={t('web-intents.like.aria-label')}  on:click="{(event) => {onLike?.(postId)}}" >
    ♡
  </button><button  type="button"  class="rdp-web-intents__btn"  aria-label={t('web-intents.share.aria-label')}  on:click="{(event) => {onShare?.(postId)}}" >
    ↗
  </button>{@html `<${'style'}  >${}<${'/style'}>`}</div>