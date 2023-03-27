import { Subscription } from "lib/notifications/types";
import AlertsTableRow from "./AlertsTableRow";

type AlertsTableProps = {
  subscription: Subscription;
};
const AlertsTable = ({ subscription }: AlertsTableProps): JSX.Element => {
  const { alerts } = subscription;

  const tableHeaderClassName = "font-semibold text-gray-600 dark:text-gray-300 text-left px-2 py-1";

  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className={tableHeaderClassName}>Location</th>
          <th className={tableHeaderClassName}>Radius</th>
          <th className={tableHeaderClassName}>Filters</th>
          <th className={tableHeaderClassName}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert) => (
          <AlertsTableRow subscription={subscription} alert={alert} key={alert.createdAt} />
        ))}
      </tbody>
    </table>
  );
};

export default AlertsTable;
