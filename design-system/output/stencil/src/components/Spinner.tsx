import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "spinner",
})
export class Spinner {
  @Prop() label: any;

  componentDidLoad() {}

  render() {
    return (
      <div
        class="rdp-spinner"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span class="rdp-spinner__ring" aria-hidden="true"></span>
        <span class="rdp-spinner__label">{this.label ?? "Chargement…"}</span>
        <style>{`
        .rdp-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--separation-1);
          padding: calc(3 * var(--separation-2)) var(--separation-2);
          color: var(--color-light-grey);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-spinner__ring {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-brand);
          animation: rdp-spinner-rotate 0.9s linear infinite;
        }
        .rdp-spinner__label {
          font-size: var(--font-size-publication-date);
        }
        @keyframes rdp-spinner-rotate {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rdp-spinner__ring { animation-duration: 2.4s; }
        }
      `}</style>
      </div>
    );
  }
}
