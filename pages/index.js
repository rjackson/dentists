import { Anchor, H2, Panel, Section, UnorderedList } from "@rjackson/rjds";
import Link from "next/link";
import dentistJson from "../data/dentists.json";

export default function Home({ dentists }) {
  return (
    <>
      <Section as="main">
        <Panel>
          <H2 className="sr-only">About</H2>
          <p>
            The NHS lists numerous dental practises through the{" "}
            <Link href="https://www.nhs.uk/service-search/find-a-dentist" passHref>
              <Anchor target="_blank">Find a Dentist</Anchor>
            </Link>{" "}
            service. This web page adds additional tools for searching and visualising dental practises, such as finding
            dentists that are accepting NHS patients.
          </p>
        </Panel>
      </Section>
      <Section>
        <Panel className="space-y-4">
          <H2>List of dental practises ({dentists.length})</H2>
          <UnorderedList>
            {dentists.map(({ ODSCode, OrganisationName }) => (
              <li key={ODSCode}>{OrganisationName}</li>
            ))}
          </UnorderedList>
        </Panel>
      </Section>
      <Section>
        <Panel className="space-y-4">
          <H2>Map</H2>
        </Panel>
      </Section>
    </>
  );
}

export async function getStaticProps() {
  const dentists = dentistJson.map(({ ODSCode = null, OrganisationName } = {}) => ({
    ODSCode,
    OrganisationName,
  }));

  return {
    props: { dentists },
  };
}
