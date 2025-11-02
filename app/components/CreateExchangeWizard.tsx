"use client";

import styled from "styled-components";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, X, ArrowLeft, ArrowRight } from "lucide-react";

const Overlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1000;
`;

const Content = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 500px;
	max-height: 85vh;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 12px;
	padding: 0;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	z-index: 1001;
	overflow: hidden;
	display: flex;
	flex-direction: column;

	@media (max-width: 768px) {
		width: 95vw;
		max-height: 90vh;
		border-radius: 16px 16px 0 0;
		top: auto;
		bottom: 0;
		transform: translate(-50%, 0);
	}
`;

const Header = styled.div`
	padding: 2rem 2rem 1.5rem 2rem;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Title = styled(Dialog.Title)`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
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
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

const ProgressBar = styled.div`
	height: 3px;
	background: ${(props) => props.theme.lightMode.colors.border};
	position: relative;
	margin: 0 2rem;
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
	padding: 1.5rem 2rem 1rem 2rem;
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

const FormContent = styled.div`
	padding: 2rem;
	flex: 1;
	overflow-y: auto;
`;

const StepContent = styled.div`
	min-height: 200px;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`;

const StepTitle = styled.h3`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.25rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const StepDescription = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const Label = styled.label`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	letter-spacing: -0.01em;
`;

const Input = styled.input`
	width: 100%;
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};
	transition: all 0.2s ease;
	letter-spacing: -0.01em;

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
	}

	&::placeholder {
		color: ${(props) => props.theme.lightMode.colors.secondary};
	}
`;

const SelectRoot = styled(Select.Root)`
	width: 100%;
`;

const SelectTrigger = styled(Select.Trigger)`
	width: 100%;
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	&[data-state="open"] {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
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
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	z-index: 1002;
`;

const SelectViewport = styled(Select.Viewport)`
	padding: 0.5rem;
`;

const SelectItem = styled(Select.Item)`
	padding: 0.75rem 1rem;
	border-radius: 6px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	outline: none;

	&[data-highlighted] {
		background: ${(props) => props.theme.lightMode.colors.muted};
	}

	svg {
		width: 16px;
		height: 16px;
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

const Footer = styled.div`
	padding: 1.5rem 2rem;
	border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
	display: flex;
	justify-content: space-between;
	gap: 1rem;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
	padding: 0.875rem 1.5rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	letter-spacing: -0.01em;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	${(props) =>
		props.$variant === "primary"
			? `
		background: ${props.theme.lightMode.colors.foreground};
		color: ${props.theme.lightMode.colors.background};
		
		&:hover {
			background: ${props.theme.lightMode.colors.gray800};
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}
	`
			: `
		background: transparent;
		color: ${props.theme.lightMode.colors.secondary};
		border: 1px solid ${props.theme.lightMode.colors.border};
		
		&:hover {
			background: ${props.theme.lightMode.colors.muted};
			color: ${props.theme.lightMode.colors.foreground};
		}
	`}

	&:active {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	svg {
		width: 18px;
		height: 18px;
	}
`;

const ErrorMessage = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	padding: 0.75rem 1rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const totalSteps = 3;
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
			// Reset form when closing
			setStep(1);
			setName("");
			setSpendingLimit(25);
			setCurrency("USD");
			setMagicWord("");
			setError(null);
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Overlay />
			<Content>
				<Header>
					<Title>Create Gift Exchange</Title>
					<CloseButton asChild>
						<button>
							<X />
						</button>
					</CloseButton>
				</Header>

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

				<FormContent>
					<StepContent>
						{step === 1 && (
							<>
								<div>
									<StepTitle>What&apos;s the name of your gift exchange?</StepTitle>
									<StepDescription>
										Choose a memorable name that participants will recognize.
									</StepDescription>
								</div>
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
								<div>
									<StepTitle>What&apos;s the spending limit?</StepTitle>
									<StepDescription>
										Set a budget that works for everyone. Amounts must be in increments of $5.
									</StepDescription>
								</div>
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
									<SelectRoot value={currency} onValueChange={setCurrency} defaultValue="USD">
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
								<div>
								<StepTitle>What&apos;s your magic word?</StepTitle>
								<StepDescription>
									Participants will use this word along with your last name to join the exchange.
									The combination of your last name and magic word must be unique. Choose something memorable but not too obvious.
								</StepDescription>
							</div>
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

						{error && <ErrorMessage>{error}</ErrorMessage>}
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
						<Button type="button" $variant="primary" onClick={handleNext} disabled={loading}>
							Next
							<ArrowRight />
						</Button>
					) : (
						<Button type="button" $variant="primary" onClick={handleSubmit} disabled={loading}>
							{loading ? "Creating..." : "Create Exchange"}
						</Button>
					)}
				</Footer>
			</Content>
		</Dialog.Root>
	);
}

