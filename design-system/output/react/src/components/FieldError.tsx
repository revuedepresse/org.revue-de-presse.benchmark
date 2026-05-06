import * as React from "react";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};
import { t } from "../utils/i18n";

function FieldError(props: FieldErrorProps) {
  return (
    <>
      {!!(props.messageKey || props.message) ? (
        <>
          <p className="rdp-field-error" role="alert">
            {props.messageKey ? (
              <>{t(props.messageKey, props.vars)}</>
            ) : (
              <>{props.message ?? ""}</>
            )}
            <style>{`
          .rdp-field-error {
            font-size: var(--font-size-publication-date);
            color: var(--form-error-fg);
            margin: 0;
            padding-left: var(--separation-1);
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
          </p>
        </>
      ) : null}
    </>
  );
}

export default FieldError;
