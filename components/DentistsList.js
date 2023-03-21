import { H2, Panel, Section } from "@rjackson/rjds";
import { useDentistsState } from "@contexts/Dentists";
import DentistInfo from "@components/DentistInfo";

const DentistsList = () => {
  const { dentists } = useDentistsState();

  return (
    <Section className="space-y-4 text-center">
      <H2>Dental Clinics ({dentists.length})</H2>

      {dentists.length === 0 ? (
        <p className="text-gray-700">We haven&apos;t found any dentists matching your search parameters.</p>
      ) : (
        <ul className="space-y-4">
          {dentists.map((dentist) => (
            <li key={dentist.ODSCode}>
              <DentistInfo as={Panel} dentist={dentist} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default DentistsList;
