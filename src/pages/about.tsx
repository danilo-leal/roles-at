import { ContainerTransition } from "@/components/primitives/Container";
import { Navbar } from "@/components/primitives/Navbar";
import { SectionDivider } from "@/components/primitives/Divider";
import { Link } from "@/components/primitives/Link";
import clsx from "clsx";

import { DanAvatar, VictorAvatar } from "@/components/primitives/Illustrations";

export default function AboutPage() {
  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider type="alternative" />
      <h2 className="text-xl font-semibold mb-2">Why build this?</h2>
      <p className="default-p-style mb-1">
        We&apos;re big fans of{" "}
        <Link href="https://read.cv/a-new-chapter">Read.cv</Link> and got sad
        with the news that it&apos;d wind down. Paired with that, we always
        wanted to build something. Really, <i>anything</i>.{" "}
        <Link href="https://read.cv/">Read.cv</Link> has provided a lot of value
        for us, so why not give it a shot at building a simple, single-purpose,
        nicely-designed, job posting site, where folks could migrate their
        openings from Read.cv? Here we are. It definitely won&apos;t be the most
        famous or used one out of the many out there, but if it helps at least
        one person find a job, it is a success!
      </p>
      <SectionDivider />
      <h2 className="text-xl font-semibold mb-2">What we used to build</h2>
      <p className="default-p-style mb-1">
        Building Roles.at has been a very cool experience at exploring different
        pieces of technology. We&apos;re thankful for all the open-source
        software out there that allows us to build things like this so easily.
      </p>
      <ul className="default-ul-style">
        <li>
          Everything written with <Link href="https://zed.dev/">Zed</Link> as
          the code editor.
        </li>
        <li>
          Framework of choice is <Link href="https://nextjs.org/">Next.js</Link>{" "}
          (Pages Router, mind you!).
        </li>
        <li>
          Styled with <Link href="https://tailwindcss.com/">Tailwind CSS</Link>{" "}
          (v4, baby).
        </li>
        <li>
          Components provided mainly by{" "}
          <Link href="https://base-ui.com/">Base UI</Link>. With other bits from{" "}
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
          Icons provided by <Link href="https://lucide.dev/">Lucide React</Link>
          .
        </li>
        <li>
          Email infrastructure powered by{" "}
          <Link href="https://resend.com/">Resend</Link> &{" "}
          <Link href="https://react.email/">React Email</Link>.
        </li>
      </ul>
      <SectionDivider type="alternative" />
      <h2 className="text-xl font-semibold mb-2">Got any feedback?</h2>
      <p className="text-sm default-p-color mb-2">
        Any cool ideas and/or fix requests are welcome. Here&apos;s how to reach
        us:{" "}
        <span>
          <Link href="mailto:support@roles.at">support@roles.at</Link>
        </span>
      </p>
      <h3 className="text-lg font-semibold mb-2">Creators </h3>
      <div
        className={clsx(
          "flex items-center gap-3 p-3 mb-2",
          "rounded-xl",
          "border border-transparent",
          "bg-zinc-100/70 dark:bg-zinc-800/40"
        )}
      >
        <div className="flex rounded-full size-12 border default-border-color bg-zinc-50 dark:bg-zinc-800/40">
          <DanAvatar className="max-w-10 max-h-10 opacity-60 m-auto self-center" />
        </div>
        <div className="flex flex-col">
          <p className="default-p-style font-semibold">Danilo Leal</p>

          <div className="flex gap-2 default-p-style">
            <Link href="https://daniloleal.co/">Personal Site</Link> /{" "}
            <Link href="https://twitter.com/danilobleal">Twitter</Link> /{" "}
            <Link href="https://bsky.app/profile/daniloleal.co">Bluesky</Link>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "flex items-center gap-3 p-3",
          "rounded-xl",
          "border border-transparent",
          "bg-zinc-100/70 dark:bg-zinc-800/40"
        )}
      >
        <div className="flex rounded-full size-12 border default-border-color bg-zinc-50 dark:bg-zinc-800/40">
          <VictorAvatar className="max-w-10 max-h-10 opacity-60 m-auto self-center" />
        </div>
        <div className="flex flex-col">
          <p className="default-p-style font-semibold">Victor Zanivan</p>
          <div className="flex gap-2 default-p-style">
            <Link href="https://www.vzanivan.com/">Personal Site</Link> /{" "}
            <Link href="https://twitter.com/victorzanivan">Twitter</Link> /{" "}
            <Link href="https://bsky.app/profile/victorzanivan.bsky.social">
              Bluesky
            </Link>
          </div>
        </div>
      </div>
    </ContainerTransition>
  );
}
