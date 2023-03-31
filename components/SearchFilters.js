import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import { DescriptionList, DescriptionListItem, H2, Panel, Section, Input, Select, Button } from "@rjackson/rjds";
import { useState } from "react";
import GeonamesAutosuggest from "@components/GeonamesAutosuggest";
import { useDentistsState, useDentistsUpdate } from "@contexts/Dentists";
import Checkbox from "./Checkbox";
import CheckboxLabel from "./CheckboxLabel";
import { useFiltersState, useFiltersUpdate } from "@contexts/Filters";

const SearchFilters = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { searchLocation, searchRadius } = useDentistsState();
  const { setSearchLocation, setSearchRadius } = useDentistsUpdate();
  const { updatedInLast, acceptanceStates } = useFiltersState();
  const { setUpdatedInLast, toggleAcceptanceState } = useFiltersUpdate();

  const activeAcceptanceStates = Object.entries(acceptanceStates)
    .filter(([, value]) => !!value)
    .map(([property]) => ACCEPTANCE_TYPES[property]);

  return (
    <Section className="space-y-4">
      <Panel className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <H2>Search parameters</H2>
          <Button onClick={() => setCollapsed((v) => !v)}>{collapsed ? "Expand" : "Collapse"}</Button>
        </div>
        {collapsed ? (
          <p>
            {activeAcceptanceStates.length > 0 ? "Dentists" : "All dentists"} within {searchRadius}{" "}
            <abbr title="kilometers">km</abbr> of {searchLocation.name}{" "}
            {activeAcceptanceStates.length > 0 && `accepting certain types of patients`}
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
              <Select value={updatedInLast} onChange={(e) => setUpdatedInLast(e.target.value)}>
                <option value="0">Any time</option>
                <option value="90">90 days</option>
                <option value="30">30 days</option>
                <option value="7">7 days</option>
              </Select>
            </DescriptionListItem>
          </DescriptionList>
        )}
      </Panel>
    </Section>
  );
};

export default SearchFilters;
