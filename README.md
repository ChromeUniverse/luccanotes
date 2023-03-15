# LuccaNotes

A full-stack note-taking app made by Lucca Rodrigues for fellow lovers of Markdown. 💙

Built with the awesome [T3 stack](https://create.t3.gg/) for [Next.js](https://nextjs.org/), deployed on [Supabase](https://supabase.com/) and [Vercel](https://vercel.com/).

[LuccaNotes is now live!](https://luccanotes.vercel.app/) Go check it out.

![LuccaNotes landing page](https://blaring.net/images/portfolio/luccanotes/landing-page.png)

## Features

Here are just a few of LuccaNotes' awesome features:

- **GitHub Flavored Markdown**: The best flavor of Markdown! The GFM spec is supported by LuccaNotes' text editor and Markdown renderer for note previews.
- **Auto-saving**: Changes to your notes are automatically saved to LuccaNotes' backend, meaning you'll never need to worry about losing your work.
- **Tags keep notes tidy**: Our tagging system allows you to effortlessly group, organize, and search through your notes - regardless if you have 5 or 5000!
- **Note previews**: The toggleable Markdown preview displays a fully rendered version of your note's content as you type it out in the text editor.
- **Keyboard navigation & a11y**: LuccaNotes is built with full accessibility in mind. In addition to a more inclusive UX, this allows for speedy keyboard navigation throughout the entire app.
- **Sort, Filter & Search**: A sensible and easy-to-use search tool lets you quickly browse your collection and find the note you're looking for. It's as simple as that!

## Local development

**Prerequisites**: Make sure [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/) are installed on your system.

- Clone and `cd` into this repo. 
```
$ git clone https://github.com/ChromeUniverse/luccanotes.git
$ cd luccanotes
```
- Install dependencies:
```
npm i
```
- Register new OAuth2 apps with Google and Discord. See [NextAuth docs on Authentication Providers](https://next-auth.js.org/providers/) for more information.
- Create a new `.env` file by copying nad pasting `.env.example`, then populate it with your environment variables, including Prisma connection string, OAuth2 credentials and NextAuth secret.
- Create a new PostgreSQL database for this app and push the Prisma schema.
```
npx prisma db push
```
- Start the local development server.
```
npm run dev
```

## Deploying

LuccaNotes' live demo is deployed on Vercel (Next.js app) and Supabase (PostgreSQL database), but any hosting services with support for Next.js and/or PostgreSQL should work fine.

**First, set up your database.** To deploy on Supabase, first create a new project. Once it's set up, go to Project Settings -> Database -> Connection String. Copy the Node.js connection string and temporarily change it your local `.env`, then push your Prisma schema by running `npx prisma db push` locally.

**Now, the Next.js app.** To deploy on Vercel, simply visit your [dashboard](https://vercel.com/dashboard), select your GitHub repo, set up your environment variables, and voilà! 