import Header from "@components/Header";
import { Anchor, H2, Panel, Section, SingleColumnLayout, UnorderedList } from "@rjackson/rjds";
import Link from "next/link";
import Footer from "../components/Footer";

const Privacy = () => {
  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main" className="space-y-4">
        <H2>Privacy policy</H2>
        <Panel className="space-y-4">
          <p>We avoid collecting and using personal information through the website as much as possible.</p>

          <p>For the purpose of alerting customers when new dentists appear matching their filters, we collect:</p>

          <UnorderedList>
            <li>E-mail address</li>
            <li>Geographic area from which you want alerts</li>
            <li>Any filters you have set up</li>
          </UnorderedList>

          <p>
            This data is stored in Cloudflare KV, and is processed by Github Actions. This data will be irrevocably
            deleted when customers unsubcsribe from their alerts.
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
