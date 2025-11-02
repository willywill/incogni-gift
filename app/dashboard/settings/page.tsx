"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import CreateExchangeWizard from "@/app/components/CreateExchangeWizard";
import * as Dialog from "@radix-ui/react-dialog";
import { User, Trash2, LogOut, X } from "lucide-react";

const PageHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 2rem;

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const PageTitle = styled.h1`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 2rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.5rem 0;
	letter-spacing: -0.02em;

	@media (max-width: 768px) {
		font-size: 1.75rem;
	}
`;

const PageSubtitle = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const LoadingContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background: ${(props) => props.theme.lightMode.colors.background};
`;

const LoadingText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
`;

const AccessDeniedContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background: ${(props) => props.theme.lightMode.colors.background};
`;

const AccessDeniedCard = styled.div`
	width: 100%;
	max-width: 500px;
	background: ${(props) => props.theme.lightMode.colors.background};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 3rem 2rem;
	text-align: center;
`;

const AccessDeniedTitle = styled.h1`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.75rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	letter-spacing: -0.02em;
`;

const AccessDeniedText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.25rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const SectionDescription = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const Card = styled.div`
	background: ${(props) => props.theme.lightMode.colors.background};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 1.5rem;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-bottom: 1rem;

	&:last-child {
		margin-bottom: 0;
	}
`;

const Label = styled.label`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const Input = styled.input`
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	white-space: nowrap;

	svg {
		width: 18px;
		height: 18px;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

const PrimaryButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}
`;

const DangerButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}
`;

const SecondaryButton = styled(Button)`
	background: transparent;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const InfoRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 0.875rem 0;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};

	&:last-child {
		border-bottom: none;
	}
`;

const InfoLabel = styled.span`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.secondary};
`;

const InfoValue = styled.span`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const WarningText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
`;

const DeleteConfirmInput = styled(Input)`
	margin-bottom: 1rem;
`;

const ModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1000;
`;

const ModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 500px;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 12px;
	padding: 2rem;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	z-index: 1001;

	@media (max-width: 768px) {
		width: 95vw;
		padding: 1.5rem;
	}
`;

const ModalTitle = styled(Dialog.Title)`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	letter-spacing: -0.02em;
`;

const ModalDescription = styled(Dialog.Description)`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
`;

const ModalCloseButton = styled(Dialog.Close)`
	position: absolute;
	top: 1rem;
	right: 1rem;
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

const ErrorMessage = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1rem 0;
	padding: 0.75rem 1rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

const SuccessMessage = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	padding: 0.75rem 1rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

interface UserData {
	firstName: string | null;
	lastName: string | null;
	email: string;
	createdAt: string;
}

