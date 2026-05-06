<script context='module' lang='ts'>
      type NoticeProps = {
headlineKey: string;
bodyKey: string;
headlineVars?: Record<string, string | number>;
bodyVars?: Record<string, string | number>;
}

    </script>
    

    
<script lang='ts'>




import  { t } from '../utils/i18n';





  export let headlineKey: NoticeProps['headlineKey'];
export let headlineVars: NoticeProps['headlineVars']= undefined;
export let bodyKey: NoticeProps['bodyKey'];
export let bodyVars: NoticeProps['bodyVars']= undefined;


















</script>

<div  class="rdp-notice"  role="status" ><h2  class="rdp-notice__headline" >{t(headlineKey, headlineVars)}</h2><p  class="rdp-notice__body" >{t(bodyKey, bodyVars)}</p></div>