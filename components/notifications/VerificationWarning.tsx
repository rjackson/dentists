import { SyntheticEvent, useReducer } from "react";
import { Alert, Button, H3 } from "@rjackson/rjds";
import { Subscription } from "lib/notifications/types";

type VerificationWarningProps = {
  subscription: Subscription;
};

type RequestState = {
  success: boolean;
  isLoading: boolean;
  error?: string;
};

type RequestAction = { type: "reset" } | { type: "request" } | { type: "success" } | { type: "error"; error: string };

const requestReducer = (state: RequestState, action: RequestAction) => {
  switch (action.type) {
    case "reset":
      return { isLoading: false, success: false };
    case "request":
      return { isLoading: true, success: false };
    case "success":
      return { isLoading: false, success: true };
    case "error":
      return { isLoading: false, success: false, error: action.error };
  }
};

const VerificationWarning = ({ subscription }: VerificationWarningProps): JSX.Element => {
  const { emailAddress } = subscription;
  const [{ success, isLoading, error }, dispatch] = useReducer(requestReducer, { isLoading: false, success: false });

  const handleButtonClick = async (event: SyntheticEvent) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isLoading || success) {
      return;
    }

    dispatch({ type: "request" });
    try {
      const response = await fetch("/api/send-verification-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress,
        }),
      });

      const result = await response.json();
      if (result?.ok) {
        dispatch({ type: "success" });
      } else {
        // API never returns specifics. It either got the request and has acted upon it (sent an email if we have that email address, otherwise no-op)
        throw Error();
      }
    } catch (e: unknown) {
      dispatch({
        type: "error",
        error: "There was an issue sending your verification link. Please try again later.",
      });
    }
  };

  return (
    <Alert variant="warning" className="pb-4 space-y-4 text-center">
      <H3>Your email address has not been verified</H3>
      <div>
        <p>You won&apos;t receive any alerts until you verify your email address.</p>
        <p>Please check your email inbox for a verification link.</p>
      </div>
      {error && (
        <Alert variant="error">
          <p>{error}</p>
        </Alert>
      )}
      {success ? (
        <p>
          <em>Sent a new verification link</em>
        </p>
      ) : (
        <Button onClick={handleButtonClick} disabled={isLoading || success}>
          {" "}
          {isLoading ? "Loading..." : "Resend verification link"}
        </Button>
      )}
    </Alert>
  );
};

export default VerificationWarning;
