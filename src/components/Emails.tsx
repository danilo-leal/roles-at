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
};

function Footer() {
  return (
    <>
      <Text className="text-center">
        <Link className="text-[#0366d6] text-[12px]" href="https://roles.at/">
          Roles.at
        </Link>{" "}
        ・{" "}
        <Link
          className="text-[#0366d6] text-[12px]"
          href="mailto:support@roles.at"
        >
          Contact support
        </Link>
      </Text>
      <Text className="text-[#6a737d] text-[12px] text-center mt-[60px]">
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
        Your submission for {title} at {company} has been received.
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
              We&apos;ve got great news! Your opening for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on Roles.at
              is now live and visible to potential candidates.
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
        Your submission for {title} at {company} has been received.
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
