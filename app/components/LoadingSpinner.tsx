"use client";

import styled from "styled-components";

const LoadingContainer = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background: ${(props) => props.theme.lightMode.colors.background};
`;

const SpinnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
`;

const Spinner = styled.div`
	width: 40px;
	height: 40px;
	border: 3px solid ${(props) => props.theme.lightMode.colors.border};
	border-top-color: ${(props) => props.theme.lightMode.colors.primary};
	border-radius: 50%;
	animation: spin 1s linear infinite;

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

const LoadingText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	text-align: center;
`;

interface LoadingSpinnerProps {
	fullPage?: boolean;
	text?: string;
}

export default function LoadingSpinner({
	fullPage = true,
	text,
}: LoadingSpinnerProps) {
	const content = (
		<SpinnerWrapper>
			<Spinner />
			{text && <LoadingText>{text}</LoadingText>}
		</SpinnerWrapper>
	);

	if (fullPage) {
		return <LoadingContainer>{content}</LoadingContainer>;
	}

	return content;
}

