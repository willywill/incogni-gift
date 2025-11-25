"use client";

import styled from "styled-components";

const StepperContainer = styled.div`
	margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
	height: 4px;
	background: ${(props) => props.theme.lightMode.colors.border};
	border-radius: 2px;
	overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
	height: 100%;
	background: ${(props) => props.theme.lightMode.colors.accent};
	width: ${(props) => props.$progress}%;
	transition: width 0.3s ease;
	border-radius: 2px;
`;

const StepIndicator = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	padding: 1rem 0 0.5rem 0;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${(props) =>
		props.$active || props.$completed
			? props.theme.lightMode.colors.accent
			: props.theme.lightMode.colors.border};
	transition: all 0.2s ease;
`;

const ProgressLabel = styled.div`
	text-align: center;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.75rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
`;

interface ExchangeStepperProps {
	currentStep: number;
	totalSteps?: number;
	showLabel?: boolean;
}

export default function ExchangeStepper({
	currentStep,
	totalSteps = 4,
	showLabel = false,
}: ExchangeStepperProps) {
	const progress = (currentStep / totalSteps) * 100;

	return (
		<StepperContainer>
			<ProgressBar>
				<ProgressFill $progress={progress} />
			</ProgressBar>
			<StepIndicator>
				{Array.from({ length: totalSteps }).map((_, index) => (
					<StepDot
						key={index}
						$active={currentStep === index + 1}
						$completed={currentStep > index + 1}
					/>
				))}
			</StepIndicator>
			{showLabel && (
				<ProgressLabel>
					Step {currentStep} of {totalSteps}
				</ProgressLabel>
			)}
		</StepperContainer>
	);
}
