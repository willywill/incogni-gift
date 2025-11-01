import type { Metadata } from "next";
import StyledComponentsRegistry from "./registry";
import "./globals.css";

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
		<html lang="en">
			<body>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	);
}
