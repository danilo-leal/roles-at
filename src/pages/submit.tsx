import * as React from "react";
import { PageContainer } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { SectionDivider } from "@/components/primitives/Divider";
import { Description, Field, Label } from "@/components/primitives/Fieldset";
import { Input } from "@/components/primitives/Input";
import { Asterisk } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/components/primitives/Link";
import { RichTextEditor } from "@/components/primitives/RichTextEditor";

function MigrateJobForm() {
  const [url, setUrl] = React.useState("");
  const [notificationEmail, setNotificationEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, notification_email: notificationEmail }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.ok) {
        setMessage("Job posting migrated successfully!");
        setUrl("");
        setNotificationEmail("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: unknown) {
      setMessage(
        `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
      console.error("Error in job migration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <Label htmlFor="url">Read.cv Opening URL</Label>
        <Input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://read.cv/teams/company/designer-12345"
        />
      </Field>
      <Field>
        <Label htmlFor="notificationEmail">Contact Email</Label>
        <Description>
          Where to send notifications about the job posting status.
        </Description>
        <Input
          type="email"
          id="notificationEmail"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          required
          placeholder="your-email@email.com"
        />
      </Field>
      <div className="flex w-full justify-between">
        <span>
          <AnimatePresence>
            {showMessage && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="mt-2 text-sm text-zinc-600"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </span>
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Migrating..." : "Migrate Opening From Read.cv"}
        </Button>
      </div>
    </form>
  );
}

export default function SubmitPage() {
  const [company, setCompany] = React.useState("");
  const [companySite, setCompanySite] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [salaryRange, setSalaryRange] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [avatarImg, setAvatarImg] = React.useState("");
  const [applicationLink, setApplicationLink] = React.useState("");
  const [notificationEmail, setNotificationEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showMessage, setShowMessage] = React.useState(false);
  const editorRef = React.useRef<{ clearContent: () => void }>(null);

  React.useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          company_site: companySite,
          title,
          description,
          salary_range: salaryRange,
          location,
          avatar_img: avatarImg,
          application_link: applicationLink,
          notification_email: notificationEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(
        data.message ||
          "Your submission has been received and is pending approval.",
      );
      // Clear form
      setCompany("");
      setTitle("");
      setDescription("");
      setSalaryRange("");
      setLocation("");
      setAvatarImg("");
      setApplicationLink("");
      setNotificationEmail("");
      editorRef.current?.clearContent();
    } catch (error) {
      console.error("Error submitting job posting:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderAsterisk = () => {
    return (
      <Asterisk
        size={10}
        className="mt-1 opacity-70 text-red-500 dark:text-red-300"
      />
    );
  };

  return (
    <PageContainer title="Submit Role">
      <SectionDivider />
      <h2 className="text-xl font-semibold mb-2">How does it work?</h2>
      <p className="default-p-style mb-2">
        First of all, thank you for wanting to submit a job posting to our
        platform! We&apos;re hoping it breeds into a thriving place to find good
        work. Submitting a role here is quite simple:
      </p>
      <ul className="default-ul-style">
        <li>Choose the method: either via direct form or Read.cv migration.</li>
        <li>
          We&apos;ll review your entry and notify you via email about whether
          it&apos;s been approved or not.
        </li>
        <li>
          For any desired changes or updates, please contact us at{" "}
          <Link href="mailto:hello@roles.at">hello@roles.at</Link>.
        </li>
        <li>
          And yup, that&apos;s right—no cost. By submitting a role, you help us
          gain influence to, maybe in the future, charge for it. Help your
          fellow designers!
        </li>
      </ul>
      <SectionDivider />
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Migration a Role From Read.cv
        </h2>
        <p className="default-p-style mb-4">
          Migrate an active Read.cv listing simply by pasting its URL.
        </p>
        <MigrateJobForm />
      </section>
      <SectionDivider />
      <h2 className="text-xl font-semibold mb-2">Direct Form</h2>
      {message && <p className="mb-4 text-sm text-zinc-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <Label className="flex items-start gap-0.5">
              Company {renderAsterisk()}
            </Label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="Acme Inc."
            />
          </Field>
          <Field>
            <Label className="flex items-start gap-0.5">
              Job Title {renderAsterisk()}
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Software Designer"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <Label>Location</Label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Byron Bay, Australia or Remote"
            />
          </Field>
          <Field>
            <Label className="flex items-start gap-0.5">
              Company Avatar URL {renderAsterisk()}
            </Label>
            <Input
              required
              type="text"
              value={avatarImg}
              onChange={(e) => setAvatarImg(e.target.value)}
              placeholder="https://image.com/"
            />
          </Field>
        </div>
        <Field>
          <Label className="flex items-start gap-0.5">
            Application Link {renderAsterisk()}
          </Label>
          <Input
            required
            type="text"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            placeholder="URL or instructions to apply"
          />
        </Field>
        <Field>
          <Label className="flex items-start gap-0.5">
            Company Website {renderAsterisk()}
          </Label>
          <Input
            type="text"
            required
            value={companySite}
            onChange={(e) => {
              let value = e.target.value;
              if (value && !value.startsWith("https://")) {
                value = "https://" + value;
              }
              setCompanySite(value);
            }}
            startPrefix="https://"
            placeholder="company.com"
          />
        </Field>
        <Field>
          <Label className="flex items-start gap-0.5">
            Description {renderAsterisk()}
          </Label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            className="mt-2"
            ref={editorRef}
          />
        </Field>
        <Field>
          <Label>Salary Range</Label>
          <Input
            type="text"
            placeholder="From 80k USD to 200k USD"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
          />
        </Field>
        <Field>
          <Label
            htmlFor="notificationEmail"
            className="flex items-start gap-0.5"
          >
            Contact Email {renderAsterisk()}
          </Label>
          <Description>
            Where to send notifications about the job posting status.
          </Description>
          <Input
            type="email"
            placeholder="your-email@email.com"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            required
          />
        </Field>
        <div className="flex w-full justify-between">
          <span>
            <AnimatePresence>
              {showMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 text-sm text-zinc-600"
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </span>
          <Button
            variant="primary"
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Job Posting"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
