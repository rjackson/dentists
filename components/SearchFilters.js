import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { DescriptionList, DescriptionListItem, H2, Panel, Section, Input, inputClasses } from "@rjackson/rjds";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import GeonamesAutosuggest from "@components/GeonamesAutosuggest";
import { useDentistsState, useDentistsUpdate } from "@contexts/Dentists";
import Checkbox from "./Checkbox";
import CheckboxLabel from "./CheckboxLabel";
import SecondaryButton from "./SecondaryButton";
import { useFiltersUpdate } from "@contexts/Filters";

const SearchFilters = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { searchLocation, searchRadius: upstreamSearchRadius } = useDentistsState();
  const { setSearchLocation, setSearchRadius: setUpstreamSearchRadius } = useDentistsUpdate();

  const { setFilters } = useFiltersUpdate();

  const [searchRadius, setSearchRadius] = useState(upstreamSearchRadius);
  const [updatedInLast, setUpdatedInLast] = useReducer((_, value) => parseInt(value), 0);

  const [acceptanceStates, setAcceptanceStates] = useState(
    Object.fromEntries(Object.entries(ACCEPTANCE_TYPES).map(([property]) => [property, false]))
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

  const updatedFilter = useMemo(
    () =>
      ({ DentistsAcceptingPatientsLastUpdatedDate }) => {
        if (!updatedInLast) {
          return true;
        }

        const lastUpdatedDate = new Date(DentistsAcceptingPatientsLastUpdatedDate);
        const diffTime = new Date() - lastUpdatedDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= updatedInLast;
      },
    [updatedInLast]
  );

  // Sync search params with dentist provider after a short debounce (prevent expensive renders elsewhere, if user is
  //  actively setting filters or changing controlled inputs)
  const changeTimeout = useRef(null);
  useEffect(() => {
    let mounted = true;

    clearTimeout(changeTimeout.current);
    changeTimeout.current = setTimeout(() => {
      if (mounted) {
        setFilters([...acceptanceFilters, updatedFilter]);
        setUpstreamSearchRadius(searchRadius);
      }
    }, 300);

    return () => {
      mounted = false;
    };
  }, [acceptanceFilters, updatedFilter, setFilters, searchRadius, setUpstreamSearchRadius]);

  return (
    <Section className="space-y-4">
      <Panel className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <H2>Search parameters</H2>
          <SecondaryButton onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Expand" : "Collapse"}</SecondaryButton>
        </div>
        {collapsed ? (
          <p>
            {acceptanceFilters.length === 0 ? "All dentists" : "Dentists"} within {searchRadius}{" "}
            <abbr title="kilometers">km</abbr> of {searchLocation.name}{" "}
            {acceptanceFilters.length > 0 && `accepting certain types of patients`}
          </p>
        ) : (
          <DescriptionList>
            <DescriptionListItem className="space-y-1" title={<label htmlFor="search-location">Location</label>}>
              <GeonamesAutosuggest
                value={searchLocation}
                onChange={setSearchLocation}
                inputProps={{ id: "search-location" }}
              />
            </DescriptionListItem>
            <DescriptionListItem
              className="space-y-1"
              title={
                <label htmlFor="search-radius">
                  Search radius (<abbr title="kilometers">km</abbr>)
                </label>
              }
            >
              <Input
                type="number"
                step={5}
                min={5}
                max={200}
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
              />
            </DescriptionListItem>
            <DescriptionListItem className="space-y-1" title="Patients being accepted">
              <div className="space-y-1">
                {Object.entries(ACCEPTANCE_TYPES).map(([property, label]) => (
                  <CheckboxLabel key={property} htmlFor={property} label={label}>
                    <Checkbox
                      id={property}
                      value={property}
                      checked={acceptanceStates[property]}
                      onChange={() => toggleAcceptanceState(property)}
                    />
                  </CheckboxLabel>
                ))}
              </div>
            </DescriptionListItem>
            <DescriptionListItem
              className="space-y-1"
              title={<label htmlFor="updated-since">Information updated within the past</label>}
            >
              <Input
                as="select"
                className={inputClasses}
                value={updatedInLast}
                onChange={(e) => setUpdatedInLast(e.target.value)}
              >
                <option value="0">Any time</option>
                <option value="90">90 days</option>
                <option value="30">30 days</option>
                <option value="7">7 days</option>
              </Input>
            </DescriptionListItem>
          </DescriptionList>
        )}
      </Panel>
    </Section>
  );
};

export default SearchFilters;
