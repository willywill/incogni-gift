"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import * as Dialog from "@radix-ui/react-dialog";
import {
	ArrowLeft,
	Users,
	Link as LinkIcon,
	QrCode,
	Edit,
	Trash2,
	Copy,
	Maximize2,
	X,
} from "lucide-react";

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

const BackButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: transparent;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	padding: 0.5rem 0;
	border: none;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	margin-bottom: 1rem;

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 18px;
		height: 18px;
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

const ErrorState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	text-align: center;
`;

const ErrorTitle = styled.h2`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.75rem 0;
	letter-spacing: -0.02em;
`;

const ErrorText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
	max-width: 400px;
`;

const TabsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const TabsList = styled.div`
	display: flex;
	gap: 0.5rem;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
	margin-bottom: 2rem;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 768px) {
		gap: 0.25rem;
	}
`;

const TabButton = styled.button<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	border: none;
	border-bottom: 2px solid
		${(props) => (props.$active ? props.theme.lightMode.colors.foreground : "transparent")};
	background: transparent;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	cursor: pointer;
	transition: all 0.2s ease;
	white-space: nowrap;
	margin-bottom: -1px;
	flex-shrink: 0;

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 768px) {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		gap: 0.375rem;

		svg {
			width: 16px;
			height: 16px;
		}
	}
`;

const TabContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
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

const ParticipantCount = styled.div`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.125rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin-bottom: 1rem;
`;

const ParticipantList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const ParticipantItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const ParticipantName = styled.span`
	font-weight: 500;
`;

const InviteLinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const LinkInputContainer = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: stretch;

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const LinkInput = styled.input`
	flex: 1;
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
`;

const PrimaryButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: translateY(0);
	}
`;

const QrCodeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 2rem;
`;

const QrCodePlaceholder = styled.div`
	width: 200px;
	height: 200px;
	border: 2px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	grid-template-rows: repeat(8, 1fr);
	gap: 2px;
	padding: 8px;
	background: ${(props) => props.theme.lightMode.colors.white};
`;

const QrCodeSquare = styled.div<{ $filled: boolean }>`
	background: ${(props) =>
		props.$filled
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.white};
	border-radius: 2px;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
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
`;

const DangerButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: translateY(0);
	}
`;

const WarningText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

const QrModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.9);
	z-index: 1000;
`;

const QrModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 16px;
	padding: 3rem;
	z-index: 1001;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	max-width: 90vw;
	max-height: 90vh;

	@media (max-width: 768px) {
		padding: 2rem;
	}
`;

const QrModalCloseButton = styled(Dialog.Close)`
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
		width: 24px;
		height: 24px;
	}
`;

const QrModalTitle = styled(Dialog.Title)`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
	text-align: center;
`;

const QrCodeLarge = styled.div`
	width: 300px;
	height: 300px;
	border: 3px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	grid-template-rows: repeat(8, 1fr);
	gap: 3px;
	padding: 12px;
	background: ${(props) => props.theme.lightMode.colors.white};

	@media (max-width: 768px) {
		width: 280px;
		height: 280px;
	}
`;

