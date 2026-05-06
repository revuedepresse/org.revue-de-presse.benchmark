/** @jsx h */
import { h, Fragment } from "preact";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};
import { t } from "../utils/i18n";

function FieldError(props: FieldErrorProps) {
  return (
    <Fragment>
      {!!(props.messageKey || props.message) ? (
        <Fragment>
          <p className="rdp-field-error" role="alert">
            {props.messageKey ? (
              <Fragment>{t(props.messageKey, props.vars)}</Fragment>
            ) : (
              <Fragment>{props.message ?? ""}</Fragment>
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
        </Fragment>
      ) : null}
    </Fragment>
  );
}

export default FieldError;
