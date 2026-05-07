<script context='module' lang='ts'>
      type ContactPageProps = {
email?: string;
}

    </script>
    

    
<script lang='ts'>










  export let email: ContactPageProps['email']= undefined;


















</script>

<article  class="rdp-contact-page" ><h1 >Nous contacter</h1><p >
    Il est possible de prendre contact avec nous à l'adresse suivante :
    <br  /><a  class="rdp-contact-page__email"  href={`mailto:${email ?? 'contact@revue-de-presse.org'}`} >{email ?? 'contact@revue-de-presse.org'}</a></p></article>