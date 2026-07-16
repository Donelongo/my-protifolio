/// <reference types="vite/client" />

declare module "*.css";

declare module "*.webp" {
  const source: string;
  export default source;
}
