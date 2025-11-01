"use client";

import { useServerInsertedHTML } from "next/navigation";
import type React from "react";
import { useState } from "react";
import {
	ServerStyleSheet,
	StyleSheetManager,
	ThemeProvider,
} from "styled-components";
import { theme } from "./theme/theme";

export default function StyledComponentsRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	const [styledComponentsStyleSheet] = useState(() =>
		typeof window === "undefined" ? new ServerStyleSheet() : null,
	);

	useServerInsertedHTML(() => {
		if (!styledComponentsStyleSheet) return null;
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return <>{styles}</>;
	});

	if (!styledComponentsStyleSheet) {
		return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
	}

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</StyleSheetManager>
	);
}
