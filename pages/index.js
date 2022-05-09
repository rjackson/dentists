import Footer from "@components/Footer";
import Header from "@components/Header";
import { Anchor, H2, Panel, Section, usePrefersDark } from "@rjackson/rjds";
import { mapFromNhs } from "@helpers/DentalAcceptance";
import dynamic from "next/dynamic";
import Link from "next/link";

import dentistJson from "../data/small-dentists.json";
import DentistInfo from "@components/DentistInfo";

const Map = dynamic(() => import("@components/Map"), { ssr: false });

export default function Home({ dentists }) {
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
              <H2>List of dental practises ({dentists.length})</H2>
              <ul className="space-y-4">
                {dentists.map((dentist) => (
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
          <Map dentists={dentists} />
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const dentists = dentistJson.map(
    ({
      ODSCode = null,
      OrganisationName,
      Latitude,
      Longitude,
      AcceptingPatients: { Dentist: nhsAcceptingDentalPatients = [] },
    } = {}) => ({
      ODSCode,
      OrganisationName,
      Latitude,
      Longitude,
      AcceptingPatients: mapFromNhs(nhsAcceptingDentalPatients),
    })
  );

  return {
    props: { dentists: dentists.slice(0, 100) },
  };
}
