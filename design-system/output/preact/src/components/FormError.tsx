/** @jsx h */
import { h, Fragment } from "preact";

type FormErrorProps = {
  errors: ErrorMessage[];
};
import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

function FormError(props: FormErrorProps) {
  function items() {
    return (props.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  }

  function prefix() {
    return (props.errors ?? []).length > 1 ? "- " : "";
  }

  return (
    <Fragment>
      {items().length > 0 ? (
        <Fragment>
          <div className="rdp-form-error" role="alert" aria-live="polite">
            {items()?.map((item) => (
              <p className="rdp-form-error__item">
                {prefix()}
                {item.text}
              </p>
            ))}
            <style>{`
          .rdp-form-error {
            color: var(--form-error-fg);
            font-size: var(--font-size-publication-date);
            font-family: 'Roboto', sans-serif;
            margin-top: var(--separation-1);
          }
          .rdp-form-error__item { margin: 0; }
        `}</style>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  );
}

export default FormError;
