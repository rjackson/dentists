import { Dialog } from "@headlessui/react";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { Alert, Anchor, Button, H2, Panel, UnorderedList } from "@rjackson/rjds";
import { AlertConfigurationRecord } from "lib/notifications/types/AlertConfigurationRecord";
import { Subscription } from "lib/notifications/types/Subscription";
import Link from "next/link";
import { SetStateAction, SyntheticEvent, useReducer } from "react";

type DeleteAlertPopupProps = {
  subscription: Subscription;
  alert: AlertConfigurationRecord;
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  onDeleted: () => void;
};

const DeleteAlertPopup = ({
  subscription,
  alert,
  isOpen,
  setIsOpen,
  onDeleted,
}: DeleteAlertPopupProps): JSX.Element => {
  const [{ success, isLoading, error }, dispatch] = useReducer(requestReducer, { isLoading: false, success: false });
  const { emailAddress, managementUuid, alerts: allAlerts } = subscription;
  const { uuid: alertUuid, locationName, radius, filters } = alert;

  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value === true)
    .map(([property]) => `${ACCEPTANCE_TYPES[property as keyof typeof ACCEPTANCE_TYPES]}`);

  const tableHeaderClassName = "font-semibold text-gray-600 dark:text-gray-300 text-left px-2 py-1";
  const tableCellClassName = "px-2 py-1";

  const handleButtonClick = async (event: SyntheticEvent) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isLoading || success) {
      return;
    }

    dispatch({ type: "request" });
    try {
      const response = await fetch("/api/delete-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress,
          managementUuid,
          alertUuid,
        }),
      });

      const result = await response.json();
      if (result?.ok) {
        dispatch({ type: "success" });
      } else {
        throw Error();
      }
    } catch (e: unknown) {
      dispatch({
        type: "error",
        error: "There was a problem deleting your alert. Please try again later.",
      });
    }
  };

  const closeDialog = () => {
    setIsOpen(false);

    if (success) {
      onDeleted();
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} className={`relative z-50`}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-lg">
          <Panel>
            <div className="space-y-4">
              <Dialog.Title as={H2}>Remove alert</Dialog.Title>
              {success ? (
                <>
                  <p>Your alert has been deleted.</p>
                  <div className="flex flex-row space-x-4">
                    <Button variant="primary" className="flex-1" onClick={closeDialog}>
                      Close
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p>Are you sure you want to remove this alert:</p>

                  <table>
                    <tbody>
                      <tr>
                        <th className={tableHeaderClassName}>Email address</th>
                        <td className={tableCellClassName}>{emailAddress}</td>
                      </tr>
                      <tr>
                        <th className={tableHeaderClassName}>Location</th>
                        <td className={tableCellClassName}>{locationName}</td>
                      </tr>
                      <tr>
                        <th className={tableHeaderClassName}>Radius</th>
                        <td className={tableCellClassName}>
                          {radius} <abbr title="kilometers">km</abbr>
                        </td>
                      </tr>
                      <tr>
                        <th className={tableHeaderClassName}>Filters</th>
                        <td className={tableCellClassName}>
                          {activeFilters.length === 0 ? (
                            <span>All dentists</span>
                          ) : (
                            <>
                              <p>Dentists that are accepting:</p>
                              <UnorderedList>
                                {activeFilters.map((label) => (
                                  <li key={label}>{label}</li>
                                ))}
                              </UnorderedList>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {allAlerts.length === 1 && allAlerts[0].uuid == alertUuid && (
                    <Alert variant="warning">
                      <p>
                        <strong>Your personal data will be removed from our systems.</strong>
                      </p>
                      <p>
                        As this is your only alert we&apos;ll have no reason to keep your personal data if you delete
                        it. We&apos;ll therefore immediately delete your data as well as the alert as per our{" "}
                        <Link href="/privacy" passHref>
                          <Anchor target="_blank">privacy notice</Anchor>
                        </Link>
                        .
                      </p>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="error">
                      <p>{error}</p>
                    </Alert>
                  )}
                  <div className="flex flex-row space-x-4">
                    <Button variant="primary" className="flex-1" onClick={handleButtonClick} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Remove alert"}
                    </Button>
                    <Button className="flex-1" onClick={closeDialog} disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Panel>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteAlertPopup;

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
