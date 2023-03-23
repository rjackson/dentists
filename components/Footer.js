import { Anchor, Section } from "@rjackson/rjds";
import Link from "next/link";

const Footer = ({ className = "" }) => {
  return (
    <Section as="footer" className={`space-y-2 pt-3 ${className}`}>
      <nav>
        <ul className={`flex space-x-4 justify-center text-sm lg:text-base lg:flex-row`}>
          <li>
            <Link href="/notifications" passHref>
              <Anchor>manage notifications</Anchor>
            </Link>
          </li>
          <li>
            <Link href="/privacy" passHref>
              <Anchor>privacy policy</Anchor>
            </Link>
          </li>
        </ul>
      </nav>
      <ul className={`flex space-x-4 justify-center text-sm lg:text-base lg:flex-row`}>
        <li>
          <Link href="https://rjackson.dev" passHref>
            <Anchor aria-label="RJackson.dev" target="_blank" rel="noreferrer">
              rjackson.dev
            </Anchor>
          </Link>
        </li>
        <li>
          Contains{" "}
          <Link href="https://www.nhs.uk/" passHref>
            <Anchor target="_blank" rel="noreferrer">
              www.nhs.uk
            </Anchor>
          </Link>{" "}
          data.
        </li>
      </ul>
    </Section>
  );
};

export default Footer;
