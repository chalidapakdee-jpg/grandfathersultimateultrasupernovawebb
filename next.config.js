/** @type {import('next').NextConfig} */

// When this build runs inside GitHub Actions, GITHUB_REPOSITORY is set
// automatically to "owner/repo". A GitHub Pages *project* site is served
// from https://owner.github.io/repo/, so Next.js needs to know the
// "/repo" prefix at build time. A user/organization page repo (named
// exactly "<owner>.github.io") is served from the domain root instead,
// so no prefix is needed in that one case.
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "";
const isUserOrgPage = repoName.endsWith(".github.io");
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubActions && repoName && !isUserOrgPage ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // produces a static ./out folder (`next build`)
  trailingSlash: true, // /login/index.html instead of /login.html - plays nicer with static hosts
  images: {
    unoptimized: true, // GitHub Pages has no image-optimization server
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

module.exports = nextConfig;
