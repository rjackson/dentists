import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";

const TableRow = ({ title, accepting }) => (
  <tr className={`${accepting ? "bg-green-200 dark:bg-emerald-700 font-bold" : ""}`}>
    <td className="px-2">{title}</td>
    <td className="px-2">{accepting ? "Yes" : "No"}</td>
  </tr>
);

const DentistAcceptingPatientsTable = ({ className = "", acceptingPatients }) => {
  return (
    <table className={`w-full ${className}`}>
      <tbody>
        {Object.entries(ACCEPTANCE_TYPES).map(([property, label]) => (
          <TableRow key={property} title={label} accepting={acceptingPatients[property]} />
        ))}
      </tbody>
    </table>
  );
};

export default DentistAcceptingPatientsTable;
