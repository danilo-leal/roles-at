import { ContainerTransition } from "@/components/primitives/Container";
import { Navbar } from "@/components/primitives/Navbar";
import { SectionDivider } from "@/components/primitives/Divider";

export default function AboutPage() {
  return (
    <ContainerTransition>
      <Navbar />
      <h2 className="text-xl font-semibold mb-2">How does it work?</h2>
      <p className="text-sm default-p-color mb-1">
        Thank you wanting to submit a job posting to our platform! It&apos;s a
        simple flow:
      </p>
      <ul className="list-disc pl-6 default-p-color text-sm flex flex-col gap-0.5">
        <li>
          Choose the submission method: direct form or via Read.cv migration.
        </li>
        <li>
          We&apos;ll review your entry and notify you via email about whether it
          has been approved or rejected.
        </li>
        <li>
          For any desired changes or updates, please contact us at
          support@roles.at.
        </li>
      </ul>
      <SectionDivider />
    </ContainerTransition>
  );
}
