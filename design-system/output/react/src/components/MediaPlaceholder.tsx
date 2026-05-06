import * as React from "react";

type MediaPlaceholderProps = {
  width?: number;
  height?: number;
  aspectRatio?: string;
};

function MediaPlaceholder(props: MediaPlaceholderProps) {
  return (
    <div
      className="rdp-media-placeholder"
      aria-hidden="true"
      style={`width:${props.width ? `${props.width}px` : "100%"};${
        props.height ? `height:${props.height}px;` : ""
      }${props.aspectRatio ? `aspect-ratio:${props.aspectRatio};` : ""}`}
    >
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="60"
          stroke="var(--color-light-grey)"
          strokeWidth="1"
        />
        <line
          x1="100"
          y1="0"
          x2="0"
          y2="60"
          stroke="var(--color-light-grey)"
          strokeWidth="1"
        />
      </svg>
      <style>{`
        .rdp-media-placeholder {
          display: block;
          background: #b0c4d4;
          border-radius: var(--radius-default);
          overflow: hidden;
          max-width: 270px;
        }
        .rdp-media-placeholder svg { width: 100%; height: 100%; display: block; }
      `}</style>
    </div>
  );
}

export default MediaPlaceholder;
