import { createContext, useContext, useState } from "react";
import { useDentistsState } from "./Dentists";

const FiltersStateContext = createContext();
const FiltersUpdateContext = createContext();

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState([]);

  const { allDentists } = useDentistsState();

  const filteredDentists = allDentists.filter((dentist) =>
    filters.length > 0 ? filters.every((filter) => filter(dentist)) : true
  );

  const state = {
    filteredDentists,
  };

  const updateFns = {
    setFilters,
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
