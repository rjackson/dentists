import "tailwindcss/tailwind.css";
import Head from "next/head";
import { usePrefersDark } from "@rjackson/rjds";
import MainLayout from "@components/layouts/MainLayout";

function MyApp({ Component, pageProps }) {
  const prefersDark = usePrefersDark();
  const getLayout = Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <div className={prefersDark ? "dark" : ""}>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <title>{`dentists on a map`}</title>
        <meta name="description" content="NHS UK Dentists, on a map. Filterable and all." key="description" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}

export default MyApp;
