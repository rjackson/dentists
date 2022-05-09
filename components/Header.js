import { Anchor, Header as RjdsHeader } from "@rjackson/rjds";
import Link from "next/link";

const Header = () => {
  return (
    <RjdsHeader className="items-center">
      <Link href="/" passHref>
        <Anchor>
          <h1 className="text-2xl font-semibold text-center">{`dentists on a map`}</h1>
        </Anchor>
      </Link>
    </RjdsHeader>
  );
};

export default Header;
