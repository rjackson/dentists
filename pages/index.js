import Footer from "@components/Footer";
import Header from "@components/Header";
import { Anchor, DescriptionList, DescriptionListItem, H2, Panel, Section } from "@rjackson/rjds";
import { ACCEPTANCE_TYPES } from "@helpers/DentalAcceptance";
import dynamic from "next/dynamic";
import Link from "next/link";

import DentistInfo from "@components/DentistInfo";
import GeonamesAutosuggest from "@components/GeonamesAutosuggest";
import { useEffect, useReducer, useRef, useState } from "react";
import { loadDentists as loadDentistsServer } from "lib/dentists/server";
import { loadDentists as loadDentistsClient } from "lib/dentists/client";

const Map = dynamic(() => import("@components/Map"), { ssr: false });

export default function Home({ initialDentists, defaultLocation, defaultRadius }) {
  // TODO: One day we will apply this as a filter too
  const [searchLocation, setSearchLocation] = useState(defaultLocation);
  const [searchRadius, setSearchRadius] = useState(defaultRadius);
  const [dentists, setDentists] = useState(initialDentists);

  const [acceptanceStates, setAcceptanceStates] = useState(
    Object.fromEntries(Object.entries(ACCEPTANCE_TYPES).map(([property, _value]) => [property, false]))
  );

  const activeAcceptanceFilters = Object.entries(acceptanceStates)
    .filter(([, active]) => active)
    .map(([property]) => property);

  const toggleAcceptanceState = (property) =>
    setAcceptanceStates({
      ...acceptanceStates,
      [property]: !acceptanceStates[property],
    });

  const filteredDentists =
    activeAcceptanceFilters.length == 0
      ? dentists
      : dentists.filter(({ AcceptingPatients }) => {
          return activeAcceptanceFilters.map((property) => AcceptingPatients[property]).every((v) => v);
        });

  const { lat: searchLat, lng: searchLng } = searchLocation;

  const isFirstRun = useRef(true);
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      // First run will be seeded by server. Skip it
      if (isFirstRun.current) {
        isFirstRun.current = false;
      } else {
        console.log("Arse");
        loadDentistsClient(searchLat, searchLng, searchRadius).then((dentists) => setDentists(dentists));
      }
    }

    return () => {
      mounted = false;
    };
  }, [searchLat, searchLng, searchRadius]);

  return (
    <>
      <div
        className={`
          flex
          flex-col-reverse
          w-screen
          h-screen
          text-lg

          lg:flex-row

          text-gray-900
          bg-gray-50

          dark:text-gray-50
          dark:bg-gray-900
        `}
      >
        <div className="flex flex-col h-2/3 lg:h-full lg:w-full lg:max-w-lg">
          <Header />
          <div className="flex flex-col space-y-6 overflow-auto">
            <Section as="main">
              <Panel>
                <H2 className="sr-only">About</H2>
                <p>
                  The NHS lists numerous dental practises through the{" "}
                  <Link href="https://www.nhs.uk/service-search/find-a-dentist" passHref>
                    <Anchor target="_blank">Find a Dentist</Anchor>
                  </Link>{" "}
                  service. This web page adds additional tools for searching and visualising dental practises, such as
                  finding dentists that are accepting NHS patients.
                </p>
              </Panel>
            </Section>
            <Section className="space-y-4">
              <H2>Search parameters</H2>
              <Panel>
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
            <Section className="space-y-4">
              <H2>List of dental practises ({filteredDentists.length})</H2>
              <ul className="space-y-4">
                {filteredDentists.map((dentist) => (
                  <Panel key={dentist.ODSCode}>
                    <DentistInfo as="li" dentist={dentist} />
                  </Panel>
                ))}
              </ul>
            </Section>
          </div>
          <Footer />
        </div>
        <section className="flex-shrink-0 h-1/3 lg:h-full lg:w-full lg:flex-1">
          <Map dentists={filteredDentists} />
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const maxDentists = process.env.NODE_ENV == "development" ? process.env.MAX_DENTISTS ?? false : false;

  const defaultLocation = {
    lng: "-2.23743",
    lat: "53.48095",
    name: "Manchester",
  };
  const defaultRadius = 15; // km

  const dentists = loadDentistsServer(defaultLocation.lat, defaultLocation.lng, defaultRadius);

  return {
    props: { initialDentists: maxDentists ? dentists.slice(0, maxDentists) : dentists, defaultLocation, defaultRadius },
  };
}
