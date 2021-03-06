import Footer from "@components/Footer";
import Header from "@components/Header";
import { Button, H2, Section } from "@rjackson/rjds";
import dynamic from "next/dynamic";
import { loadDentists as loadDentistsServer } from "lib/dentists/server";
import SearchFilters from "@components/SearchFilters";
import DentistsList from "@components/DentistsList";
import { DentistsProvider } from "@contexts/Dentists";
import { useReducer } from "react";

const DentistsMap = dynamic(() => import("@components/DentistsMap"), { ssr: false });

export default function Home({ initialDentists, initialLocation, initialRadius, showCells }) {
  const [focusMap, toggleFocusMap] = useReducer((value) => !value, false);

  return (
    <DentistsProvider initialDentists={initialDentists} initialLocation={initialLocation} initialRadius={initialRadius}>
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
        <div className={`flex flex-col lg:h-full lg:w-full lg:max-w-lg ${focusMap ? "h-1/3" : "h-2/3"}`}>
          <div className="flex items-center justify-between px-6">
            <Header />
            <Button
              className="lg:hidden"
              onClick={() => toggleFocusMap()}
              aria-label={focusMap ? "Reduce size of map" : "Increase size of map"}
            >
              {focusMap ? "+" : "-"}
            </Button>
          </div>
          <div className="flex flex-col space-y-4 overflow-y-scroll">
            <Section as="main" className="text-center">
              <H2 className="sr-only">About</H2>
              <p>Use the filters below to find NHS Dental Clinics near you that are accepting patients.</p>
            </Section>
            <SearchFilters />
            <DentistsList />
          </div>
          <Footer />
        </div>
        <section className="flex-1 flex-shrink-0 lg:h-full lg:w-full">
          <DentistsMap showCells={showCells} />
        </section>
      </div>
    </DentistsProvider>
  );
}

export async function getStaticProps() {
  const maxDentists = process.env.NODE_ENV == "development" ? process.env.MAX_DENTISTS ?? false : false;
  const showCells = process.env.NODE_ENV == "development" ? process.env.SHOW_CELLS == "true" : false;

  const initialLocation = {
    lng: "-2.23743",
    lat: "53.48095",
    name: "Manchester",
  };
  const initialRadius = 15; // km

  const dentists = loadDentistsServer(initialLocation.lat, initialLocation.lng, initialRadius);

  return {
    props: {
      initialDentists: maxDentists ? dentists.slice(0, maxDentists) : dentists,
      initialLocation,
      initialRadius,
      showCells,
    },
  };
}
