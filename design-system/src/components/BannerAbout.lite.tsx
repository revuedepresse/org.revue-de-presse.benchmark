import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import Icon from './Icon.lite';

type BannerAboutProps = {
  bodyKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

export default function BannerAbout(props: BannerAboutProps) {
  const state = useStore({
    dismissed: false,
    dismiss() {
      state.dismissed = true;
      props.onDismiss?.();
    },
  });

  return (
    <Show when={!state.dismissed}>
      <aside class="rdp-banner-about" role="region">
        <header class="rdp-banner-about__heading">
          <Icon name="introducing" size={24} />
          <span>{t('footer.about.heading')}</span>
        </header>
        <p class="rdp-banner-about__body">{t(props.bodyKey ?? 'footer.about.body')}</p>
        <Show when={!!props.dismissible}>
          <button
            type="button"
            class="rdp-banner-about__close"
            aria-label={t('actions.quit.label')}
            onClick={() => state.dismiss()}
          >
            ×
          </button>
        </Show>
        <style>{`
          .rdp-banner-about {
            background: var(--banner-about-bg);
            color: var(--banner-about-fg);
            padding: var(--separation-2);
            border-radius: var(--radius-default);
            font-family: 'Roboto', sans-serif;
            font-size: var(--font-size-content);
            position: relative;
          }
          .rdp-banner-about__heading {
            display: flex;
            align-items: center;
            gap: var(--separation-1);
            font-family: 'Signika', sans-serif;
            font-size: var(--font-size-status-text);
            color: var(--color-brand-active);
            margin-bottom: var(--separation-1);
          }
          .rdp-banner-about__body { margin: 0; }
          .rdp-banner-about__close {
            position: absolute;
            top: var(--separation-1);
            right: var(--separation-1);
            background: transparent;
            border: none;
            color: var(--color-content-font);
            font-size: 24px;
            cursor: pointer;
          }
        `}</style>
      </aside>
    </Show>
  );
}