export default function SettingsPage() {
	const { data: session, isPending } = useSession();
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [wizardOpen, setWizardOpen] = useState(false);

	useEffect(() => {
		if (session?.user) {
			fetchUserData();
		}
	}, [session]);

	const fetchUserData = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch("/api/user/profile");
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			const data: UserData = await response.json();
			setFirstName(data.firstName || "");
			setLastName(data.lastName || "");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleSaveProfile = async () => {
		if (!firstName.trim() || !lastName.trim()) {
			setError("First name and last name are required");
			return;
		}

		try {
			setSaving(true);
			setError(null);
			setSuccess(null);

			const response = await fetch("/api/user/profile", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: firstName.trim(),
					lastName: lastName.trim(),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update profile");
			}

			setSuccess("Profile updated successfully");
			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteConfirmText !== "DELETE") {
			setError("Please type DELETE to confirm");
			return;
		}

		try {
			setDeleting(true);
			setError(null);

			const response = await fetch("/api/user/account", {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete account");
			}

			// Sign out and redirect to home
			const isBypassMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
			if (isBypassMode) {
				await fetch("/api/auth/sign-out-bypass", {
					method: "POST",
				});
			} else {
				await signOut();
			}
			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			setDeleting(false);
		}
	};

	const handleSignOut = async () => {
		const isBypassMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
		if (isBypassMode) {
			await fetch("/api/auth/sign-out-bypass", {
				method: "POST",
			});
		} else {
			await signOut();
		}
		router.push("/");
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}).format(date);
	};

	if (isPending || loading) {
		return (
			<DashboardLayout onCreateClick={() => router.push("/dashboard")}>
				<LoadingContainer>
					<LoadingText>Loading...</LoadingText>
				</LoadingContainer>
			</DashboardLayout>
		);
	}

	if (!session?.user) {
		return (
			<DashboardLayout onCreateClick={() => router.push("/dashboard")}>
				<AccessDeniedContainer>
					<AccessDeniedCard>
						<AccessDeniedTitle>Access Denied</AccessDeniedTitle>
						<AccessDeniedText>Please sign in to access settings.</AccessDeniedText>
					</AccessDeniedCard>
				</AccessDeniedContainer>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout onCreateClick={() => setWizardOpen(true)}>
			<PageHeader>
				<div>
					<PageTitle>Settings</PageTitle>
					<PageSubtitle>Manage your account settings and preferences</PageSubtitle>
				</div>
			</PageHeader>

			{error && <ErrorMessage>{error}</ErrorMessage>}
			{success && <SuccessMessage>{success}</SuccessMessage>}

			<Section>
				<div>
					<SectionTitle>Profile</SectionTitle>
					<SectionDescription>Update your personal information</SectionDescription>
				</div>
				<Card>
					<FormGroup>
						<Label htmlFor="firstName">First Name</Label>
						<Input
							id="firstName"
							type="text"
							value={firstName}
							onChange={(e) => {
								setFirstName(e.target.value);
								setError(null);
							}}
							placeholder="Enter your first name"
							required
						/>
					</FormGroup>
					<FormGroup>
						<Label htmlFor="lastName">Last Name</Label>
						<Input
							id="lastName"
							type="text"
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
								setError(null);
							}}
							placeholder="Enter your last name"
							required
						/>
					</FormGroup>
					<PrimaryButton onClick={handleSaveProfile} disabled={saving}>
						{saving ? "Saving..." : "Save Changes"}
					</PrimaryButton>
				</Card>
			</Section>

			<Section>
				<div>
					<SectionTitle>Account Information</SectionTitle>
					<SectionDescription>View your account details</SectionDescription>
				</div>
				<Card>
					<InfoRow>
						<InfoLabel>Email</InfoLabel>
						<InfoValue>{session.user.email}</InfoValue>
					</InfoRow>
					<InfoRow>
						<InfoLabel>Account Created</InfoLabel>
						<InfoValue>
							{session.user.createdAt
								? formatDate(session.user.createdAt)
								: "Unknown"}
						</InfoValue>
					</InfoRow>
				</Card>
			</Section>

			<Section>
				<div>
					<SectionTitle>Sign Out</SectionTitle>
					<SectionDescription>Sign out of your account</SectionDescription>
				</div>
				<Card>
					<SecondaryButton onClick={handleSignOut}>
						<LogOut />
						Sign Out
					</SecondaryButton>
				</Card>
			</Section>

			<Section>
				<div>
					<SectionTitle>Delete Account</SectionTitle>
					<SectionDescription>
						Permanently delete your account and all associated data. This action cannot be undone.
					</SectionDescription>
				</div>
				<Card>
					<WarningText>
						Deleting your account will permanently remove all your gift exchanges and associated data.
						This action cannot be undone.
					</WarningText>
					<DangerButton onClick={() => setDeleteConfirmOpen(true)}>
						<Trash2 />
						Delete Account
					</DangerButton>
				</Card>
			</Section>

			<Dialog.Root open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton asChild>
						<button>
							<X />
						</button>
					</ModalCloseButton>
					<ModalTitle>Delete Account</ModalTitle>
					<ModalDescription>
						Are you sure you want to delete your account? This will permanently delete all your gift
						exchanges and cannot be undone. Type <strong>DELETE</strong> to confirm.
					</ModalDescription>
					<DeleteConfirmInput
						type="text"
						value={deleteConfirmText}
						onChange={(e) => {
							setDeleteConfirmText(e.target.value);
							setError(null);
						}}
						placeholder="Type DELETE to confirm"
					/>
					{error && <ErrorMessage>{error}</ErrorMessage>}
					<div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
						<SecondaryButton onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
							Cancel
						</SecondaryButton>
						<DangerButton onClick={handleDeleteAccount} disabled={deleting || deleteConfirmText !== "DELETE"}>
							{deleting ? "Deleting..." : "Delete Account"}
						</DangerButton>
					</div>
				</ModalContent>
			</Dialog.Root>

			<CreateExchangeWizard
				open={wizardOpen}
				onOpenChange={setWizardOpen}
				onSuccess={() => {
					// Navigate to dashboard after creating exchange
					router.push("/dashboard");
				}}
			/>
		</DashboardLayout>
	);
}

