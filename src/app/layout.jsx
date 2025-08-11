// src/app/layout.jsx
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Sajid Garments",
  description: "Best garments in town",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <ClientLayout>{children}</ClientLayout>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
