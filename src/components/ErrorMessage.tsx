import { Link } from "react-router";
import "./ErrorMessage.css";

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
  backTo?: string;
  backLabel?: string;
};

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
  backTo,
  backLabel = "← Back",
}: ErrorMessageProps) {
  return (
    <div role="alert" className="error-message">
      <p className="error-message__text">{message}</p>

      {(onRetry || backTo) && (
        <div className="error-message__actions">
          {onRetry && (
            <button
              type="button"
              className="error-message__button"
              onClick={onRetry}
            >
              Try again
            </button>
          )}
          {backTo && (
            <Link to={backTo} className="error-message__link">
              {backLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
