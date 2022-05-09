import { Anchor, Section } from "@rjackson/rjds";
import Link from "next/link";

const Footer = ({ className = "" }) => {
  return (
    <Section as="footer" className={`flex space-x-2 justify-center text-sm lg:text-base lg:flex-row ${className}`}>
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
  );
};

export default Footer;
