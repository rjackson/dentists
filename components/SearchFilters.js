import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { DescriptionList, DescriptionListItem, H2, Panel, Section } from "@rjackson/rjds";
import { useDentistsState, useDentistsUpdate } from "contexts/Dentists";
import { useEffect, useRef, useState } from "react";
import GeonamesAutosuggest from "./GeonamesAutosuggest";

const SearchFilters = () => {
  const { searchLocation } = useDentistsState();
  const { setSearchLocation, setFilters } = useDentistsUpdate();

  const [acceptanceStates, setAcceptanceStates] = useState(
    Object.fromEntries(Object.entries(ACCEPTANCE_TYPES).map(([property, _value]) => [property, false]))
  );

  const toggleAcceptanceState = (property) =>
    setAcceptanceStates({
      ...acceptanceStates,
      [property]: !acceptanceStates[property],
    });

  const acceptanceFilters = Object.entries(acceptanceStates)
    .filter(([, active]) => active)
    .map(
      ([property]) =>
        ({ AcceptingPatients }) =>
          AcceptingPatients[property] == true
    );

  // Apply filters 1s after any changes have been applied
  // TODO: Add visual indicator that changes are pending / loading
  const changeTimeout = useRef(null);
  useEffect(() => {
    let mounted = true;

    clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => {
      if (mounted) {
        setFilters(acceptanceFilters);
      }
    }, 1000);

    return () => {
      mounted = false;
    };
  }, [acceptanceFilters, setFilters]);

  return (
    <Section className="space-y-4">
      <Panel>
        <H2>Search parameters</H2>
        <DescriptionList>
          <DescriptionListItem className="space-y-1" title={<label htmlFor="search-location">Location</label>}>
            <GeonamesAutosuggest
              value={searchLocation}
              onChange={setSearchLocation}
              inputProps={{ id: "search-location" }}
            />
          </DescriptionListItem>
          <DescriptionListItem className="space-y-1" title="Only show dentists that are">
            {Object.entries(ACCEPTANCE_TYPES).map(([property, label]) => (
              <label key={property} htmlFor={property} className="block space-x-2">
                <input
                  type="checkbox"
                  id={property}
                  value={property}
                  checked={acceptanceStates[property]}
                  onChange={() => toggleAcceptanceState(property)}
                />
                <span>{label}</span>
              </label>
            ))}
          </DescriptionListItem>
        </DescriptionList>
      </Panel>
    </Section>
  );
};

export default SearchFilters;
