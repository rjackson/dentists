import { useEffect } from "react";
import { useRouter } from "next/router";
import * as Fathom from "fathom-client";

const useFathom = () => {
  const router = useRouter();
  const customDomain = process.env.NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN;
  const trackingCode = process.env.NEXT_PUBLIC_FATHOM_TRACKING_CODE;

  useEffect(() => {
    const onRouteChangeComplete = () => {
      Fathom.trackPageview();
    };

    if (trackingCode) {
      Fathom.load(trackingCode, {
        ...(customDomain ? { url: `https://${customDomain}/script.js` } : {}),
      });

      // Record a pageview when route changes
      router.events.on("routeChangeComplete", onRouteChangeComplete);
    }

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useFathom;
