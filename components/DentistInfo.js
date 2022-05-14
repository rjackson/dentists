import { Anchor, H3 } from "@rjackson/rjds";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DentistAcceptingPatientsTable from "@components/DentistAcceptingPatientsTable";

const DentistInfo = ({
  as: Component = "div",
  className,
  dentist: { ODSCode, OrganisationName, AcceptingPatients, DentistsAcceptingPatientsLastUpdatedDate },
  ...props
}) => {
  const [lastUpdatedTimeLabel, setLastUpdatedTimeLabel] = useState(DentistsAcceptingPatientsLastUpdatedDate);
  const lastUpdatedDate = useMemo(
    () => new Date(DentistsAcceptingPatientsLastUpdatedDate),
    [DentistsAcceptingPatientsLastUpdatedDate]
  );

  useEffect(() => {
    const diffTime = lastUpdatedDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const rtf1 = new Intl.RelativeTimeFormat("en", { style: "narrow" });
    const relativeTimeLabel = rtf1.format(diffDays, "days");

    setLastUpdatedTimeLabel(relativeTimeLabel);
  }, [lastUpdatedDate, setLastUpdatedTimeLabel]);

  return (
    <Component className={`space-y-4 text-center ${className}`} {...props}>
      <Link href={`https://www.nhs.uk/services/dentist/blah/${ODSCode}`} passHref>
        <Anchor target="_blank">
          <H3 className="!text-inherit">{OrganisationName}</H3>
        </Anchor>
      </Link>
      <DentistAcceptingPatientsTable className="text-left" acceptingPatients={AcceptingPatients} />
      <p className="text-sm before:content-['('] after:content-[')']">
        Acceptance information updated <time dateTime={lastUpdatedDate.toISOString()}>{lastUpdatedTimeLabel}</time>
      </p>
      <Link href={`https://www.nhs.uk/services/dentist/blah/${ODSCode}`} passHref>
        <Anchor target="_blank" aria-label={`See more details about ${OrganisationName} on www.nhs.uk`}>
          See more details on www.nhs.uk
        </Anchor>
      </Link>
    </Component>
  );
};

export default DentistInfo;
