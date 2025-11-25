import type { Metadata } from "next";
import { db } from "@/app/db";
import { giftExchanges } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getAbsoluteUrl } from "@/app/lib/metadata";
import ExchangePageClient from "./ExchangePageClient";

interface PageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;

	try {
		const [exchange] = await db
			.select()
			.from(giftExchanges)
			.where(eq(giftExchanges.id, id))
			.limit(1);

		if (!exchange) {
			return {
				title: "Exchange Not Found | IncogniGift",
				description: "The gift exchange you're looking for doesn't exist.",
			};
		}

		const ogImage = getAbsoluteUrl("/holiday-sample-pic.png");
		const pageUrl = getAbsoluteUrl(`/exchange/${id}`);

		return {
			title: `${exchange.name} | IncogniGift`,
			description: `Join the ${exchange.name} gift exchange. Anonymous gift pairing made simple.`,
			openGraph: {
				title: `${exchange.name} | IncogniGift`,
				description: `Join the ${exchange.name} gift exchange. Anonymous gift pairing made simple.`,
				url: pageUrl,
				siteName: "IncogniGift",
				images: [
					{
						url: ogImage,
						width: 1200,
						height: 630,
						alt: `${exchange.name} - IncogniGift Gift Exchange`,
					},
				],
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: `${exchange.name} | IncogniGift`,
				description: `Join the ${exchange.name} gift exchange. Anonymous gift pairing made simple.`,
				images: [ogImage],
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Exchange | IncogniGift",
			description: "Anonymous gift pairing made simple.",
		};
	}
}

export default async function ExchangePage({ params }: PageProps) {
	const { id } = await params;
	return <ExchangePageClient exchangeId={id} />;
}
