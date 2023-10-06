import { useQueryState, queryTypes } from "next-usequerystate";

import { loadDentists, loadManifest } from "lib/dentists/client";
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

const DentistsStateContext = createContext();
const DentistsUpdateContext = createContext();

export function DentistsProvider({ initialLocation, initialRadius, children }) {
  const [name, setName] = useQueryState("name", queryTypes.string.withDefault(initialLocation.name));
  const [lat, setLat] = useQueryState("lat", queryTypes.float.withDefault(initialLocation.lat));
  const [lng, setLng] = useQueryState("lng", queryTypes.float.withDefault(initialLocation.lng));

  // const [searchLocation, setSearchLocation] = useQueryState("location", queryTypes.json().withDefault(initialLocation));
  const [searchRadius, setSearchRadius] = useQueryState("radius", { defaultValue: initialRadius });
  const [resolutions, setResolutions] = useState({});
  const [allDentists, setAllDentists] = useState([]);

  // bit silly but useQueryState as json seems fiddly a.f. actually it isn't now I've figured it out, but incoming
  // location obj has too much data in it so this will do for now.
  const searchLocation = {
    name,
    lat,
    lng,
  };

  const setSearchLocation = useCallback(
    async ({ name, lat, lng }) => {
      await setName(name);
      await setLat(lat);
      await setLng(lng);
    },
    [setName, setLat, setLng]
  );

  // Refetch dentists on change
  const { lat: searchLat, lng: searchLng } = searchLocation;
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      // First run will be seeded by server. Skip it
      loadDentists(searchLat, searchLng, searchRadius).then((dentists) => setAllDentists(dentists));
      loadManifest().then(({ resolutions }) => setResolutions(resolutions));
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
