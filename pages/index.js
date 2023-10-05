import Footer from "@components/Footer";
import Header from "@components/Header";
import { Button, H2, Section } from "@rjackson/rjds";
import dynamic from "next/dynamic";
import SearchFilters from "@components/SearchFilters";
import DentistsList from "@components/DentistsList";
import { DentistsProvider } from "@contexts/Dentists";
import { useReducer } from "react";
import NotificationsCta from "@components/NotificationsCta";
import { FiltersProvider } from "@contexts/Filters";

const DentistsMap = dynamic(() => import("@components/DentistsMap"), { ssr: false });

export default function Home({ initialLocation, initialRadius, showCells }) {
  const [focusMap, toggleFocusMap] = useReducer((value) => !value, false);

  return (
    <DentistsProvider initialLocation={initialLocation} initialRadius={initialRadius}>
      <FiltersProvider>
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
                <p>Find NHS Dentists near you and filter them by the patients they&apos;re currently accepting.</p>
              </Section>

              <SearchFilters />
              <NotificationsCta />
              <DentistsList />
            </div>
            <Footer />
          </div>
          <section className="flex-1 flex-shrink-0 lg:h-full lg:w-full">
            <DentistsMap showCells={showCells} />
          </section>
        </div>
        )
      </FiltersProvider>
    </DentistsProvider>
  );
}

export async function getStaticProps() {
  const showCells = process.env.NODE_ENV == "development" ? process.env.SHOW_CELLS == "true" : false;

  const initialLocation = {
    lng: "-2.23743",
    lat: "53.48095",
    name: "Manchester",
  };
  const initialRadius = 15; // km

  return {
    props: {
      initialLocation,
      initialRadius,
      showCells,
    },
  };
}
