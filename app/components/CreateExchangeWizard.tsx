"use client";

import styled, { keyframes } from "styled-components";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
	ChevronDown,
	ChevronUp,
	Check,
	X,
	ArrowLeft,
	ArrowRight,
	Gift,
	AlertCircle,
} from "lucide-react";

const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

const Overlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(54, 50, 48, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1000;
	animation: ${fadeIn} 0.2s ease;
`;

const Content = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 480px;
	max-height: 85vh;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: ${(props) => props.theme.lightMode.radii.xl};
	padding: 0;
	box-shadow: ${(props) => props.theme.lightMode.shadows.xl};
	z-index: 1001;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	animation: ${fadeIn} 0.2s ease;

	@media (max-width: 768px) {
		width: 95vw;
		max-height: 90vh;
		border-radius: ${(props) => props.theme.lightMode.radii.xl} ${(props) => props.theme.lightMode.radii.xl} 0 0;
		top: auto;
		bottom: 0;
		transform: translate(-50%, 0);
	}
`;

const Header = styled.div`
	padding: 1.5rem 1.5rem 1.25rem;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const HeaderContent = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

const HeaderIcon = styled.div`
	color: ${(props) => props.theme.lightMode.colors.primary};

	svg {
		width: 24px;
		height: 24px;
	}
`;

const Title = styled(Dialog.Title)`
	font-family: var(--font-playfair), Georgia, serif;
	font-size: 1.375rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const CloseButton = styled(Dialog.Close)`
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.5rem;
	border-radius: ${(props) => props.theme.lightMode.radii.md};
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.surface};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

const ProgressSection = styled.div`
	padding: 1rem 1.5rem;
	background: ${(props) => props.theme.lightMode.colors.surface};
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
	margin-top: 0.75rem;
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

const FormContent = styled.div`
	padding: 1.5rem;
	flex: 1;
	overflow-y: auto;
`;

const StepContent = styled.div`
	min-height: 180px;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
`;

const StepHeader = styled.div`
	margin-bottom: 0.25rem;
`;

const StepTitle = styled.h3`
	font-family: var(--font-playfair), Georgia, serif;
	font-size: 1.125rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.375rem 0;
	letter-spacing: -0.01em;
`;

const StepDescription = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.5;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const Label = styled.label`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const Input = styled.input`
	width: 100%;
	padding: 0.75rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.lightMode.colors.primary};
		box-shadow: 0 0 0 3px ${(props) => props.theme.lightMode.colors.ring};
	}

	&::placeholder {
		color: ${(props) => props.theme.lightMode.colors.secondaryLight};
	}
`;

const SelectRoot = styled(Select.Root)`
	width: 100%;
`;

const SelectTrigger = styled(Select.Trigger)`
	width: 100%;
	padding: 0.75rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.borderLight};
	}

	&[data-state="open"] {
		border-color: ${(props) => props.theme.lightMode.colors.primary};
		box-shadow: 0 0 0 3px ${(props) => props.theme.lightMode.colors.ring};
	}

	svg {
		width: 16px;
		height: 16px;
		color: ${(props) => props.theme.lightMode.colors.secondary};
	}
`;

const SelectValue = styled(Select.Value)`
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const SelectContent = styled(Select.Content)`
	overflow: hidden;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	box-shadow: ${(props) => props.theme.lightMode.shadows.lg};
	z-index: 1002;
`;

const SelectViewport = styled(Select.Viewport)`
	padding: 0.5rem;
`;

const SelectItem = styled(Select.Item)`
	padding: 0.625rem 1rem;
	border-radius: ${(props) => props.theme.lightMode.radii.md};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	outline: none;
	transition: background 0.15s ease;

	&[data-highlighted] {
		background: ${(props) => props.theme.lightMode.colors.surface};
	}

	svg {
		width: 16px;
		height: 16px;
		color: ${(props) => props.theme.lightMode.colors.accent};
	}
`;

const SelectScrollButton = styled(Select.ScrollUpButton)`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 25px;
	background: ${(props) => props.theme.lightMode.colors.background};
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: default;
`;

const CheckboxWrapper = styled.div<{ $checked: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 0.875rem;
	padding: 1rem;
	border: 1px solid ${(props) =>
		props.$checked
			? props.theme.lightMode.colors.accent
			: props.theme.lightMode.colors.border};
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	cursor: pointer;
	transition: all 0.2s ease;
	background: ${(props) =>
		props.$checked
			? props.theme.lightMode.colors.accentLight
			: props.theme.lightMode.colors.background};

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.accent};
	}
`;

const Checkbox = styled.input`
	width: 20px;
	height: 20px;
	cursor: pointer;
	accent-color: ${(props) => props.theme.lightMode.colors.accent};
	margin-top: 2px;
	flex-shrink: 0;
