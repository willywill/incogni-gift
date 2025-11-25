import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
	title: "IncogniGift",
	description: "Anonymous gift pairing made simple",
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
