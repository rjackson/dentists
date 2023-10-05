import { Dialog } from "@headlessui/react";
import { Anchor, Button, DescriptionList, DescriptionListItem, H2, Input, Panel, Section } from "@rjackson/rjds";
import { useState } from "react";
import { useDentistsState } from "@contexts/Dentists";
import Link from "next/link";
import { useFiltersState } from "@contexts/Filters";

const STAGE_INIT = null;
const STAGE_CREATE = "stage_create";
const STAGE_SAVED = "stage_saved";
const STAGE_COMPLETE = "stage_complete";

const NotificationsCta = () => {
  const { searchLocation, searchRadius } = useDentistsState();
  const { acceptanceStates } = useFiltersState();

  // TODO: useReducer states, or xstate?
  const [stage, setStage] = useState(STAGE_INIT);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const activeAcceptanceStates = Object.entries(acceptanceStates)
    .filter(([, value]) => !!value)
    .map(([property]) => property);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(event.target.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailAddress: event.target.emailAddress.value,
        locationName: searchLocation.name,
        lat: parseFloat(searchLocation.lat),
        lng: parseFloat(searchLocation.lng),
        radius: parseInt(searchRadius),
        filters: acceptanceStates,
      }),
    });

    const result = await response.json();
    if (result?.ok) {
      setStage(STAGE_SAVED);
      setVerificationRequired(result.verificationRequired);
    }

    // TODO: handle errors?
  };

  return (
    <Section className="text-center">
      <H2 className="sr-only">Notifications</H2>

      <div className="space-y-4">
        <Button className="w-full" onClick={() => setStage(STAGE_CREATE)}>
          {stage === STAGE_COMPLETE ? "Alert saved. Set up another?" : "Set up an email alert for this search"}
        </Button>
      </div>

      <Dialog
        open={stage === STAGE_CREATE}
        onClose={() => setStage(STAGE_INIT)}
        // leafletjs's highest map pane, popupPane, lives at zIndex 700
        className={`relative z-[800]`}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <form
          action="/api/create-alert"
          method="post"
          className="fixed inset-0 flex items-center justify-center p-4"
          onSubmit={handleSubmit}
        >
          <Dialog.Panel className="max-w-lg">
            <Panel className="space-y-4">
              <Dialog.Title as={H2}>Set up an email alert for this search</Dialog.Title>

              <p>Our information on what patients dentists are accepting updates every day.</p>

              <p>
                We can let you know when any more dentists match your search:{" "}
                <em>
                  {activeAcceptanceStates.length === 0
                    ? "All dentists"
                    : `${activeAcceptanceStates.length} types of patient`}{" "}
                  within {searchRadius} <abbr title="kilometers">km</abbr> of {searchLocation.name}
                </em>
              </p>

              <DescriptionList>
                <DescriptionListItem
                  className="space-y-1"
                  title={<label htmlFor="notification-email-address">Email address</label>}
                >
                  <Input id="notification-email-address" name="emailAddress" type="email" required />
                </DescriptionListItem>
              </DescriptionList>

              <div className="flex flex-row space-x-4">
                <Button variant="primary" className="flex-1" type="submit">
                  Set up alert
                </Button>
                <Button className="flex-1" onClick={() => setStage(STAGE_INIT)}>
                  Cancel
                </Button>
              </div>

              <p>
                The above information will be saved for the purposes of sending you alerts. See our{" "}
                <Link href="/privacy" passHref>
                  <Anchor target="_blank">privacy notice</Anchor>
                </Link>{" "}
                for full details.
              </p>
            </Panel>
          </Dialog.Panel>
        </form>
      </Dialog>

      <Dialog
        open={stage === STAGE_SAVED}
        onClose={() => setStage(STAGE_COMPLETE)}
        // leafletjs's highest map pane, popupPane, lives at zIndex 700
        className={`relative z-[800]`}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg">
            <Panel className="space-y-4">
              <Dialog.Title as={H2}>Your alert has been set up</Dialog.Title>

              {verificationRequired ? (
                <p>We&apos;ve sent you an email to verify you&apos;re happy to receive alerts from us.</p>
              ) : (
                <p>We&apos;ll let you know the moment any more dentists match your search.</p>
              )}

              <p>
                You can manage your alerts or unsubscribe at any time on our
                <Link href="/notifications" passHref>
                  <Anchor target="_blank">manage notifications</Anchor>
                </Link>{" "}
                page.
              </p>

              <div className="flex flex-row space-x-4">
                <Button variant="primary" className="flex-1" onClick={() => setStage(STAGE_COMPLETE)}>
                  OK
                </Button>
              </div>
            </Panel>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Section>
  );
};

export default NotificationsCta;
