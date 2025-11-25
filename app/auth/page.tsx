"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Mail, Sparkles } from "lucide-react";
import { authClient } from "../lib/auth";
import * as motion from "motion/react-client";

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 8px;
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const AuthTitle = styled.h1`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const AuthSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 2rem;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) =>
		props.$active ? props.theme.lightMode.colors.background : "transparent"};
  color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
  box-shadow: ${(props) =>
		props.$active ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const InfoBox = styled.div`
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

const InfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin-bottom: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InfoText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const InfoList = styled.ul`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0.5rem 0 0 0;
  padding-left: 1.25rem;
  line-height: 1.8;

  li {
    margin-bottom: 0.25rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  letter-spacing: -0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ $type: "success" | "error" }>`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) =>
		props.$type === "success"
			? props.theme.lightMode.colors.muted
			: props.theme.lightMode.colors.muted};
  color: ${(props) =>
		props.$type === "success"
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.foreground};
  border: 1px solid
    ${(props) =>
			props.$type === "success"
				? props.theme.lightMode.colors.border
				: props.theme.lightMode.colors.border};
`;

const cardVariants = {
	hidden: { opacity: 0, y: 30, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const formVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const formItemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const AuthPageContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Handle error parameters from URL (e.g., expired/invalid magic links)
	useEffect(() => {
		const error = searchParams.get("error");
		const errorDescription = searchParams.get("error_description");

		if (error) {
			let errorMessage = "Something went wrong. Please try again.";

			if (errorDescription) {
				// Better Auth provides error descriptions
				if (
					errorDescription.includes("expired") ||
					errorDescription.includes("Expired")
				) {
					errorMessage =
						"This magic link has expired. Magic links are valid for 5 minutes. Please request a new one.";
				} else if (
					errorDescription.includes("invalid") ||
					errorDescription.includes("Invalid")
				) {
					errorMessage =
						"This magic link is invalid or has already been used. Please request a new one.";
				} else {
					errorMessage = errorDescription;
				}
			} else {
				// Fallback for generic error parameter
				errorMessage =
					"This magic link is invalid or has expired. Please request a new one.";
			}

			setMessage({
				type: "error",
				text: errorMessage,
			});
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
			router.push("/dashboard");
			return;
		}

		try {
			const { error } = await authClient.signIn.magicLink({
				email,
				callbackURL: "/onboarding/complete-profile",
				errorCallbackURL: "/auth?error=1",
			});

			if (error) {
				setMessage({
					type: "error",
					text: error.message || "Something went wrong. Please try again.",
				});
			} else {
				setMessage({
					type: "success",
					text: isSignUp
						? "Check your email for a magic link to complete sign up!"
						: "Check your email for a magic link to sign in!",
				});
			}
		} catch (error) {
			setMessage({
				type: "error",
				text: "Something went wrong. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContainer>
			<motion.div initial="hidden" animate="visible" variants={cardVariants}>
				<AuthCard>
					<AuthHeader>
						<AuthTitle>
							{isSignUp ? "Create Your Account" : "Welcome Back"}
						</AuthTitle>
						<AuthSubtitle>
							{isSignUp
								? "Get started creating your gift exchange"
								: "Sign in to continue managing your gift exchanges"}
						</AuthSubtitle>
					</AuthHeader>

					{isSignUp && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						>
							<InfoBox>
								<InfoTitle>
									<Sparkles />
									<span>Passwordless Authentication</span>
								</InfoTitle>
								<InfoText>
									We use magic links for secure, password-free authentication.
									No passwords to remember!
								</InfoText>
								<InfoList>
									<li>Only gift exchange creators need an account</li>
									<li>We&apos;ll send you a secure magic link via email</li>
									<li>
										Click the link to instantly sign in—no password required
									</li>
								</InfoList>
							</InfoBox>
						</motion.div>
					)}

					<ToggleContainer>
						<ToggleButton
							type="button"
							$active={!isSignUp}
							onClick={() => {
								setIsSignUp(false);
								setMessage(null);
							}}
						>
							Sign In
						</ToggleButton>
						<ToggleButton
							type="button"
							$active={isSignUp}
							onClick={() => {
								setIsSignUp(true);
								setMessage(null);
							}}
						>
							Sign Up
						</ToggleButton>
					</ToggleContainer>

					<motion.div
						initial="hidden"
						animate="visible"
						variants={formVariants}
					>
						<Form onSubmit={handleSubmit}>
							<motion.div variants={formItemVariants}>
								<FormGroup>
									<Label htmlFor="email">Email Address</Label>
									<InputWrapper>
										<InputIcon>
											<Mail />
										</InputIcon>
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											disabled={loading}
										/>
									</InputWrapper>
								</FormGroup>
							</motion.div>

							{message && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									<Message $type={message.type}>{message.text}</Message>
								</motion.div>
							)}

							<motion.div variants={formItemVariants}>
								<SubmitButton type="submit" disabled={loading || !email.trim()}>
									{loading
										? "Sending..."
										: isSignUp
											? "Send Magic Link"
											: "Send Sign In Link"}
								</SubmitButton>
							</motion.div>
						</Form>
					</motion.div>
				</AuthCard>
			</motion.div>
		</AuthContainer>
	);
};

const AuthPage = () => {
	return (
		<Suspense
			fallback={
				<AuthContainer>
					<AuthCard>
						<AuthHeader>
							<AuthTitle>Loading...</AuthTitle>
						</AuthHeader>
					</AuthCard>
				</AuthContainer>
			}
		>
			<AuthPageContent />
		</Suspense>
	);
};

export default AuthPage;
