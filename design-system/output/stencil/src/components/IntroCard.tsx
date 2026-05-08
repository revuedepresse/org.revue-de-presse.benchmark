import { Logo } from "./Logo";

import { Component, h, Fragment } from "@stencil/core";

@Component({
  tag: "intro-card",
})
export class IntroCard {
  componentDidLoad() {}

  render() {
    return (
      <article class="rdp-intro-card">
        <header class="rdp-intro-card__header">
          <span class="rdp-intro-card__avatar" aria-hidden="true">
            <logo size="md" altKey="logo.alt" showWordmark={false}></logo>
          </span>
          <span class="rdp-intro-card__author">
            <strong>revue_2_presse</strong>
            <span class="rdp-intro-card__handle">@revue-de-presse.org</span>
          </span>
        </header>
        <p class="rdp-intro-card__body">
          Revue-de-presse.org est un projet citoyen indépendant qui s'adresse à
          toute personne curieuse de l'actualité et de l'influence des médias
          sur l'opinion.
        </p>
        <style>{`
        .rdp-intro-card {
          background: var(--color-content-background);
          color: var(--color-content-font);
          border-radius: var(--radius-default);
          padding: var(--separation-2);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-status-text);
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-intro-card__header {
          display: flex;
          gap: var(--separation-1);
          align-items: center;
          font-size: var(--font-size-content);
        }
        .rdp-intro-card__avatar {
          display: inline-flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rdp-intro-card__author { display: flex; flex-direction: column; }
        .rdp-intro-card__handle {
          color: var(--color-white);
          font-size: var(--font-size-publication-date);
        }
        .rdp-intro-card__body { margin: 0; }
      `}</style>
      </article>
    );
  }
}
