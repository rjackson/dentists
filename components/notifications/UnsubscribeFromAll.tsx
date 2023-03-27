import PrimaryButton from "@components/PrimaryButton";
import SecondaryButton from "@components/SecondaryButton";
import { Dialog } from "@headlessui/react";
import { Anchor, H2, H3, Panel, Section } from "@rjackson/rjds";
import { Subscription } from "lib/notifications/types";
import Link from "next/link";
import { SyntheticEvent, useReducer, useState } from "react";

const UnsubscribeFromAll = ({ subscription }: { subscription: Subscription }): JSX.Element => {
  const [{ success, isLoading, error }, dispatch] = useReducer(requestReducer, { isLoading: false, success: false });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { emailAddress, managementUuid } = subscription;

  const handleConfirmUnsubscribeClick = async (event: SyntheticEvent) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isLoading || success) {
      return;
    }

    dispatch({ type: "request" });
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress,
          managementUuid,
        }),
      });

      const result = await response.json();
      if (result?.ok) {
        dispatch({ type: "success" });
        setIsDialogOpen(false);
      } else {
        throw Error();
      }
    } catch (e: unknown) {
      dispatch({
        type: "error",
        error: "There was a problem unsubscribing you. Please try again later.",
      });
    }
  };

  return (
    <Section>
      <Panel>
        <div className="space-y-4 text-center">
          <H3>Unsubscribe from all alerts</H3>

          {success ? (
            <div className="bg-green-100 text-green-900 rounded-md px-4 py-2">
              <p>You have been unsubscribed and your data has been deleted from our systems.</p>
            </div>
          ) : (
            <>
              <p>
                You may unsubscribe from all of your alerts. This will also delete your personal data from our systems,
                as per our{" "}
                <Link href="/privacy" passHref>
                  <Anchor target="_blank">privacy notice</Anchor>
                </Link>
                .
              </p>

              <div className="flex flex-col items-center">
                <SecondaryButton onClick={() => setIsDialogOpen(true)}>
                  Unsubscribe &amp; delete my data
                </SecondaryButton>
              </div>
            </>
          )}
        </div>
      </Panel>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className={`relative z-50`}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg">
            <Panel>
              <div className="space-y-4">
                <Dialog.Title as={H2}>Unsubscribe & delete my data</Dialog.Title>
                <p>Are you sure you want to unsubscribe?</p>

                <div className="bg-yellow-100 text-yellow-900 rounded-md px-4 py-2">
                  <p>
                    <strong>Your personal data will be removed from our systems.</strong>
                  </p>
                  <p>
                    By unsubscribing we&apos;ll have no reason to keep your personal data any longer. We&apos;ll
                    therefore immediately delete your data as per our{" "}
                    <Link href="/privacy" passHref>
                      <Anchor target="_blank">privacy notice</Anchor>
                    </Link>
                    .
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 text-red-900 rounded-md px-4 py-2">
                    <p>{error}</p>
                  </div>
                )}
                <div className="flex flex-row space-x-4">
                  <PrimaryButton className="w-2/3" onClick={handleConfirmUnsubscribeClick} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Unsubscribe & delete my data"}
                  </PrimaryButton>
                  <SecondaryButton className="w-1/3" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </SecondaryButton>
                </div>
              </div>
            </Panel>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Section>
  );
};

export default UnsubscribeFromAll;

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
