import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import { Analytics } from "@vercel/analytics/next";
import { getAbsoluteUrl, getBaseUrl } from "./lib/metadata";
import "./globals.css";

const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-dm-sans",
	weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-playfair",
	weight: ["400", "500", "600", "700"],
});

const ogImage = getAbsoluteUrl("/holiday-sample-pic.png");
const baseUrl = getBaseUrl();

export const metadata: Metadata = {
	title: "IncogniGift",
	description: "Anonymous gift pairing made simple. Secret matches, unforgettable surprises.",
	metadataBase: new URL(baseUrl),
	openGraph: {
		title: "IncogniGift",
		description: "Anonymous gift pairing made simple. Secret matches, unforgettable surprises.",
		url: baseUrl,
		siteName: "IncogniGift",
		images: [
			{
				url: ogImage,
				width: 1200,
				height: 630,
				alt: "IncogniGift - Anonymous gift pairing made simple",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "IncogniGift",
		description: "Anonymous gift pairing made simple. Secret matches, unforgettable surprises.",
		images: [ogImage],
	},
	icons: {
		icon: "/icon.svg",
	},
	themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
			<body>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
				<Analytics />
			</body>
		</html>
	);
}
