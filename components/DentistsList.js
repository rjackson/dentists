import { H2, Panel, Section } from "@rjackson/rjds";
import { useDentistsState } from "contexts/Dentists";
import DentistInfo from "./DentistInfo";

const DentistsList = () => {
  const { dentists } = useDentistsState();

  return (
    <Section className="space-y-4">
      <H2>List of dental practises ({dentists.length})</H2>
      <ul className="space-y-4">
        {dentists.map((dentist) => (
          <Panel key={dentist.ODSCode}>
            <DentistInfo as="li" dentist={dentist} />
          </Panel>
        ))}
      </ul>
    </Section>
  );
};

export default DentistsList;
