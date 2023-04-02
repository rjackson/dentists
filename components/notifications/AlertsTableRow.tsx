import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { useState } from "react";
import DeleteAlertPopup from "./DeleteAlertPopup";
import { Subscription } from "lib/notifications/types/Subscription";
import { AlertConfigurationRecord } from "lib/notifications/types/AlertConfigurationRecord";
import { Button, UnorderedList } from "@rjackson/rjds";

type AlertsTableRowProps = {
  subscription: Subscription;
  alert: AlertConfigurationRecord;
};

const AlertsTableRow = ({ subscription, alert, ...props }: AlertsTableRowProps): JSX.Element => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const tableCellClassName = "px-2 py-1";
  const { locationName, radius, filters } = alert;

  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value === true)
    .map(([property]) => `${ACCEPTANCE_TYPES[property as keyof typeof ACCEPTANCE_TYPES]}`);

  return (
    <tr {...props} className={isDeleted ? "line-through bg-red-50 text-red-900" : ""}>
      <th className={`${tableCellClassName} text-left font-semibold text-gray-600 dark:text-gray-300`}>
        {locationName}
      </th>
      <td className={tableCellClassName}>
        {radius} <abbr title="kilometers">km</abbr>
      </td>
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
      <td className={tableCellClassName}>
        {isDeleted ? (
          <p>Deleted</p>
        ) : (
          <>
            <Button onClick={() => setIsDeleteDialogOpen(true)}>Remove alert</Button>
            <DeleteAlertPopup
              subscription={subscription}
              alert={alert}
              isOpen={isDeleteDialogOpen}
              setIsOpen={setIsDeleteDialogOpen}
              onDeleted={() => setIsDeleted(true)}
            />
          </>
        )}
      </td>
    </tr>
  );
};

export default AlertsTableRow;
