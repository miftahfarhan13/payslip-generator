import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={GeistSans.className}>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}