interface GiftExchange {
	id: string;
	name: string;
	spendingLimit: number;
	currency: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

type TabType = "activity" | "invite" | "manage";

export default function GiftExchangeDetailPage() {
	const { data: session, isPending } = useSession();
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;

	const [exchange, setExchange] = useState<GiftExchange | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabType>("invite");
	const [editName, setEditName] = useState("");
	const [qrModalOpen, setQrModalOpen] = useState(false);

	// Generate QR code pattern (mock) - use useState to prevent regeneration on each render
	const [qrPattern] = useState(() => {
		const pattern = [];
		for (let i = 0; i < 64; i++) {
			pattern.push(Math.random() > 0.5);
		}
		return pattern;
	});

	// Mock participants data
	const mockParticipants = [
		{ id: "1", name: "John Doe" },
		{ id: "2", name: "Jane Smith" },
		{ id: "3", name: "Mike Johnson" },
		{ id: "4", name: "Sarah Williams" },
		{ id: "5", name: "David Brown" },
	];

	// Mock invitation link
	const mockInviteLink = `https://incognigift.com/join/${id}`;

	useEffect(() => {
		if (id) {
			fetchExchange();
		}
	}, [id]);

	useEffect(() => {
		if (exchange) {
			setEditName(exchange.name);
		}
	}, [exchange]);

	const fetchExchange = async () => {
		try {
			setLoading(true);
			setError(null);
			// Try to fetch from API, or use mock data if not found
			const response = await fetch("/api/gift-exchanges");
			if (response.ok) {
				const exchanges = await response.json();
				const found = exchanges.find((ex: GiftExchange) => ex.id === id);
				if (found) {
					setExchange(found);
				} else {
					// Use mock data if not found
					setExchange({
						id: id,
						name: "Holiday Gift Exchange",
						spendingLimit: 50,
						currency: "USD",
						status: "active",
						createdBy: session?.user?.id || "",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}
			} else {
				// Use mock data if API fails
				setExchange({
					id: id,
					name: "Holiday Gift Exchange",
					spendingLimit: 50,
					currency: "USD",
					status: "active",
					createdBy: session?.user?.id || "",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				});
			}
		} catch (err) {
			// Use mock data on error
			setExchange({
				id: id,
				name: "Holiday Gift Exchange",
				spendingLimit: 50,
				currency: "USD",
				status: "active",
				createdBy: session?.user?.id || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		} finally {
			setLoading(false);
		}
	};

	if (isPending || loading) {
		return (
			<DashboardLayout>
				<LoadingContainer>
					<LoadingText>Loading...</LoadingText>
				</LoadingContainer>
			</DashboardLayout>
		);
	}

	if (!session?.user) {
		return (
			<DashboardLayout>
				<AccessDeniedContainer>
					<AccessDeniedCard>
						<AccessDeniedTitle>Access Denied</AccessDeniedTitle>
						<AccessDeniedText>Please sign in to access this page.</AccessDeniedText>
					</AccessDeniedCard>
				</AccessDeniedContainer>
			</DashboardLayout>
		);
	}

	if (error) {
		return (
			<DashboardLayout>
				<ErrorState>
					<ErrorTitle>Error</ErrorTitle>
					<ErrorText>{error}</ErrorText>
				</ErrorState>
			</DashboardLayout>
		);
	}

	if (!exchange) {
		return (
			<DashboardLayout>
				<ErrorState>
					<ErrorTitle>Exchange Not Found</ErrorTitle>
					<ErrorText>The gift exchange you're looking for doesn't exist.</ErrorText>
				</ErrorState>
			</DashboardLayout>
		);
	}

	const handleCopyLink = () => {
		// Mock functionality
		navigator.clipboard.writeText(mockInviteLink).catch(() => {
			// Fallback if clipboard API fails
		});
	};

	const handleSaveName = () => {
		// Mock functionality
		console.log("Saving name:", editName);
	};

	const handleDeleteExchange = () => {
		// Mock functionality
		console.log("Deleting exchange:", exchange?.id);
	};

	return (
		<DashboardLayout>
			<BackButton onClick={() => router.push("/dashboard")}>
				<ArrowLeft />
				Back to Exchanges
			</BackButton>
			<PageHeader>
				<div>
					<PageTitle>{exchange.name}</PageTitle>
					<PageSubtitle>Manage your gift exchange</PageSubtitle>
				</div>
			</PageHeader>

			<TabsContainer>
				<TabsList>
					<TabButton $active={activeTab === "invite"} onClick={() => setActiveTab("invite")}>
						<LinkIcon />
						Invite
					</TabButton>
					<TabButton $active={activeTab === "activity"} onClick={() => setActiveTab("activity")}>
						<Users />
						Activity
					</TabButton>
					<TabButton $active={activeTab === "manage"} onClick={() => setActiveTab("manage")}>
						<Edit />
						Manage
					</TabButton>
				</TabsList>

				<TabContent>
					{activeTab === "invite" && (
						<>
							<Section>
								<div>
									<SectionTitle>Invite via Link</SectionTitle>
									<SectionDescription>Share this link to invite participants or view the link yourself to join the exchange!</SectionDescription>
								</div>
								<Card>
									<InviteLinkContainer>
										<LinkInputContainer>
											<LinkInput type="text" value={mockInviteLink} readOnly />
											<PrimaryButton onClick={handleCopyLink}>
												<Copy />
												Copy Link
											</PrimaryButton>
										</LinkInputContainer>
									</InviteLinkContainer>
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Invite via QR Code</SectionTitle>
									<SectionDescription>Share this QR code for easy access</SectionDescription>
								</div>
								<Card>
									<QrCodeContainer>
										<QrCodePlaceholder>
											{qrPattern.map((filled, index) => (
												<QrCodeSquare key={index} $filled={filled} />
											))}
										</QrCodePlaceholder>
										<PrimaryButton onClick={() => setQrModalOpen(true)}>
											<Maximize2 />
											Expand
										</PrimaryButton>
									</QrCodeContainer>
								</Card>
								<Dialog.Root open={qrModalOpen} onOpenChange={setQrModalOpen}>
									<QrModalOverlay />
									<QrModalContent>
										<QrModalCloseButton asChild>
											<button>
												<X />
											</button>
										</QrModalCloseButton>
										<QrModalTitle>Scan to Join</QrModalTitle>
										<QrCodeLarge>
											{qrPattern.map((filled, index) => (
												<QrCodeSquare key={index} $filled={filled} />
											))}
										</QrCodeLarge>
									</QrModalContent>
								</Dialog.Root>
							</Section>
						</>
					)}

					{activeTab === "activity" && (
						<Section>
							<div>
								<SectionTitle>Participants</SectionTitle>
								<SectionDescription>See all active participants in this exchange</SectionDescription>
							</div>
							<Card>
								<ParticipantCount>{mockParticipants.length} Participants</ParticipantCount>
								<ParticipantList>
									{mockParticipants.map((participant) => (
										<ParticipantItem key={participant.id}>
											<Users style={{ width: "20px", height: "20px" }} />
											<ParticipantName>{participant.name}</ParticipantName>
										</ParticipantItem>
									))}
								</ParticipantList>
							</Card>
						</Section>
					)}

					{activeTab === "manage" && (
						<>
							<Section>
								<div>
									<SectionTitle>Edit Name</SectionTitle>
									<SectionDescription>Update the name of your gift exchange</SectionDescription>
								</div>
								<Card>
									<FormGroup>
										<Label htmlFor="exchange-name">Exchange Name</Label>
										<Input
											id="exchange-name"
											type="text"
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											placeholder="Enter exchange name"
										/>
										<PrimaryButton onClick={handleSaveName}>
											<Edit />
											Save Changes
										</PrimaryButton>
									</FormGroup>
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Delete Exchange</SectionTitle>
									<SectionDescription>
										Permanently delete this gift exchange. This action cannot be undone.
									</SectionDescription>
								</div>
								<Card>
									<WarningText>
										Deleting this exchange will remove all participants and associated data. This
										action cannot be undone.
									</WarningText>
									<ButtonContainer>
										<DangerButton onClick={handleDeleteExchange}>
											<Trash2 />
											Delete Exchange
										</DangerButton>
									</ButtonContainer>
								</Card>
							</Section>
						</>
					)}
				</TabContent>
			</TabsContainer>
		</DashboardLayout>
	);
}

