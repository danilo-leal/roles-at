import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from "@react-email/components";

type Props = {
  company: string;
  title: string;
  email?: string;
};

export default function ConfirmationEmail({ company, title, email }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your job submission is received!</Preview>
      <Body>
        <Container>
          <Section>
            <Heading>Job Submission Confirmation</Heading>
            <Text>
              Hi, Thank you for submitting your job posting for{" "}
              <strong>{title}</strong> at <strong>{company}</strong>. Our team
              will review your submission and approve it shortly. If you have
              any questions, feel free to reach out to us. Best regards, The
              Team. Sent to {email},
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
