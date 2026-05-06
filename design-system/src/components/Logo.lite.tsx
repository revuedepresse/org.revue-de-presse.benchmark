import { t } from '../utils/i18n';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  altKey?: string;
};

export default function Logo(props: LogoProps) {
  return (
    <span class="rdp-logo" data-size={props.size ?? 'md'}>
      <svg
        width={props.size === 'sm' ? 32 : props.size === 'lg' ? 64 : 48}
        height={props.size === 'sm' ? 32 : props.size === 'lg' ? 64 : 48}
        viewBox="0 0 58 58"
        role="img"
        aria-label={t(props.altKey ?? 'logo.alt')}
      >
        <circle cx="29" cy="29" r="29" fill="var(--color-brand)" />
        <g transform="translate(6.349 13.196)">
          <path
            d="M44.485 41.775l-.4-.392-.767-.758-.845.835-.319.315 1.164 2.083z"
            transform="translate(-24.524 -28.899)"
            fill="var(--color-white)"
          />
        </g>
      </svg>
      {props.showWordmark && <span class="rdp-logo__wordmark">Revue de presse</span>}
      <style>{`
        .rdp-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
        }
        .rdp-logo__wordmark {
          font-family: 'Signika', sans-serif;
          font-size: 24px;
          color: var(--color-brand);
        }
      `}</style>
    </span>
  );
}
