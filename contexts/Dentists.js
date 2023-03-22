import { loadDentists, loadManifest } from "lib/dentists/client";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const DentistsStateContext = createContext();
const DentistsUpdateContext = createContext();

export function DentistsProvider({ initialDentists, initialLocation, initialRadius, children }) {
  const [searchLocation, setSearchLocation] = useState(initialLocation);
  const [searchRadius, setSearchRadius] = useState(initialRadius);
  const [resolutions, setResolutions] = useState({});
  const [allDentists, setAllDentists] = useState(initialDentists);

  // Refetch dentists on change
  const { lat: searchLat, lng: searchLng } = searchLocation;
  const isFirstRun = useRef(true);
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      // First run will be seeded by server. Skip it
      if (isFirstRun.current) {
        isFirstRun.current = false;
      } else {
        loadDentists(searchLat, searchLng, searchRadius).then((dentists) => setAllDentists(dentists));
        loadManifest().then(({ resolutions }) => setResolutions(resolutions));
      }
    }

    return () => {
      mounted = false;
    };
  }, [searchLat, searchLng, searchRadius]);

  const state = { searchLocation, searchRadius, allDentists, resolutions };

  const updateFns = { setSearchLocation, setSearchRadius };

  return (
    <DentistsStateContext.Provider value={state}>
      <DentistsUpdateContext.Provider value={updateFns}>{children}</DentistsUpdateContext.Provider>
    </DentistsStateContext.Provider>
  );
}

export function useDentistsState() {
  const state = useContext(DentistsStateContext);
  if (state === undefined) {
    throw new Error("useDentistsState must be used within a DentistsProvider");
  }
  return state;
}

export function useDentistsUpdate() {
  const updateFns = useContext(DentistsUpdateContext);
  if (updateFns === undefined) {
    throw new Error("useDentistsUpdate must be used within a DentistsProvider");
  }
  return updateFns;
}
