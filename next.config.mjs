const basePath = process.env.NODE_ENV === "production" ? "/corrida-flamanhu" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // publica como site estático para o GitHub Pages
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },

  // há um package-lock.json solto em C:\Users\henri que confunde a
  // inferência de workspace do Next — fixa a raiz neste projeto
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
