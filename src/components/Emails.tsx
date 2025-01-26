import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Img,
  Link,
  Section,
} from "@react-email/components";

type EmailProps = {
  company: string;
  title: string;
  companySlug?: string;
};

function Footer() {
  return (
    <>
      <Text className="text-center">
        <Link
          className="text-[#0366d6] text-[12px] underline"
          href="https://roles.at/"
        >
          Roles.at
        </Link>{" "}
        ・{" "}
        <Link
          className="text-[#0366d6] text-[12px] underline"
          href="mailto:support@roles.at"
        >
          Contact support
        </Link>
      </Text>
      <Text className="text-[#6a737d] text-[10px] italics text-center mt-[40px]">
        Proudly a single-purpose software・Made by designers
      </Text>
    </>
  );
}

export function SubmissionConfirmationEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your submission for {title} at {company} has been received.
      </Preview>
      <Body className="bg-white text-[#24292e] font-sans">
        <Container className="max-w-[480px] mx-auto py-[20px] pb-[48px]">
          <Img
            src="https://i.ibb.co/LtKJhWN/logo.png"
            width="24"
            height="24"
            alt="Roles.at Logo"
          />
          <Section className="p-[24px] border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="m-0 mb-[10px] text-left">Hello! 👋</Text>
            <Text className="m-0 mb-[10px] text-left">
              Thank you so much for choosing to submit your opening for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on
              Roles.at. We&apos;ll review it and get back to you as soon as it
              is live.
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

export function ApprovalEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your submission for {title} at {company} is live now!
      </Preview>
      <Body className="bg-white text-[#24292e] font-sans">
        <Container className="max-w-[480px] mx-auto py-[20px] pb-[48px]">
          <Img
            src="https://i.ibb.co/LtKJhWN/logo.png"
            width="24"
            height="25"
            alt="Roles.at Logo"
          />
          <Section className="p-[24px] border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="m-0 mb-[10px] text-left">Hello! 👋</Text>
            <Text className="m-0 mb-[10px] text-left">
              Great news: Your opening for <strong>{title}</strong> at{" "}
              <strong>{company}</strong>
              is now live on Roles.at, and visible to potential candidates.
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

export function RejectionEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your submission for {title} at {company} has been rejected.
      </Preview>
      <Body className="bg-white text-[#24292e] font-sans">
        <Container className="max-w-[480px] mx-auto py-[20px] pb-[48px]">
          <Img
            src="https://i.ibb.co/LtKJhWN/logo.png"
            width="24"
            height="25"
            alt="Roles.at Logo"
          />
          <Section className="p-[24px] border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="m-0 mb-[10px] text-left">Hello! 👋</Text>
            <Text className="m-0 mb-[10px] text-left">
              Unfortunately, your opening for <strong>{title}</strong> at{" "}
              <strong>{company}</strong> on Roles.at has been rejected. Contact
              us at{" "}
              <Link className="text-[#0366d6] text-[12px]">
                support@roles.at
              </Link>{" "}
              to resolve it.
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

export function JobNotificationEmail({
  company,
  title,
  companySlug,
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New Role Available: {title} at {company}
      </Preview>
      <Body className="bg-white text-[#24292e] font-sans">
        <Container className="max-w-[480px] mx-auto py-[20px] pb-[48px]">
          <Img
            src="https://i.ibb.co/LtKJhWN/logo.png"
            width="24"
            height="24"
            alt="Roles.at Logo"
          />
          <Section className="p-[24px] border border-solid border-[#dedede] rounded-[5px] text-center">
            <Text className="m-0 mb-[10px] text-left">Hello! 👋</Text>
            <Text className="m-0 mb-[10px] text-left">
              New <strong>{title}</strong> job opening at{" "}
              <strong>{company}</strong> is available on Roles.at.
            </Text>
            <Text className="m-0 mb-[10px] text-left">
              <strong>{title}</strong> at <strong>{company}</strong>
            </Text>
            <Link
              href={`https://roles.at/${companySlug}`}
              className="bg-[#ff7e33] text-white px-[24px] py-[12px] rounded-[6px] no-underline inline-block mt-[16px]"
            >
              Check it out &rarr;
            </Link>
          </Section>
          <Text className="bg-gray-50/50 rounded text-[#6a737d] text-[10px] text-center mt-[24px]">
            You received this email because you subscribed to job notifications
            from Roles.at.
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe`}
              className="text-[#0366d6]"
            >
              Unsubscribe from notifications
            </Link>
          </Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
