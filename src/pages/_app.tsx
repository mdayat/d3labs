import { ToastContainer } from "react-toastify";
import { SelectedUserProvider } from "@contexts/SelectedUserProvider";
import { Sidebar } from "@components/Sidebar";
import type { AppProps } from "next/app";

import "@styles/reset.css";
import "@styles/globals.css";
import "github-markdown-css/github-markdown-dark.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SelectedUserProvider>
      <ToastContainer />
      <Sidebar />
      <Component {...pageProps} />
    </SelectedUserProvider>
  );
}
