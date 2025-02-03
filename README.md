# Welcome to roles.at

It started off, on the one hand, by being big fans of [Read.cv](https://read.cv/a-new-chapter) and getting sad with the news that it'd wind down. On the other, we always wanted to build something. Really, *anything*. Given that [Read.cv](https://read.cv/) has provided so much value for us, why not experiment with building a single-purpose, nicely-designed, job posting site, where folks could migrate their openings from Read.cv? So... here we are. It definitely won't be the most famous or used one out of the many job boards out there, but if it helps at least one person find a new role, that is a success.

## The tech stack

Building roles.at has been a very cool experience at exploring different pieces of technology. We're thankful for all the open-source software out there that allows us to build things like this so easily.

- Everything written in [Zed](https://zed.dev/) as the code editor.
- Framework of choice is [Next.js](https://nextjs.org/) (Pages Router, mind you!).
- Styled with [Tailwind CSS](https://tailwindcss.com/) (v4 already, baby).
- Components powered mainly by [Base UI](https://base-ui.com/). Other bits from [Vaul](https://vaul.emilkowal.ski/) and [Catalyst UI](https://catalyst.tailwindui.com/).
- Animations powered by [Motion](https://motion.dev/).
- Shaders provided by [Paper Design](https://github.com/paper-design/shaders).
- Icons from [Lucide React](https://lucide.dev/).
- Email infrastructure by [Resend](https://resend.com/) & [React Email](https://react.email/).

## Running

This project relies on some private/secret environment variables. You can create a `.env.local` file in the root of the project with the following variables:

```bash
NEXT_PUBLIC_ADMIN_SECRET="your_admin_secret_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
RESEND_API_KEY="your_resend_api_key_here"
```

We use [pnpm](https://pnpm.io/) as the package manager. First, run `pnpm install` and then `pnpm dev`.

## Authors

- [Danilo Leal](https://daniloleal.co)
- [Victor Zanivan](https://www.vzanivan.com/)
