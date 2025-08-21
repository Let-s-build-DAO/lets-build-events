import type { Metadata } from "next";
import "./globals.css";



export const metadata = {
  title: "Let's Build Events | Discover Web3, Blockchain & DAO Gatherings",
  description:
    "Join Let's Build Events to explore Web3, Blockchain, and DAO-focused gatherings. Stay updated with curated events, workshops, and networking opportunities.",
  keywords: [
    "Let's Build Events",
    "Web3 events",
    "blockchain meetups",
    "DAO gatherings",
    "crypto workshops",
    "decentralized tech events",
    "learn Web3",
    "blockchain networking",
    "crypto conferences",
    "DAO events",
  ],
  author: "Let's Build DAO",
  openGraph: {
    title: "Let's Build Events | Discover Web3, Blockchain & DAO Gatherings",
    description:
      "Explore Let's Build Events for the latest Web3 and blockchain meetups, workshops, and DAO gatherings. Connect with the decentralized tech community.",
    url: "https://events.lbdao.xyz/", // Replace with actual page URL
    type: "website",
    images: [
      {
        url: "https://events.lbdao.xyz/images/events.png", // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: "Let's Build Events - Web3 and Blockchain Gatherings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Let's Build Events | Web3, Blockchain & DAO Gatherings",
    description:
      "Stay updated with Let's Build Events for Web3 and blockchain meetups, workshops, and DAO gatherings. Connect with the decentralized tech community.",
    images: ["https://events.lbdao.xyz/images/events.png"], // Replace with actual image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
