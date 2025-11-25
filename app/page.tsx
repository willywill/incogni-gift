"use client";

import { useEffect } from "react";
import Header from "./components/Header";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function Home() {
	useEffect(() => {
		// Handle hash scrolling when navigating from other pages
		const hash = window.location.hash;
		if (hash) {
			// Small delay to ensure page is rendered
			setTimeout(() => {
				const element = document.querySelector(hash);
				if (element) {
					const headerOffset = 80; // Account for sticky navbar
					const elementPosition = element.getBoundingClientRect().top;
					const offsetPosition =
						elementPosition + window.pageYOffset - headerOffset;

					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}, 100);
		}
	}, []);

	return (
		<main>
			<Header />
			<Features />
			<HowItWorks />
			<Footer />
		</main>
	);
}