`;

const CheckboxContent = styled.div`
	flex: 1;
`;

const CheckboxLabel = styled.span`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	display: block;
	margin-bottom: 0.25rem;
	cursor: pointer;
`;

const CheckboxDescription = styled.span`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.8125rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	line-height: 1.5;
	display: block;
`;

const Footer = styled.div`
	padding: 1rem 1.5rem;
	border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
	display: flex;
	justify-content: space-between;
	gap: 1rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	${(props) =>
		props.$variant === "primary"
			? `
		background: ${props.theme.lightMode.colors.primary};
		color: white;
		
		&:hover:not(:disabled) {
			background: ${props.theme.lightMode.colors.primaryHover};
			transform: translateY(-1px);
		}
	`
			: `
		background: transparent;
		color: ${props.theme.lightMode.colors.secondary};
		border: 1px solid ${props.theme.lightMode.colors.border};
		
		&:hover:not(:disabled) {
			background: ${props.theme.lightMode.colors.surface};
			color: ${props.theme.lightMode.colors.foreground};
		}
	`}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	svg {
		width: 16px;
		height: 16px;
	}
`;

const ErrorMessage = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.primary};
	padding: 0.75rem 1rem;
	background: ${(props) => props.theme.lightMode.colors.primaryLight};
	border-radius: ${(props) => props.theme.lightMode.radii.md};
	display: flex;
	align-items: center;
	gap: 0.625rem;

	svg {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}
`;

const currencies = [
	{ value: "USD", label: "USD - US Dollar" },
	{ value: "EUR", label: "EUR - Euro" },
	{ value: "GBP", label: "GBP - British Pound" },
	{ value: "CAD", label: "CAD - Canadian Dollar" },
	{ value: "AUD", label: "AUD - Australian Dollar" },
];

