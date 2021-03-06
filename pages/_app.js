import "tailwindcss/tailwind.css";
import Head from "next/head";
import { usePrefersDark } from "@rjackson/rjds";
import useFathom from "@components/hooks/useFathom";

function MyApp({ Component, pageProps }) {
  const prefersDark = usePrefersDark();

  // Analytics
  useFathom();

  return (
    <div className={prefersDark ? "dark" : ""}>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <title>{`dentists on a map`}</title>
        <meta
          name="description"
          content="A map of NHS Dental Clinics near you that are accepting patients"
          key="description"
        />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
