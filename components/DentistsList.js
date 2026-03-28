import { H2, Panel, Section } from "@rjackson/rjds";
import DentistInfo from "@components/DentistInfo";
import { useFiltersState } from "@contexts/Filters";
import { Virtuoso } from "react-virtuoso";

const DentistsList = () => {
  const { filteredDentists: dentists } = useFiltersState();

  return (
    <Section className="space-y-4 text-center flex-1 flex flex-col min-h-0">
      <H2>Dental Clinics ({dentists.length})</H2>

      {dentists.length === 0 ? (
        <p className="text-gray-700">We haven&apos;t found any dentists matching your search parameters.</p>
      ) : (
        <Virtuoso
          data={dentists}
          itemContent={(_index, dentist) => (
            <div className="pb-4">
              <DentistInfo as={Panel} dentist={dentist} />
            </div>
          )}
        />
      )}
    </Section>
  );
};

export default DentistsList;
