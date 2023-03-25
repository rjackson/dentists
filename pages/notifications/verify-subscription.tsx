import Footer from "@components/Footer";
import Header from "@components/Header";
import { Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
import { decodeAuthToken } from "lib/notifications/links";
import { verifySubscription } from "lib/notifications/server";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

type VerifySubscriptionProps = {
  ok: boolean;
};

const VerifySubscription = ({ ok }: InferGetStaticPropsType<VerifySubscriptionProps>) => {
  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main">
        <div className="space-y-4">
          {/* <H2>Email verification</H2> */}
          <Panel>
            <div className="space-y-4 text-center">
              {ok ? (
                <p>Thank you, we&apos;ve verified your email address and your alert is all set up!</p>
              ) : (
                <p>We could not verify your email address. Please try again later.</p>
              )}
            </div>
          </Panel>
        </div>
      </Section>
    </SingleColumnLayout>
  );
};

export default VerifySubscription;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authToken } = context.query;
  let ok = false;

  try {
    if (typeof authToken !== "string") {
      throw Error("Missing auth token");
    }

    const authPayload = decodeAuthToken(authToken);
    if (!authPayload) {
      throw Error("Could not decode auth payload");
    }
    const { emailAddress, managementUuid } = authPayload;
    await verifySubscription(emailAddress, managementUuid);
    ok = true;
  } catch (error: unknown) {
    // Intentionally empty. We'll render a soft 404
  }

  return {
    props: {
      ok,
    },
  };
};
