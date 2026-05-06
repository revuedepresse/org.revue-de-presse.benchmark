<script lang='ts'>




  import  { t } from '../utils/i18n';










    $: year = () => {
return new Date().getFullYear();
};













  </script>

  <footer  class="rdp-footer" ><section  class="rdp-footer__section" ><h3 >{t('footer.about.heading')}</h3><p >{t('footer.about.body')}</p></section><section  class="rdp-footer__section" ><h3 >{t('footer.social.heading')}</h3><p >{t('footer.social.body')}</p></section><section  class="rdp-footer__section" ><h3 >{t('footer.pro-bono.heading')}</h3><p >{t('footer.pro-bono.body')}</p></section><p  class="rdp-footer__copyright" >{t('footer.copyright', {
year: year()
})}</p></footer>