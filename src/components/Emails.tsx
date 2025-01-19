import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

type EmailProps = {
  company: string;
  title: string;
};

export function SubmissionConfirmationEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>
            Thank you for submitting your job listing for {title} at {company}.
          </Text>
          <Text>
            Your submission is currently under review. We will notify you once
            it is approved or if we need any additional information.
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
      <Body>
        <Container>
          <Text>
            Great news! Your job listing for {title} at {company} has been
            approved.
          </Text>
          <Text>
            It is now live on our platform and visible to potential candidates.
          </Text>
          <Link href="https://yourwebsite.com/jobs">View your listing</Link>
        </Container>
      </Body>
    </Html>
  );
}

export function RejectionEmail({ company, title }: EmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>
            We regret to inform you that your job listing for {title} at{" "}
            {company} has not been approved.
          </Text>
          <Text>
            If you believe this is an error or would like more information,
            please contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
