import type { Metadata } from "next";
import "pretendard/dist/web/static/pretendard.css";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Blueorange Media Wiki",
  description: "미디어 정보 허브 및 전략 기획 자료실",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
