import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { DescriptionList, DescriptionListItem, H2, Panel, Section } from "@rjackson/rjds";
import { useDentistsState, useDentistsUpdate } from "contexts/Dentists";
import { useEffect, useMemo, useRef, useState } from "react";
import GeonamesAutosuggest from "./GeonamesAutosuggest";
import Input from "./Input";

const SearchFilters = () => {
  const { searchLocation, searchRadius: upstreamSearchRadius } = useDentistsState();
  const { setSearchLocation, setFilters, setSearchRadius: setUpstreamSearchRadius } = useDentistsUpdate();
  const [searchRadius, setSearchRadius] = useState(upstreamSearchRadius);

  const [acceptanceStates, setAcceptanceStates] = useState(
    Object.fromEntries(Object.entries(ACCEPTANCE_TYPES).map(([property, _value]) => [property, false]))
  );

  const toggleAcceptanceState = (property) =>
    setAcceptanceStates({
      ...acceptanceStates,
      [property]: !acceptanceStates[property],
    });

  const acceptanceFilters = useMemo(() => {
    return Object.entries(acceptanceStates)
      .filter(([, active]) => active)
      .map(
        ([property]) =>
          ({ AcceptingPatients }) =>
            AcceptingPatients[property] == true
      );
  }, [acceptanceStates]);

  // Sync search params with dentist provider after a short debounce (prevent expensive renders elsewhere, if user is
  //  actively setting filters or changing controlled inputs)
  const changeTimeout = useRef(null);
  useEffect(() => {
    let mounted = true;

    clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => {
      if (mounted) {
        setFilters(acceptanceFilters);
        setUpstreamSearchRadius(searchRadius);
      }
    }, 300);

    return () => {
      mounted = false;
    };
  }, [acceptanceFilters, setFilters, searchRadius, setUpstreamSearchRadius]);

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
          <DescriptionListItem className="space-y-1" title={<label htmlFor="search-radius">Search radius</label>}>
            <Input
              type="number"
              step={5}
              min={5}
              max={200}
              value={searchRadius}
              onChange={(e) => setSearchRadius(e.target.value)}
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
