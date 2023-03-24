import Header from "@components/Header";
import { Anchor, H2, Panel, Section, SingleColumnLayout, UnorderedList } from "@rjackson/rjds";
import Link from "next/link";
import Footer from "../components/Footer";

const Privacy = () => {
  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main" className="space-y-4">
        <H2>Privacy Notice</H2>
        <Panel className="space-y-4">
          <p>We only collect and use personal data when we need to.</p>

          <p>For general usage of the website, no data is collected or stored.</p>

          <p>For users who have set up email alerts, we save and use:</p>

          <UnorderedList>
            <li>Email address</li>
            <li>Location (latitude, longitude, search radius)</li>
            <li>&quot;Patients being accepted&quot; preferences</li>
          </UnorderedList>

          <p>
            When users unsubscribe from alerts we immediately remove their data. Some references may remain in log files
            for up to 37 days after deletion.
          </p>

          {/* TODO: Auto-delete after period of time, unless customer opts to extend? */}

          <p>
            For any questions or concerns, please contact{" "}
            <Link href="mailto:dentists@rjackson.dev" passHref>
              <Anchor>dentists@rjackson.dev</Anchor>
            </Link>
          </p>
        </Panel>
      </Section>
    </SingleColumnLayout>
  );
};

export default Privacy;
