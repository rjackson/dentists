import Footer from "@components/Footer";
import Header from "@components/Header";
import { Anchor, H2, Panel, Section } from "@rjackson/rjds";
import dynamic from "next/dynamic";
import Link from "next/link";

import { loadDentists as loadDentistsServer } from "lib/dentists/server";
import SearchFilters from "@components/SearchFilters";
import DentistsList from "@components/DentistsList";
import { DentistsProvider } from "contexts/Dentists";

const DentistsMap = dynamic(() => import("@components/DentistsMap"), { ssr: false });

export default function Home({ initialDentists, initialLocation, initialRadius }) {
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
            <SearchFilters />
            <DentistsList />
          </div>
          <Footer />
        </div>
        <section className="flex-shrink-0 h-1/3 lg:h-full lg:w-full lg:flex-1">
          <DentistsMap />
        </section>
      </div>
    </DentistsProvider>
  );
}

export async function getStaticProps() {
  const maxDentists = process.env.NODE_ENV == "development" ? process.env.MAX_DENTISTS ?? false : false;

  const initialLocation = {
    lng: "-2.23743",
    lat: "53.48095",
    name: "Manchester",
  };
  const initialRadius = 15; // km

  const dentists = loadDentistsServer(initialLocation.lat, initialLocation.lng, initialRadius);

  return {
    props: { initialDentists: maxDentists ? dentists.slice(0, maxDentists) : dentists, initialLocation, initialRadius },
  };
}
