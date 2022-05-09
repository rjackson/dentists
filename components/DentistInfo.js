import { Anchor } from "@rjackson/rjds";
import Link from "next/link";
import DentistAcceptingPatientsTable from "./DentistAcceptingPatientsTable";

const DentistInfo = ({
  as: Component = "div",
  className,
  dentist: { ODSCode, OrganisationName, AcceptingPatients },
  ...props
}) => {
  return (
    <Component className={`space-y-4 text-center ${className}`} {...props}>
      <Link href={`https://www.nhs.uk/services/dentist/blah/${ODSCode}`} passHref>
        <Anchor target="_blank" className="">
          <h3 className="text-lg font-semibold text-center">{OrganisationName}</h3>
        </Anchor>
      </Link>
      <DentistAcceptingPatientsTable className="text-left" acceptingPatients={AcceptingPatients} />
      <Link href={`https://www.nhs.uk/services/dentist/blah/${ODSCode}`} passHref>
        <Anchor target="_blank">
          See more details <span className="sr-only">about {OrganisationName}</span> on www.nhs.uk
        </Anchor>
      </Link>
    </Component>
  );
};

export default DentistInfo;
