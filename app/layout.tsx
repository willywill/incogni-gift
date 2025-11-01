import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-space-grotesk",
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
		<html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
			<body>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	);
}
