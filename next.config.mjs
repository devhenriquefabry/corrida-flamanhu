// Site na raiz do domínio. Se mudar, mude igual em lib/base-path.ts.
const basePath = "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // publica como site estático (Firebase Hosting, ver firebase.json)
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },

  // há um package-lock.json solto em C:\Users\henri que confunde a
  // inferência de workspace do Next — fixa a raiz neste projeto
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
