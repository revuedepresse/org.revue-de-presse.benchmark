import { t } from "../utils/i18n";
import { Icon } from "./Icon";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "banner-about",
})
export class BannerAbout {
  @Event() legalNoticeClick: any;
  @Event() contactClick: any;
  @Event() supportClick: any;
  @Event() sourcesClick: any;
  @Prop() subscribeHref: any;
  @Prop() legalNoticeHref: any;
  @Prop() contactHref: any;
  @Prop() supportHref: any;
  @Prop() sourcesHref: any;

  get year() {
    return new Date().getFullYear();
  }
  handleLegalClick(event: any) {
    if (this.legalNoticeClick) {
      event.preventDefault();
      this.legalNoticeClick.emit();
    }
  }
  handleContactClick(event: any) {
    if (this.contactClick) {
      event.preventDefault();
      this.contactClick.emit();
    }
  }
  handleSupportClick(event: any) {
    if (this.supportClick) {
      event.preventDefault();
      this.supportClick.emit();
    }
  }
  handleSourcesClick(event: any) {
    if (this.sourcesClick) {
      event.preventDefault();
      this.sourcesClick.emit();
    }
  }

  componentDidLoad() {}

  render() {
    return (
      <footer class="rdp-banner-about" id="project">
        <h2 class="rdp-banner-about__title rdp-banner-about__title--sharing">
          <icon name="sharing" size={24} decorative={true}></icon>
          <span>{t("footer.social.heading")}</span>
        </h2>
        <p class="rdp-banner-about__paragraph rdp-banner-about__paragraph--sharing">
          {t("footer.sharing.body")}
          <br />
          <br />
          <a
            class="rdp-banner-about__subscribe-to"
            rel="noreferrer nofollow noopener"
            href={
              this.subscribeHref ??
              "https://bsky.app/profile/revue-de-presse.bsky.social"
            }
          >
            <span class="rdp-banner-about__subscription-label">
              {t("footer.subscribe-to.label")}
            </span>
          </a>
        </p>
        <h2 class="rdp-banner-about__title rdp-banner-about__title--introducing">
          <icon name="introducing" size={24} decorative={true}></icon>
          <span>{t("footer.about.heading")}</span>
        </h2>
        <p class="rdp-banner-about__paragraph">
          <a
            class="rdp-banner-about__outer-link"
            href={this.legalNoticeHref ?? "/mentions-legales"}
            onClick={(event) => this.handleLegalClick(event)}
          >
            {t("footer.about.privacy-policy")}
          </a>
          <br />
          <a
            class="rdp-banner-about__outer-link"
            href={this.contactHref ?? "/nous-contacter"}
            onClick={(event) => this.handleContactClick(event)}
          >
            {t("footer.about.contact")}
          </a>
          <br />
          <a
            class="rdp-banner-about__outer-link"
            href={this.supportHref ?? "/nous-soutenir"}
            onClick={(event) => this.handleSupportClick(event)}
          >
            {t("footer.about.support")}
          </a>
          <br />
          <a
            class="rdp-banner-about__outer-link"
            href={this.sourcesHref ?? "/sources"}
            onClick={(event) => this.handleSourcesClick(event)}
          >
            {t("footer.about.sources")}
          </a>
          <br />
        </p>
        <h2 class="rdp-banner-about__title rdp-banner-about__title--funding">
          <icon name="funding" size={24} decorative={true}></icon>
          <span>{t("footer.pro-bono.heading")}</span>
        </h2>
        <p class="rdp-banner-about__paragraph">
          {t("footer.pro-bono.body.before-author1")}
          <a
            class="rdp-banner-about__outer-link"
            href="https://bsky.app/profile/sylvainegarderet.bsky.social"
            rel="noreferrer nofollow noopener"
          >
            @sylvainegarderet.bsky.social
          </a>
          {t("footer.pro-bono.body.between-authors")}
          <a
            class="rdp-banner-about__outer-link"
            href="https://bsky.app/profile/thierry.marianne.io"
            rel="noreferrer nofollow noopener"
          >
            @thierry.marianne.io
          </a>
          {t("footer.pro-bono.body.after-author2")}
          <br />
          <img
            class="rdp-banner-about__netlify-mark"
            width="20"
            height="20"
            alt="Netlify"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA69SURBVHgB7d1fbJX1Hcfx73PKiJSaNUCCXqgN0OHNFO4mmoyLYU6WKN31TIB5sd3hppLdTOPuRHRysWW7UCDBG2O2GhPShG3BREl2M4vLEoiVtPRCIUBqKC2awdn5Hny01NP2PM/z+/2e35/3KyFtjTYm+nmf8zznPM/JBPEYGRls3Jjb38qyZ6Qlg2LWZJbJ6K1WdljGxiYFUcgEwVvVbO68Ka0X29/uFAfa/9McvdXoOywnTowLgkYAAtfXfHzPLcmOSg1aku1tPxs4JghWnyBYdY5ftR89RmTL8KRMTJwRBIkABKru8eeIQNgIQIB8GX+OCISLAATGt/HniECYCEBAfB1/jgiEhwAEwvfx54hAWAhAAEIZf44IhIMAeC608eeIQBgIgMdCHX+OCPiPAHgq9PHniIDfCICHYhl/jgj4iwB4Jrbx54iAnwiAR2Idf44I+IcAeCL28eeIgF8IgAdSGX+OCPiDANQstfHniIAfCECNUh1/jgjUjwDUJPXx54hAvQhADRj/nYhAfbgnoGMux9/X3y+D27dJFTMfjcvNuTlxgXsMukcAHHI9/uEDz8ma+++TKuYvTMsnBw8RgUg1BE64ftrf3x5+1fGrNYZ+T68yaR2VZnOPwAkC4ADH/MUQAXcIgGWMvxwi4AYBsIjxV0ME7CMAljB+M4iAXQTAAsZvFhGwhwAYxvjtIAJ2EACDGL9dRMA8AmAI43eDCJhFAAxg/G4RAXMIQEWMvx5EwAwCUAHjrxcRqI4AlMT4/UAEqiEAJTB+vxCB8ghAQYzfT0SgHAJQAOP3GxEojgD0iPGHgQgUQwB6wPjDQgR6RwBWwPjDRAR6QwCWwfjDRgRWRgCWwPjjQASWRwC6YPxxIQJLIwCLMP44EYHuCMACjD9uROC7CMDXGH8aiMCdCIAw/tQQgW8lHwDGnyYicFvSAWD8aSMCCQeA8UOlHoEkA8D4sVDKEUguAIwf3aQagaQCwPixnBQjkEwAGD96kVoEkggA40cRKUUg+gAwfpSRSgSiDgDjRxUpRCDaADB+mBB7BFZJhGyMf/2jO2T1hvWd7y+d/IfcnJsTpEEj0Go2RcbGjklkoguAjfHfu/sJuWf3k9/8/P3t2+WTg4eIQEJijUBUhwAuxq/W3H+fDB94Tvr6+wXpiPFwIJoAuBp/jgikKbYIRBEA1+PPEYE0xRSB4ANQ1/hzRCBNsUQg6ADUPf4cEUhTDBEINgC+jD9HBNIUegSCDIBv488RgTSFHIHgAuDr+HNEIE2hRiCoAPg+/hwRSFOIEQgmADbGP7h9u/Hx54hAmkKLQBABsHVhT1//GrGJCKQppAh4HwCbV/X9b25ebKsrAtfOnpOrH56Wqq60f8ds+3ehmFAikInHXFzSq4cAeh7AtvkL07VcQDTw4FapgvFX05Jsr88XEHkbAJfX87uKwIU3jnQeUZEWnyPQJx5yfTOP2XP6KJfJ3RUfLVfyxUfjMj89LUhL+1F2RLYMT8rExBnxjHcBqOtOPi4iQADS5WsEvApA3bfxsh0BApA2HyPgTQB8uYefzQgQAPgWAS8C4NsNPG1FgABA+RSB2gPg6917bUSAACDnSwRqDYDvt+42HQECgIV8iEBtAQjlvv0mI0AAsFjdEaglAKF9aIepCBAAdFNnBJwHINRP7DERAQKApdQVAacBCP3juqpG4Mrp0/LlZ58L0E0dEXAWgFg+q69sBD579z25cup9AZbjOgJOLgaK8YM6V2/YUOjv/+ryZQF65eoCIusB4FN6gXJcRMDqIQDjB8pzcThgLQCMH6jOdgSsBIDxA+bYjIDxcwCMv5yhjRvFJzOzszJz/brAHzbOCRgNAOMvZ89PdsmRZ58VH2kEJj//XCYvXZT3P/6PnDn/qZz6+GNBPUxHwFgAGH85g2sH5Oo770hIJi9e7ETg928d73wPt0xGwEgAGH95+tT//FFvbxq7ojwEPCtwy1QEKp8EZPzVDA4MyP6Rn0moNGB7du2SB9pfz5w/z3kDR0ydGKz0wSCMH7m97QjoM5n9IyMCN0x8+EjpADB+dPOHX/5K3vzNs+1zG2sF9lWNQKkAMH4sR58N/PuPf/Lupc1YVYlA4QAwfvRCx//Plw8SAUfKRqBQABg/itDx//V3L3A44EiZCPQcAMaPMrZt3iyvtc8LwI2iEegpAIwfVeg5AV4dcKdIBFYMAOOHCS8+9RTnAxzqNQLLBoDxwxR9y7O+PAh3eonAkgFg/DBt50MPdf7AnZUi0DUAjB+2vPDzpwRuLReBVYv/AuMPW3513uKr9Fa6ai8/Ptez9jZftsufBXDxkFsagVazKYsvILojAIw/bIdHR+XXf/mzVKUR+PEPH+qcubdx4m73jx4hADXoFoFvDgEYf/jGP/1UTNDfc3j0b7Jp7x556a3jYtqex3cJ6rH4cKATgO/9dNc2xo9uXjp+XH7x2qtikr4iwMnA+nwdgZ36fScAN2819guwhKMnT3YOL0x6eNMmQX3aEXhRvzbaJRhqiewVYBn6TMDk7b8e3rRZUKudMjIy2GhkLR79saKZ67NyrP1MwBQOAerXuHHjmUarJbxJGz0xeRgwOMAVgnVrtR/89WXAITGkr79f+u+/T2J27ew5SZU+C9DDABMvDeqJQBvKfnR7KL68fMXcB822ZHCVGLJ6w3oZPvB852vMrn5wWqbePCKper/9+v3QLjMv42lITJ5XeODpfbLu0R0Ss6/aAfjk4CFjEah0U9CF7t39RPTjV+se2yEDkT/KLMfXzwHQR/7Yx690Y7o1U4wFAEB4CAAKmbrEJwHFhAAACSMAQMIIAJAwAgAkjAAACSMAQMIIAJAwAgAkjAAACSMAQMIIAJAwAgAkjAAACTMWgM/efa9zs4LYXfnwtMwmfFcgX+mdmq62/9vETjemWzPF2B2Bbt+p5BVZvWGDxIzx+2vqjSOdQMds/sK03JybE1NWSSYzem8wMeCrzv3K4n8WAH8R6EImG1krOywAkpNlMtq4ddeN1wVAcm61H/wbMnpqpv39KQGQjEw/C3RsbLLzKkBLspcEQDJuNRqdQ//bLwOOjZ1qR2CfAIheZ+snTozr99++D2Bs7CgRAOLW2Xh76/nPd74RiAgA0Vo8fvXddwISASA63cavur8VmAgA0Vhq/GrpawGIABC85cavlr8YiAgAwVpp/GrlqwGJABCcXsaverscmAgAweh1/Kr3+wEQAcB7Rcavit0QhAgA3io6flX8jkBEAPBOmfGrcrcEIwKAN8qOX5W/JyARAGpXZfyq2k1BiQBQm6rjV9XvCkwEAOdMjF+ZuS04EfDCF9evS0hmZmcFxZkav+oTUyYmxmXL8FQmMiLo2Ux7tFOXLsruR3ZIFcf+flJefvttsW38/HkZumejbNu0WarY99qr8q+zZwXFmBy/ysS0ZnNvJq0jgkIG166VwYEBKWvy4kVxaWjjRqnC9b9vDEyPX5kPgCICgFE2xq/MHQIsxOEAYIyt8Ss7AVBEAKjM5viVvQAoIgCUZnv8ym4AFBEACnMxfmXnJGA3EZ0YXL1hvdy7+8lC/8ztj0+/LMBKXI1fuQuAiiACOv7hA893vhZx++PTDxEBLMvl+JX9Q4CFAj8cKDt+1dffLzcuTMv89LQA3bgevzLzVuAiAn3bcJXxAyupY/zKfQBUYBFg/LCprvGregKgAokA44dNdY5f1RcA5XkEGD9sqnv8qt4AKE8jwPhhkw/jV/UHQHkWAcYPm3wZv/IjAMqTCDB+2OTT+JU/AVA1R4Dxwybfxq/8CoCqKQKMHzb5OH7lXwCU4wgwftjk6/jVKvGVRqDZFNvXDrgc/5dXrohrdz+4Vaq4dvacoDyfx6/cXgxUhsULiFyOf+qNI3L1w9Pi0gNP75N1j1a72ejVD07L1Jvc3a0M38ev/DwEWMji4cDdW7dGO3595K86frXusR0yUPFZRIpCGL/yPwAq4M8dqGP8qFco41dhBEBZiMC1c+c61+nbwvjTE9L4VTgBUIYjcPsmHa9YiQDjT09o41dhBUAFEAHGn54Qx6/CC4DyOAKMPz2hjl+FGQDlYQQYf3pCHr8KNwDKowgw/vSEPn4VdgCUBxFg/OmJYfwq/ACoGiPA+NMTy/hVHAFQNUSA8acnpvGreAKgHEaA8acntvGruAKgHESA8acnxvErfy8HrsLwpcQ6/v8e+K0gTbGOX8X3DCAX8AVE8EfM41fxBkARAVQQ+/hV3AFQRAAlpDB+FX8AFBFAAamMX6URAEUE0IOUxq/SCYAiAlhGauNXaQVAEQF0keL4VXoBUEQAC6Q6fpVmABQRgKQ9fpVuABQRSFrq41dpB0ARgSQx/tsIgCICSWH83yIAOSKQBMZ/JwKwEBGIGuP/LgKwGBGIEuPvjgB0QwSiwviXRgCWQgSiwPiXRwCWQwSCxvhXRgBWQgSCxPh7QwB6QQSCwvh7RwB6RQSCwPiLIQBFEAGvMf7iCEBRRMBLjL8cAlAGEfAK4y+PAJRFBLzA+KshAFUQgVox/uoIQFVEoBaM3wwCYAIRcIrxm0MATCECTjB+swiASUTAKsZvHgEwjQhYwfjtIAA2EAGjGL89BMAWImAE47eLANhEBCph/PYRANuIQCmM3w0C4AIRKITxu0MAXHEcgbkL0zLf/lPVvKHf0yvG71YmcKvZ3JtJ64g40NffL9/fvk2q+OKjcbk5NycuMH73CEAdHEYgFIy/Hn0C9yYmxmXL8FS7viMCxl8jAlAXItDB+OtFAOqUeAQYf/0IQN0SjQDj9wMB8EFiEWD8/iAAvkgkAozfLwTAJ5FHgPH7hwD4JtIIMH4/EQAfRRYBxu8vAuCrSCLA+P1GAHwWeAQYv/8IgO8CjQDjDwMBCEFgEWD84SAAoQgkAow/LAQgJJ5HgPGHhwCExtMIMP4wEYAQeRYBxh8uAhAqTyLA+MNGAEJWcwQYf/gIQOg0Aj/Y9G6j1VjT/qnaHUB7lp36evyjgqBxU9CYNJtDkrWeyVqyu/3TkJiUyUyrlR2Wu+56XUZHZwRR+D/JqXKgGBYtwQAAAABJRU5ErkJggg=="
          />
          <a class="rdp-banner-about__outer-link" href="https://netlify.com">
            Netlify
          </a>
          {t("footer.pro-bono.body.netlify-suffix")}
          <a
            class="rdp-banner-about__outer-link"
            href="https://www.netlify.com/legal/open-source-policy/"
          >
            {t("footer.pro-bono.body.netlify-program")}
          </a>
          {t("footer.pro-bono.body.tail")}
        </p>
        <div class="rdp-banner-about__copyright-footer">
          <div class="rdp-banner-about__copyright">
            {t("footer.copyright.prefix", {
              year: this.year,
            })}
            <a
              class="rdp-banner-about__outer-link"
              href="https://twitter.com/CcelestinC"
              rel="noreferrer nofollow noopener"
            >
              @CcelestinC
            </a>
          </div>
        </div>
        <style>{`
        .rdp-banner-about {
          background: var(--color-content-background);
          color: var(--color-content-font);
          border: none;
          border-radius: var(--radius-default);
          padding: var(--separation-2);
          padding-bottom: var(--separation-3);
          width: 100%;
          margin: 0;
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-footer-paragraph);
          line-height: var(--line-height-base);
          overflow: hidden;
        }
        .rdp-banner-about__title {
          color: var(--color-white);
          display: flex;
          align-items: center;
          gap: var(--separation-1);
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-footer-title);
          line-height: 30px;
          margin: calc(3 * var(--separation-1)) 0 var(--separation-1);
          white-space: nowrap;
          min-width: 0;
        }
        .rdp-banner-about__title > span {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rdp-banner-about__title:first-child { margin-top: 0; }
        .rdp-banner-about__paragraph { font-size: 1em; margin: 0 0 var(--separation-1); }
        .rdp-banner-about__paragraph--sharing { margin-bottom: 0; }
        .rdp-banner-about a {
          color: var(--color-white);
          text-decoration: underline;
        }
        .rdp-banner-about__subscribe-to {
          display: inline-flex;
          background: var(--color-brand-bluesky);
          border-radius: 4px;
          padding: 5px var(--separation-0) 4px;
          margin-top: var(--separation-0);
          font-size: var(--font-size-footer-outer-link);
          line-height: var(--line-height-base);
          letter-spacing: 0;
          text-decoration: none;
          color: var(--color-white);
          font-weight: bold;
        }
        .rdp-banner-about__subscription-label { padding-left: var(--separation-0); }
        .rdp-banner-about__netlify-mark {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
        .rdp-banner-about__copyright-footer {
          color: var(--color-white);
          display: flex;
          width: 100%;
          font-size: var(--font-size-footer-copyright);
          line-height: var(--line-height-base);
          text-align: center;
          margin-top: calc(3 * var(--separation-1));
        }
        .rdp-banner-about__copyright {
          margin: auto;
          margin-bottom: var(--separation-2);
        }
        .rdp-banner-about__copyright .rdp-banner-about__outer-link,
        .rdp-banner-about__copyright-footer .rdp-banner-about__outer-link {
          display: inline-flex;
          margin: auto;
          align-self: center;
          color: var(--color-white);
        }
      `}</style>
      </footer>
    );
  }
}
