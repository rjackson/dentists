import Footer from "@components/Footer";
import Header from "@components/Header";
import { H2, Panel, Section, SingleColumnLayout } from "@rjackson/rjds";
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
          <H2>Verify your email address</H2>
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
  const { emailAddress, managementUuid } = context.query;

  try {
    if (typeof emailAddress !== "string" || typeof managementUuid !== "string") {
      throw Error("Not Found");
    }

    await verifySubscription(emailAddress, managementUuid);
    return {
      props: {
        ok: true,
      },
    };
  } catch (error: unknown) {
    return {
      props: {
        ok: false,
      },
    };
  }
};
