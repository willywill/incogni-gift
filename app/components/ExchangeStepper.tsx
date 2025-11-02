"use client";

import styled from "styled-components";

const ProgressBar = styled.div`
	height: 3px;
	background: ${(props) => props.theme.lightMode.colors.border};
	position: relative;
`;

const ProgressFill = styled.div<{ $progress: number }>`
	height: 100%;
	background: ${(props) => props.theme.lightMode.colors.foreground};
	width: ${(props) => props.$progress}%;
	transition: width 0.3s ease;
`;

const StepIndicator = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	padding: 1.5rem 0 1rem 0;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${(props) =>
		props.$active || props.$completed
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.border};
	transition: all 0.2s ease;
`;

interface ExchangeStepperProps {
	currentStep: number;
	totalSteps?: number;
}

export default function ExchangeStepper({ currentStep, totalSteps = 4 }: ExchangeStepperProps) {
	const progress = (currentStep / totalSteps) * 100;

	return (
		<>
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
		</>
	);
}

