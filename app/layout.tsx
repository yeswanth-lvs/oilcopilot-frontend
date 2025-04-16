import "../styles/globals.css";

export const metadata = {
  title: "OilCopilot",
  description: "AI-powered oilfield assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
