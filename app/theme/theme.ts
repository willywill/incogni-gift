// Theme configuration with grayscale palette
export const theme = {
	lightMode: {
		colors: {
			// Grayscale palette (50 = lightest, 950 = darkest)
			gray50: "#fafafa",
			gray100: "#f5f5f5",
			gray200: "#e5e5e5",
			gray300: "#d4d4d4",
			gray400: "#a3a3a3",
			gray500: "#737373",
			gray600: "#525252",
			gray700: "#404040",
			gray800: "#262626",
			gray900: "#171717",
			gray950: "#0a0a0a",
			// Pure black and white
			black: "#000000",
			white: "#ffffff",
		// Semantic colors
		background: "#ffffff",
		foreground: "#000000",
		primary: "#000000",
		secondary: "#525252",
		muted: "#f5f5f5",
		accent: "#262626",
		border: "#e5e5e5",
		input: "#e5e5e5",
		ring: "#000000",
		// Error colors
		error: "#fee2e2",
		errorText: "#991b1b",
		errorBorder: "#fecaca",
		},
	},
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
	export interface DefaultTheme extends Theme {}
}
