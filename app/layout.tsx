import "./globals.css";
import Provider from "./provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-monospace">
      <body className="container mx-auto flex h-full min-h-screen max-w-6xl flex-col p-4 dark:bg-zinc-900 dark:text-zinc-300 md:p-8">
        <Provider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}