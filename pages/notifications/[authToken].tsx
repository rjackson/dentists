import Footer from "@components/Footer";
import Header from "@components/Header";
import AlertsTable from "@components/notifications/AlertsTable";
import UnsubscribeFromAll from "@components/notifications/UnsubscribeFromAll";
import VerificationWarning from "@components/notifications/VerificationWarning";
import { H2, H3, Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
import { loadSubscription } from "lib/notifications/actions/loadSubscription";
import loadConfig from "lib/notifications/helpers/loadConfig";
import { decodeAuthToken } from "lib/notifications/links";
import { Subscription } from "lib/notifications/types/Subscription";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type NotificationsManagerProps = {
  subscription: Subscription;
};

const NotificationsManager = ({ subscription }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { emailAddress, verifiedAt } = subscription;
  const verificationRequired = verifiedAt === null;

  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main">
        <div className="space-y-4">
          <H2>{emailAddress}</H2>
          {verificationRequired && <VerificationWarning subscription={subscription} />}
          <Panel>
            <div className="space-y-4">
              <H3>Your alerts</H3>

              <p>These are all the alerts we have set up for your email address.</p>

              <AlertsTable subscription={subscription} />
            </div>
          </Panel>
        </div>
      </Section>
      <UnsubscribeFromAll subscription={subscription} />
    </SingleColumnLayout>
  );
};

export default NotificationsManager;

export const getServerSideProps: GetServerSideProps<NotificationsManagerProps> = async (context) => {
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

    const subscription = await loadSubscription(config, emailAddress);

    if (!subscription) {
      throw Error("Not found");
    }

    if (subscription.managementUuid !== managementUuid) {
      throw Error("Forbidden");
    }

    return {
      props: {
        subscription,
      },
    };
  } catch (error: unknown) {
    // 404 on any errors
    return {
      notFound: true,
    };
  }
};
