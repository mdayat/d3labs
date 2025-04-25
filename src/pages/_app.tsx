import type { AppProps } from "next/app";

import "@styles/reset.css";
import "@styles/globals.css";
import "github-markdown-css/github-markdown-dark.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
