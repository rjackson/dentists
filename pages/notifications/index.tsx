import Footer from "@components/Footer";
import Header from "@components/Header";
import { Alert, Button, H2, Input, Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
import { SyntheticEvent, useReducer } from "react";

type LookupState = {
  success: boolean;
  isLoading: boolean;
  error?: string;
};

type LookupAction = { type: "reset" } | { type: "request" } | { type: "success" } | { type: "error"; error: string };

const lookupReducer = (state: LookupState, action: LookupAction) => {
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

const NotificationsManagerLookup = () => {
  const [{ success, isLoading, error }, dispatch] = useReducer(lookupReducer, { isLoading: false, success: false });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isLoading || success) {
      return;
    }

    const target = event.target as typeof event.target & {
      action: string;
      emailAddress: { value: string };
    };

    dispatch({ type: "request" });
    try {
      const response = await fetch(target.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: target.emailAddress.value,
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
        error: "There was an issue looking up your e-mail address. Please try again later.",
      });
    }
  };

  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main">
        <div className="space-y-4">
          <H2>Manage your alerts</H2>
          <Panel>
            <div className="space-y-4">
              <p>
                To manage your notifications you&apos;ll need to click your unique link from one of the emails
                we&apos;ve sent you.
              </p>

              <p>We can send the link through to you again with the following form:</p>

              <hr />

              {success ? (
                <Alert variant="success">
                  <p className="font-semibold">New link sent</p>
                  <p>
                    If we have any notifications set up under your email address, you&apos;ll receive an email shortly
                    with a new manage notifications link
                  </p>
                </Alert>
              ) : (
                <form action="/api/send-manage-link" method="post" className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="error">
                      <p>{error}</p>
                    </Alert>
                  )}

                  {/* TODO: Replace with DescriptionList when @rjackson/rjds types are not dumb */}
                  <dl className="w-full">
                    <div className="space-y-1">
                      <dt className="font-semibold">
                        <label htmlFor="notification-email-address">Email address</label>
                      </dt>
                      <dd>
                        <Input id="notification-email-address" name="emailAddress" type="email" required />
                      </dd>
                    </div>
                  </dl>

                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Send a new manage notifications link"}
                  </Button>
                </form>
              )}
            </div>
          </Panel>
        </div>
      </Section>
    </SingleColumnLayout>
  );
};

export default NotificationsManagerLookup;
