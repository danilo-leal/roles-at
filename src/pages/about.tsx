import clsx from "clsx";
import { SiX, SiBluesky } from "@icons-pack/react-simple-icons";
import { ContainerTransition } from "@/components/primitives/Container";
import { Navbar } from "@/components/primitives/Navbar";
import { SectionDivider } from "@/components/primitives/Divider";
import { Link } from "@/components/primitives/Link";
import { Button } from "@/components/primitives/Button";
import { DanAvatar, VictorAvatar } from "@/components/primitives/Illustrations";

function AvatarBlock({ type }: { type: "dan" | "zani" }) {
  const twitter =
    type === "dan"
      ? "https://twitter.com/danilobleal"
      : "https://twitter.com/victorzanivan";
  const personal =
    type === "dan" ? "https://daniloleal.co" : "https://www.vzanivan.com/";
  const bluesky =
    type === "dan"
      ? "https://bsky.app/profile/daniloleal.co"
      : "https://bsky.app/profile/victorzanivan.bsky.social";

  return (
    <div className={clsx("flex items-center gap-3 py-3")}>
      {type === "dan" && <DanAvatar className="size-10" />}
      {type === "zani" && <VictorAvatar className="size-10" />}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-black dark:text-white font-medium">
          {type === "dan" && "Danilo Leal"}
          {type === "zani" && "Victor Zanivan"}
        </p>
        <div className="flex gap-2">
          <Button
            size="xs"
            href={personal}
            className="text-orange-700 dark:text-orange-300"
          >
            Personal Site
          </Button>
          <Button
            square
            href={twitter}
            size="xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiX size={12} className="text-orange-700 dark:text-orange-300" />
          </Button>
          <Button
            square
            href={bluesky}
            size="xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiBluesky
              size={14}
              className="text-orange-700 dark:text-orange-300"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider type="alternative" />
      <h2 className="text-xl font-semibold mb-2">Why build this?</h2>
      <p className="default-p-style mb-1">
        It started off, on the one hand, by being big fans of{" "}
        <Link href="https://read.cv/a-new-chapter">Read.cv</Link> and getting
        sad with the news that it&apos;d wind down. On the other, we always
        wanted to build something. Really, <i>anything</i>. Given that{" "}
        <Link href="https://read.cv/">Read.cv</Link> has provided so much value
        for us, why not experiment with building a single-purpose,
        nicely-designed, job posting site, where folks could migrate their
        openings from Read.cv? So... here we are. It definitely won&apos;t be
        the most famous or used one out of the many job boards out there, but if
        it helps at least one person find a new role, that is a success.
      </p>
      <SectionDivider />
      <h2 className="text-xl font-semibold mb-2">The tech stack</h2>
      <p className="default-p-style mb-1">
        Building roles.at has been a very cool experience at exploring different
        pieces of technology. We&apos;re thankful for all the open-source
        software out there that allows us to build things like this so easily.
      </p>
      <ul className="default-ul-style">
        <li>
          Everything written in <Link href="https://zed.dev/">Zed</Link> as the
          code editor.
        </li>
        <li>
          Framework of choice is <Link href="https://nextjs.org/">Next.js</Link>{" "}
          (Pages Router, mind you!).
        </li>
        <li>
          Styled with <Link href="https://tailwindcss.com/">Tailwind CSS</Link>{" "}
          (v4 already, baby).
        </li>
        <li>
          Components powered mainly by{" "}
          <Link href="https://base-ui.com/">Base UI</Link>. Other bits from{" "}
          <Link href="https://vaul.emilkowal.ski/">Vaul</Link> and{" "}
          <Link href="https://catalyst.tailwindui.com/">Catalyst UI</Link>.
        </li>
        <li>
          Animations powered by <Link href="https://motion.dev/">Motion</Link>.
        </li>
        <li>
          Shaders provided by{" "}
          <Link href="https://github.com/paper-design/shaders">
            Paper Design
          </Link>
          .
        </li>
        <li>
          Icons from <Link href="https://lucide.dev/">Lucide React</Link>.
        </li>
        <li>
          Email infrastructure by <Link href="https://resend.com/">Resend</Link>{" "}
          & <Link href="https://react.email/">React Email</Link>.
        </li>
      </ul>
      <SectionDivider type="alternative" />
      <h2 className="text-xl font-semibold mb-2">Got any feedback?</h2>
      <p className="text-sm default-p-color mb-4">
        Any cool ideas and/or fix requests are welcome. Email us at{" "}
        <Link href="mailto:hello@roles.at">hello@roles.at</Link>, or:
      </p>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
        <AvatarBlock type="dan" />
        <AvatarBlock type="zani" />
      </div>
    </ContainerTransition>
  );
}
