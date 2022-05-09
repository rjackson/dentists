import { Anchor, H2, H3, UnorderedList } from "@rjackson/rjds";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import H4 from "./Headings/H4";
import H5 from "./Headings/H5";

const MarkdownAnchor = ({ href, children, ...props }) => {
  const isExternal = href.startsWith("https://");

  return (
    <Link href={href} passHref>
      <Anchor {...props} target={isExternal ? "_blank" : ""}>
        {children}
      </Anchor>
    </Link>
  );
};

const Markdown = ({ children }) => {
  const components = {
    h1: H2,
    h2: H3,
    h3: H4,
    h4: H5,
    a: MarkdownAnchor,
    ul: UnorderedList,
  };
  const remarkPlugins = [remarkGfm];

  return (
    <ReactMarkdown components={components} remarkPlugins={remarkPlugins}>
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
