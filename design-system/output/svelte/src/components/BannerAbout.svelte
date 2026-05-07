<script context='module' lang='ts'>
      type BannerAboutProps = {
legalNoticeHref?: string;
contactHref?: string;
supportHref?: string;
sourcesHref?: string;
subscribeHref?: string;
onLegalNoticeClick?: () => void;
onContactClick?: () => void;
onSupportClick?: () => void;
onSourcesClick?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';
import  Icon from './Icon.svelte';





    export let onLegalNoticeClick: BannerAboutProps['onLegalNoticeClick']= undefined;
export let onContactClick: BannerAboutProps['onContactClick']= undefined;
export let onSupportClick: BannerAboutProps['onSupportClick']= undefined;
export let onSourcesClick: BannerAboutProps['onSourcesClick']= undefined;
export let subscribeHref: BannerAboutProps['subscribeHref']= undefined;
export let legalNoticeHref: BannerAboutProps['legalNoticeHref']= undefined;
export let contactHref: BannerAboutProps['contactHref']= undefined;
export let supportHref: BannerAboutProps['supportHref']= undefined;
export let sourcesHref: BannerAboutProps['sourcesHref']= undefined;



    function handleLegalClick(event: any) {
if (onLegalNoticeClick) {
  event.preventDefault();
  onLegalNoticeClick();
}
}
function handleContactClick(event: any) {
if (onContactClick) {
  event.preventDefault();
  onContactClick();
}
}
function handleSupportClick(event: any) {
if (onSupportClick) {
  event.preventDefault();
  onSupportClick();
}
}
function handleSourcesClick(event: any) {
if (onSourcesClick) {
  event.preventDefault();
  onSourcesClick();
}
}
    $: year = () => {
return new Date().getFullYear();
};













  </script>

  <footer  id="project"  class="rdp-banner-about" ><h2  class="rdp-banner-about__title rdp-banner-about__title--sharing" ><Icon  name="sharing"  size={24}  decorative={true} ></Icon><span >{t('footer.social.heading')}</span></h2><p  class="rdp-banner-about__paragraph rdp-banner-about__paragraph--sharing" >{t('footer.sharing.body')}<br  /><br  /><a  class="rdp-banner-about__subscribe-to"  rel="noreferrer nofollow noopener"  href={subscribeHref ?? 'https://bsky.app/profile/revue-de-presse.bsky.social'} ><span  class="rdp-banner-about__subscription-label" >{t('footer.subscribe-to.label')}</span></a></p><h2  class="rdp-banner-about__title rdp-banner-about__title--introducing" ><Icon  name="introducing"  size={24}  decorative={true} ></Icon><span >{t('footer.about.heading')}</span></h2><p  class="rdp-banner-about__paragraph" ><a  class="rdp-banner-about__outer-link"  href={legalNoticeHref ?? '/mentions-legales'}  on:click="{(event) => {handleLegalClick(event)}}" >{t('footer.about.privacy-policy')}</a><br  /><a  class="rdp-banner-about__outer-link"  href={contactHref ?? '/nous-contacter'}  on:click="{(event) => {handleContactClick(event)}}" >{t('footer.about.contact')}</a><br  /><a  class="rdp-banner-about__outer-link"  href={supportHref ?? '/nous-soutenir'}  on:click="{(event) => {handleSupportClick(event)}}" >{t('footer.about.support')}</a><br  /><a  class="rdp-banner-about__outer-link"  href={sourcesHref ?? '/sources'}  on:click="{(event) => {handleSourcesClick(event)}}" >{t('footer.about.sources')}</a><br  /></p><h2  class="rdp-banner-about__title rdp-banner-about__title--funding" ><Icon  name="funding"  size={24}  decorative={true} ></Icon><span >{t('footer.pro-bono.heading')}</span></h2><p  class="rdp-banner-about__paragraph" >{t('footer.pro-bono.body.before-author1')}<a  class="rdp-banner-about__outer-link"  href="https://bsky.app/profile/sylvainegarderet.bsky.social"  rel="noreferrer nofollow noopener" >
        @sylvainegarderet.bsky.social
      </a>{t('footer.pro-bono.body.between-authors')}<a  class="rdp-banner-about__outer-link"  href="https://bsky.app/profile/thierry.marianne.io"  rel="noreferrer nofollow noopener" >
        @thierry.marianne.io
      </a>{t('footer.pro-bono.body.after-author2')}<br  /><a  class="rdp-banner-about__outer-link"  href="https://netlify.com" >
        Netlify
      </a>{t('footer.pro-bono.body.netlify-suffix')}<a  class="rdp-banner-about__outer-link"  href="https://www.netlify.com/legal/open-source-policy/" >{t('footer.pro-bono.body.netlify-program')}</a>{t('footer.pro-bono.body.tail')}</p><div  class="rdp-banner-about__copyright-footer" ><div  class="rdp-banner-about__copyright" >{t('footer.copyright.prefix', {
year: year()
})}<a  class="rdp-banner-about__outer-link"  href="https://twitter.com/CcelestinC"  rel="noreferrer nofollow noopener" >
          @CcelestinC
        </a></div></div></footer>