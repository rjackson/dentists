const TableRow = ({ title, accepting }) => (
  <tr className={`${accepting ? "bg-green-200 font-bold" : ""}`}>
    <td className="px-2">{title}</td>
    <td className="px-2">{accepting ? "Yes" : "No"}</td>
  </tr>
);

const DentistAcceptingPatientsTable = ({
  className = "",
  acceptingPatients: {
    AcceptingAdults,
    AcceptingAdultsEntitled,
    AcceptingChildren,
    AcceptingUrgent,
    AcceptingReferrals,
  },
}) => {
  return (
    <table className={`w-full ${className}`}>
      <tbody>
        <TableRow title="Adults (18 and over)" accepting={AcceptingAdults} />
        <TableRow title="Adults entitled to free dental care" accepting={AcceptingAdultsEntitled} />
        <TableRow title="Children (up to the age of 18)" accepting={AcceptingChildren} />
        <TableRow title="Urgent care appointments offered" accepting={AcceptingUrgent} />
        <TableRow title="Only by referral from a dental practitioner" accepting={AcceptingReferrals} />
      </tbody>
    </table>
  );
};

export default DentistAcceptingPatientsTable;
