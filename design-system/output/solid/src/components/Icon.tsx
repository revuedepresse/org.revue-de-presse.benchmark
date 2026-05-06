type IconProps = {
  name: IconName;
  size?: 24 | 32;
  ariaLabel?: string;
  decorative?: boolean;
};

import type { IconName } from "../types";

function Icon(props: IconProps) {
  return (
    <>
      <svg
        class="rdp-icon"
        viewBox="0 0 24 24"
        width={props.size ?? 24}
        height={props.size ?? 24}
        aria-hidden={props.decorative ?? !props.ariaLabel ? "true" : undefined}
        aria-label={
          props.decorative ?? !props.ariaLabel ? undefined : props.ariaLabel
        }
        role={props.decorative ?? !props.ariaLabel ? undefined : "img"}
      >
        <use href={`#${props.name}`}></use>
        <style>{`
        .rdp-icon { display: inline-block; vertical-align: middle; color: currentColor; }
      `}</style>
      </svg>
    </>
  );
}

export default Icon;
