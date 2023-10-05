import Footer from "@components/Footer";
import Header from "@components/Header";
import { Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
import { verifySubscription } from "lib/notifications/actions/verifySubscription";
import loadConfig from "lib/notifications/helpers/loadConfig";
import { decodeAuthToken } from "lib/notifications/links";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type VerifySubscriptionProps = {
  ok: boolean;
};

const VerifySubscription = ({ ok }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

export const getServerSideProps: GetServerSideProps<VerifySubscriptionProps> = async (context) => {
  const { authToken } = context.query;
  const config = loadConfig();

  try {
    if (typeof authToken !== "string") {
      throw Error("Missing auth token");
    }

    const authPayload = decodeAuthToken(authToken);
    if (!authPayload) {
      throw Error("Could not decode auth payload");
    }
    const { emailAddress, managementUuid } = authPayload;
    await verifySubscription(config, emailAddress, managementUuid);

    return {
      props: {
        ok: true,
      },
    };
  } catch (error: unknown) {
    return {
      notFound: true,
    };
  }
};
