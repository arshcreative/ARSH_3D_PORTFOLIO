# ARSH 3D Portfolio

Mohd Arsh’s 3D island portfolio and project gallery. This archive includes the website source, 24 project listings, renders, project videos, interactive GLBs, and assets used by the island. The default car paint is blue.

## Publish on GitHub Pages

1. Extract this ZIP. In GitHub Desktop or Git, add the extracted files to the root of your repository on the `main` branch. Include the hidden `.github` directory. Commit and push the files.
2. In your repository, open **Settings → Pages** and choose **GitHub Actions** under **Build and deployment → Source**.
3. In the **Actions** tab, select **Deploy ARSH 3D to GitHub Pages** and run the workflow on `main`. Subsequent pushes to `main` redeploy automatically.
4. After the workflow succeeds, open the URL shown under **Settings → Pages**. The project gallery is at `portfolio.html` under that same URL.

GitHub Pages usually serves a public website. The email, social links, and portfolio media in the files will be visible to visitors if published publicly.

## Run locally

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

For a production build use `npm run build`. The output goes to `dist/`. Use `npm run preview` to serve that output locally.

The original island runs in the browser. Public race rankings and shared whispers require an upstream server that was not included in the source archive. The gallery is an independent page. The island starts in WebGL mode and offers a WebGPU retry if startup fails.

## Edit the content

- Gallery entries: `sources/data/portfolio-catalog.js`
- In-world project boards: `sources/data/projects.js`
- Project media: `static/projects/`
- Contact links: `sources/data/email.js`, `linkedin.js`, and `discord.js`

## Credits

The island and vehicle runtime are adapted from [Folio 2025](https://github.com/brunosimon/folio-2025). Its MIT license and copyright notice are retained in `license.md`. Third-party notices inside `static/` are included.
