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
              Thank you so much for choosing to submit your job listing for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on
              Roles.at. We will review it soon and get back to you whenever it
              is live.
            </Text>
          </Section>
          <Text className="text-center">
            <Link className="text-[#0366d6] text-[12px]">Roles.at</Link> ・{" "}
            <Link className="text-[#0366d6] text-[12px]">Contact support</Link>
          </Text>

          <Text className="text-[#6a737d] text-[12px] text-center mt-[60px]">
            Roles.at・Proudly a single-purpose software・Made by designers
          </Text>
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
              We&apos;ve got awesome news. Your job listing for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on Roles.at
              is now live on our platform and visible to potential candidates.
            </Text>
          </Section>
          <Text className="text-center">
            <Link className="text-[#0366d6] text-[12px]">Roles.at</Link> ・{" "}
            <Link className="text-[#0366d6] text-[12px]">Contact support</Link>
          </Text>
          <Text className="text-[#6a737d] text-[12px] text-center mt-[60px]">
            Roles.at・Proudly a single-purpose software・Made by designers
          </Text>
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
              Unfortunately, your job listing for <strong>{title}</strong> at{" "}
              <strong>{company}</strong> on Roles.at has been rejected. Contact
              us at{" "}
              <Link className="text-[#0366d6] text-[12px]">
                support@roles.at
              </Link>{" "}
              to resolve it.
            </Text>
          </Section>
          <Text className="text-center">
            <Link className="text-[#0366d6] text-[12px]">Roles.at</Link> ・{" "}
            <Link className="text-[#0366d6] text-[12px]">Contact support</Link>
          </Text>
          <Text className="text-[#6a737d] text-[12px] text-center mt-[60px]">
            Roles.at・Proudly a single-purpose software・Made by designers
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
