import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type MediaPlaceholderProps = {
  width?: number;
  height?: number;
  aspectRatio?: string;
};

@Component({
  selector: "media-placeholder",
  template: `
    <div
      class="rdp-media-placeholder"
      aria-hidden="true"
      [ngStyle]="{
          width: width ? \`\${width}px\` : '100%',
          height: height ? \`\${height}px\` : undefined,
          aspectRatio: aspectRatio
        }"
    >
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="60"
          stroke="var(--color-light-grey)"
          strokeWidth="1"
        ></line>
        <line
          x1="100"
          y1="0"
          x2="0"
          y2="60"
          stroke="var(--color-light-grey)"
          strokeWidth="1"
        ></line>
      </svg>
      <style>
        {{\`
                .rdp-media-placeholder {
                  display: block;
                  background: #b0c4d4;
                  border-radius: var(--radius-default);
                  overflow: hidden;
                  max-width: 270px;
                }
                .rdp-media-placeholder svg { width: 100%; height: 100%; display: block; }
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class MediaPlaceholder {
  @Input() width!: MediaPlaceholderProps["width"];
  @Input() height!: MediaPlaceholderProps["height"];
  @Input() aspectRatio!: MediaPlaceholderProps["aspectRatio"];
}

@NgModule({
  declarations: [MediaPlaceholder],
  imports: [CommonModule],
  exports: [MediaPlaceholder],
})
export class MediaPlaceholderModule {}
