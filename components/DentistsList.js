import { H2, Panel, Section } from "@rjackson/rjds";
import { useDentistsState } from "@contexts/Dentists";
import DentistInfo from "@components/DentistInfo";

const DentistsList = () => {
  const { dentists } = useDentistsState();
  return (
    <Section className="space-y-4">
      <H2>Dental Clinics ({dentists.length})</H2>
      <ul className="space-y-4">
        {dentists.map((dentist) => (
          <li key={dentist.ODSCode}>
            <DentistInfo as={Panel} dentist={dentist} />
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default DentistsList;
