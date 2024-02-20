import fs from "fs";

export default function setupReadme() {
  // Define the new README content
  // prettier-ignore
  const newReadmeContent = `<h1 align="center">Title</h1>

<p align="center">
  Description
  <br/>
  Powered by Vercel.
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>

<a href="websiteurl">
    <img alt="alt" src="imagesrc">
</a>

<br/>

## Tech Stack

- Next.js [App Router](https://nextjs.org/docs/app)
- Next.js [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions)
- [Clerk](https://clerk.com) for authentication
- [Replicate](https://replicate.com) for image generation
- [Vercel Blob](https://vercel.com/storage/blob) for image storage
- [Vercel Postgres](https://vercel.com/storage/postgres) for user data storage
- [Vercel KV](https://vercel.com/storage/kv) for redis
- Tailwind CSS

## Author

- Enzo Bacqueyrisses &ensp;<a href="https://twitter.com/bacqueyrisses"><img src="https://skillicons.dev/icons?i=twitter" style="width: 15px; height: auto;" alt="Enzo Bacqueyrisses Twitter Account" /></a>&ensp;<a href="https://www.linkedin.com/in/bacqueyrisses/"><img src="https://skillicons.dev/icons?i=linkedin" style="width: 15px; height: auto;" alt="Enzo Bacqueyrisses Linkedin Account" /></a>&ensp;<a href="https://www.enzo.codes"><img src="https://github.com/bacqueyrisses/photography/assets/96829831/e5f7eff7-690b-429d-aa2f-e3c66c53630e" style="width: 15px; height: auto;" alt="Enzo Bacqueyrisses Portfolio" /></a>
  `;
  fs.writeFileSync("README.md", newReadmeContent);
  console.log(`✅ README.md updated.`);
}
