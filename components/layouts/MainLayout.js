import { SingleColumnLayout, Header, Anchor, Section, Panel } from "@rjackson/rjds";
import Link from "next/link";

const MainLayout = ({ children }) => {
  return (
    <SingleColumnLayout
      header={
        <Header className="items-center">
          <Link href="/" passHref>
            <Anchor>
              <h1 className="text-2xl font-semibold text-center">{`dentists on a map`}</h1>
            </Anchor>
          </Link>
        </Header>
      }
      footer={
        <Section as="footer" className="text-center">
          <p aria-hidden>🌈</p>

          <p>
            <Link href="https://rjackson.dev" passHref>
              <Anchor aria-label="RJackson.dev">rjackson.dev</Anchor>
            </Link>
          </p>

          <p>
            Contains{" "}
            <Link href="https://www.nhs.uk/" passHref>
              <Anchor target="_blank" rel="noreferrer">
                www.nhs.uk
              </Anchor>
            </Link>{" "}
            data.
          </p>
        </Section>
      }
    >
      {children}
    </SingleColumnLayout>
  );
};

export default MainLayout;
