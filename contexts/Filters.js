import { createContext, useContext, useMemo, useReducer, useState } from "react";
import { useDentistsState } from "./Dentists";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";

const FiltersStateContext = createContext();
const FiltersUpdateContext = createContext();

export function FiltersProvider({ children }) {
  const { allDentists } = useDentistsState();

  // Managed inputs for filters
  const [updatedInLast, setUpdatedInLast] = useReducer((_, value) => parseInt(value), 0);
  const [acceptanceStates, setAcceptanceStates] = useState(
    Object.fromEntries(Object.entries(ACCEPTANCE_TYPES).map(([property]) => [property, false]))
  );
  const toggleAcceptanceState = (property) =>
    setAcceptanceStates({
      ...acceptanceStates,
      [property]: !acceptanceStates[property],
    });

  // Individual Filter functions
  const acceptanceFilters = useMemo(() => {
    return Object.entries(acceptanceStates)
      .filter(([, active]) => active)
      .map(([property]) => property)
      .map(
        (property) =>
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

  // Filter functions, to apply to dentists list
  const filters = [...acceptanceFilters, updatedFilter];

  const filteredDentists = allDentists.filter((dentist) =>
    filters.length > 0 ? filters.every((filter) => filter(dentist)) : true
  );

  const state = {
    updatedInLast,
    acceptanceStates,
    filteredDentists,
  };

  const updateFns = {
    setUpdatedInLast,
    setAcceptanceStates,
    toggleAcceptanceState,
  };

  return (
    <FiltersStateContext.Provider value={state}>
      <FiltersUpdateContext.Provider value={updateFns}>{children}</FiltersUpdateContext.Provider>
    </FiltersStateContext.Provider>
  );
}

export function useFiltersState() {
  const state = useContext(FiltersStateContext);
  if (state === undefined) {
    throw new Error("useFiltersState must be used within a FiltersProvider");
  }
  return state;
}

export function useFiltersUpdate() {
  const updateFns = useContext(FiltersUpdateContext);
  if (updateFns === undefined) {
    throw new Error("useFiltersUpdate must be used within a FiltersProvider");
  }
  return updateFns;
}
