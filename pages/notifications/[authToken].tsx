import Footer from "@components/Footer";
import Header from "@components/Header";
import { H2, Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
import { decodeAuthToken } from "lib/notifications/links";
import { loadSubscription } from "lib/notifications/server";
import { Subscription } from "lib/notifications/types";
import { GetServerSideProps, InferGetStaticPropsType } from "next";

type NotificationsManagerProps = {
  subscription: Subscription;
};

const NotificationsManager = ({ subscription }: InferGetStaticPropsType<NotificationsManagerProps>) => {
  return (
    <SingleColumnLayout header={<Header />} footer={<Footer />}>
      <Section as="main">
        <div className="space-y-4">
          <H2>Manage notifications</H2>
          <Panel>
            <pre>{JSON.stringify(subscription, null, 2)}</pre>
          </Panel>
        </div>
      </Section>
    </SingleColumnLayout>
  );
};

export default NotificationsManager;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authToken } = context.query;

  try {
    if (typeof authToken !== "string") {
      throw Error("Missing auth token");
    }

    const authPayload = decodeAuthToken(authToken);
    if (!authPayload) {
      throw Error("Could not decode auth payload");
    }

    const { emailAddress, managementUuid } = authPayload;

    const subscription = await loadSubscription(emailAddress);

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
