// Theme configuration with warm, earthy palette
// Design concept: "Editorial Warmth" - minimal, sophisticated, breathable

export const theme = {
	lightMode: {
		colors: {
			// Core palette
			alabaster: "#FAF9F6", // Warm Alabaster - main background
			mushroom: "#EBE5DE", // Mushroom - cards/surfaces
			mushroomDark: "#DDD5CB", // Darker mushroom for borders
			espresso: "#363230", // Espresso Charcoal - main text
			espressoLight: "#5A5654", // Lighter espresso for secondary text
			terracotta: "#C06C55", // Burnt Terracotta - primary CTA only
			terracottaDark: "#A85A45", // Darker terracotta for hover
			terracottaLight: "#F5E6E2", // Light terracotta tint
			sage: "#8A9A85", // Muted Sage - accent
			sageLight: "#E8EBE7", // Light sage tint
			sageDark: "#6B7A67", // Darker sage

			// Pure values
			black: "#1A1918",
			white: "#FFFFFF",

			// Semantic colors
			background: "#FAF9F6",
			backgroundAlt: "#FFFFFF",
			surface: "#EBE5DE",
			foreground: "#363230",

			// Primary action (terracotta - use sparingly!)
			primary: "#C06C55",
			primaryHover: "#A85A45",
			primaryLight: "#F5E6E2",

			// Secondary/muted elements
			secondary: "#5A5654",
			secondaryLight: "#7A7674",

			// Muted backgrounds
			muted: "#EBE5DE",
			mutedAlt: "#F5F3EF",

			// Accent (sage green)
			accent: "#8A9A85",
			accentLight: "#E8EBE7",
			accentDark: "#6B7A67",

			// Border colors
			border: "#DDD5CB",
			borderLight: "#EBE5DE",
			borderFocus: "#C06C55",

			// Input states
			input: "#EBE5DE",
			inputFocus: "#C06C55",
			ring: "rgba(192, 108, 85, 0.2)",

			// Status colors
			success: "#8A9A85",
			successLight: "#E8EBE7",
			successBorder: "#8A9A85",

			error: "#C06C55",
			errorLight: "#F5E6E2",
			errorBorder: "#C06C55",

			warning: "#D4A574",
			warningLight: "#F5EDE4",
			warningBorder: "#D4A574",

			info: "#8A9A85",
			infoLight: "#E8EBE7",
			infoBorder: "#8A9A85",
		},

		// Minimal shadows
		shadows: {
			sm: "0 1px 2px rgba(54, 50, 48, 0.04)",
			md: "0 4px 12px rgba(54, 50, 48, 0.06)",
			lg: "0 8px 24px rgba(54, 50, 48, 0.08)",
			xl: "0 16px 32px rgba(54, 50, 48, 0.1)",
		},

		// Generous border radii for soft edges
		radii: {
			sm: "8px",
			md: "12px",
			lg: "16px",
			xl: "24px",
			full: "9999px",
		},
	},
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
	export interface DefaultTheme extends Theme {}
}
