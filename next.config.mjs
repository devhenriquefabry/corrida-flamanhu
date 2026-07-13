/** @type {import('next').NextConfig} */
const nextConfig = {
  // há um package-lock.json solto em C:\Users\henri que confunde a
  // inferência de workspace do Next — fixa a raiz neste projeto
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
