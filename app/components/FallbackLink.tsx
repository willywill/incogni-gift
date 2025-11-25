"use client";

import styled from "styled-components";

const FallbackLinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
	margin: -0.75rem 0;
`;

const FallbackLinkSubtext = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.8125rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 0.5rem 0;
	line-height: 1.5;
`;

const FallbackLink = styled.a`
	display: -webkit-box;
	padding: 0.5rem 0.75rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 6px;
	background: ${(props) => props.theme.lightMode.colors.muted || "#f9fafb"};
	text-decoration: none;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	transition: all 0.2s ease;
	width: 100%;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	word-break: break-all;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

interface FallbackLinkComponentProps {
	url: string;
}

export default function FallbackLinkComponent({ url }: FallbackLinkComponentProps) {
	return (
		<FallbackLinkContainer>
			<FallbackLinkSubtext>Click link to view</FallbackLinkSubtext>
			<FallbackLink href={url} target="_blank" rel="noopener noreferrer">
				{url}
			</FallbackLink>
		</FallbackLinkContainer>
	);
}