interface CreateExchangeWizardProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export default function CreateExchangeWizard({
	open,
	onOpenChange,
	onSuccess,
}: CreateExchangeWizardProps) {
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [spendingLimit, setSpendingLimit] = useState(25);
	const [currency, setCurrency] = useState("USD");
	const [magicWord, setMagicWord] = useState("");
	const [showRecipientNames, setShowRecipientNames] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const totalSteps = 4;
	const progress = (step / totalSteps) * 100;

	const handleNext = () => {
		if (step === 1) {
			if (!name.trim()) {
				setError("Please enter a name for your gift exchange");
				return;
			}
			setError(null);
			setStep(2);
		} else if (step === 2) {
			if (!spendingLimit || spendingLimit <= 0 || spendingLimit % 5 !== 0) {
				setError("Spending limit must be a positive number in increments of 5");
				return;
			}
			setError(null);
			setStep(3);
		} else if (step === 3) {
			setError(null);
			setStep(4);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
			setError(null);
		}
	};

	const handleSubmit = async () => {
		if (!magicWord.trim()) {
			setError("Please enter a magic word for your gift exchange");
			return;
		}

		if (magicWord.trim().length < 3) {
			setError("Magic word must be at least 3 characters long");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/gift-exchanges", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name.trim(),
					spendingLimit,
					currency,
					magicWord: magicWord.trim(),
					showRecipientNames,
				}),
			});

			if (!response.ok) {
				let errorMessage = "Failed to create gift exchange";
				try {
					const data = await response.json();
					errorMessage = data.error || errorMessage;
				} catch {
					// If response is not JSON, use default error message
				}
				throw new Error(errorMessage);
			}

			// Reset form
			setStep(1);
			setName("");
			setSpendingLimit(25);
			setCurrency("USD");
			setMagicWord("");
			setShowRecipientNames(false);
			setError(null);
			onOpenChange(false);
			onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && !loading) {
			setStep(1);
			setName("");
			setSpendingLimit(25);
			setCurrency("USD");
			setMagicWord("");
			setShowRecipientNames(false);
			setError(null);
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Overlay />
			<Content>
				<Header>
					<HeaderContent>
						<HeaderIcon>
							<Gift />
						</HeaderIcon>
						<Title>Create Exchange</Title>
					</HeaderContent>
					<CloseButton asChild>
						<button>
							<X />
						</button>
					</CloseButton>
				</Header>

				<ProgressSection>
					<ProgressBar>
						<ProgressFill $progress={progress} />
					</ProgressBar>
					<StepIndicator>
						{Array.from({ length: totalSteps }).map((_, index) => (
							<StepDot
								key={index}
								$active={step === index + 1}
								$completed={step > index + 1}
							/>
						))}
					</StepIndicator>
				</ProgressSection>

				<FormContent>
					<StepContent>
						{step === 1 && (
							<>
								<StepHeader>
									<StepTitle>Name your exchange</StepTitle>
									<StepDescription>
										Choose a memorable name that participants will recognize.
									</StepDescription>
								</StepHeader>
								<FormGroup>
									<Label htmlFor="name">Exchange Name</Label>
									<Input
										id="name"
										type="text"
										placeholder="e.g., Family Secret Santa 2024"
										value={name}
										onChange={(e) => {
											setName(e.target.value);
											setError(null);
										}}
										autoFocus
									/>
								</FormGroup>
							</>
						)}

						{step === 2 && (
							<>
								<StepHeader>
									<StepTitle>Set your budget</StepTitle>
									<StepDescription>
										Amounts must be in increments of $5.
									</StepDescription>
								</StepHeader>
								<FormGroup>
									<Label htmlFor="spendingLimit">Spending Limit</Label>
									<Input
										id="spendingLimit"
										type="number"
										min="5"
										step="5"
										value={spendingLimit}
										onChange={(e) => {
											const value = parseInt(e.target.value, 10);
											if (!isNaN(value) && value >= 5) {
												setSpendingLimit(value);
											} else if (e.target.value === "") {
												setSpendingLimit(0);
											}
											setError(null);
										}}
										autoFocus
									/>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="currency">Currency</Label>
									<SelectRoot
										value={currency}
										onValueChange={setCurrency}
										defaultValue="USD"
									>
										<SelectTrigger id="currency" aria-label="Currency">
											<SelectValue />
											<Select.Icon>
												<ChevronDown />
											</Select.Icon>
										</SelectTrigger>
										<Select.Portal>
											<SelectContent position="popper" sideOffset={5}>
												<Select.ScrollUpButton asChild>
													<SelectScrollButton>
														<ChevronUp />
													</SelectScrollButton>
												</Select.ScrollUpButton>
												<SelectViewport>
													{currencies.map((curr) => (
														<SelectItem key={curr.value} value={curr.value}>
															<Select.ItemText>{curr.label}</Select.ItemText>
															<Select.ItemIndicator>
																<Check />
															</Select.ItemIndicator>
														</SelectItem>
													))}
												</SelectViewport>
												<Select.ScrollDownButton asChild>
													<SelectScrollButton>
														<ChevronDown />
													</SelectScrollButton>
												</Select.ScrollDownButton>
											</SelectContent>
										</Select.Portal>
									</SelectRoot>
								</FormGroup>
							</>
						)}

						{step === 3 && (
							<>
								<StepHeader>
									<StepTitle>Choose a magic word</StepTitle>
									<StepDescription>
										Participants use this with your last name to join.
									</StepDescription>
								</StepHeader>
								<FormGroup>
									<Label htmlFor="magicWord">Magic Word</Label>
									<Input
										id="magicWord"
										type="text"
										placeholder="e.g., Snowflake"
										value={magicWord}
										onChange={(e) => {
											setMagicWord(e.target.value);
											setError(null);
										}}
										autoFocus
									/>
								</FormGroup>
							</>
						)}

						{step === 4 && (
							<>
								<StepHeader>
									<StepTitle>Privacy settings</StepTitle>
									<StepDescription>
										Choose who sees what during the exchange.
									</StepDescription>
								</StepHeader>
								<FormGroup>
									<CheckboxWrapper
										$checked={showRecipientNames}
										onClick={() => setShowRecipientNames(!showRecipientNames)}
									>
										<Checkbox
											type="checkbox"
											id="showRecipientNames"
											checked={showRecipientNames}
											onChange={(e) => setShowRecipientNames(e.target.checked)}
											onClick={(e) => e.stopPropagation()}
										/>
										<CheckboxContent>
											<CheckboxLabel>Show recipient names</CheckboxLabel>
											<CheckboxDescription>
												Participants see who they&apos;re buying for
												immediately. Otherwise, it&apos;s revealed at the end.
											</CheckboxDescription>
										</CheckboxContent>
									</CheckboxWrapper>
								</FormGroup>
							</>
						)}

						{error && (
							<ErrorMessage>
								<AlertCircle />
								{error}
							</ErrorMessage>
						)}
					</StepContent>
				</FormContent>

				<Footer>
					<Button
						type="button"
						$variant="secondary"
						onClick={handleBack}
						disabled={step === 1 || loading}
					>
						<ArrowLeft />
						Back
					</Button>
					{step < totalSteps ? (
						<Button
							type="button"
							$variant="primary"
							onClick={handleNext}
							disabled={loading}
						>
							Next
							<ArrowRight />
						</Button>
					) : (
						<Button
							type="button"
							$variant="primary"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? "Creating..." : "Create Exchange"}
						</Button>
					)}
				</Footer>
			</Content>
		</Dialog.Root>
	);
}
