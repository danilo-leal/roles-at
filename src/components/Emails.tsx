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

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};

export function SubmissionConfirmationEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your submission for {title} at {company} has been received.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="logo.png" width="24" height="25" alt="Roles.at Logo" />
          <Section style={section}>
            <Text style={text}>Hello! 👋</Text>
            <Text style={text}>
              Thank you so much for choosing to submit your job listing for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on
              Roles.at. We will review it soon and get back to you whenever it
              is live.
            </Text>
          </Section>
          <Text style={links}>
            <Link style={link}>Roles.at</Link> ・{" "}
            <Link style={link}>Contact support</Link>
          </Text>

          <Text style={footer}>
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
      <Body style={main}>
        <Container style={container}>
          <Img src="logo.png" width="24" height="25" alt="Roles.at Logo" />
          <Section style={section}>
            <Text style={text}>Hello! 👋</Text>
            <Text style={text}>
              We&apos;ve got awesome news. Your job listing for{" "}
              <strong>{title}</strong> at <strong>{company}</strong> on Roles.at
              is now live on our platform and visible to potential candidates.
            </Text>
          </Section>
          <Text style={links}>
            <Link style={link}>Roles.at</Link> ・{" "}
            <Link style={link}>Contact support</Link>
          </Text>
          <Text style={footer}>
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
      <Body style={main}>
        <Container style={container}>
          <Img src="logo.png" width="24" height="25" alt="Roles.at Logo" />
          <Section style={section}>
            <Text style={text}>Hello! 👋</Text>
            <Text style={text}>
              Unfortunately, your job listing for <strong>{title}</strong> at{" "}
              <strong>{company}</strong> on Roles.at has been rejected. Contact
              us at <Link style={link}>support@roles.at</Link> to resolve it.
            </Text>
          </Section>
          <Text style={links}>
            <Link style={link}>Roles.at</Link> ・{" "}
            <Link style={link}>Contact support</Link>
          </Text>
          <Text style={footer}>
            Roles.at・Proudly a single-purpose software・Made by designers
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
