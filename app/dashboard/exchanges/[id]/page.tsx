"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
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
	Key,
	ChevronDown,
	ChevronUp,
	Check,
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

const currencies = [
	{ value: "USD", label: "USD - US Dollar" },
	{ value: "EUR", label: "EUR - Euro" },
	{ value: "GBP", label: "GBP - British Pound" },
	{ value: "CAD", label: "CAD - Canadian Dollar" },
	{ value: "AUD", label: "AUD - Australian Dollar" },
];

interface GiftExchange {
	id: string;
	name: string;
	magicWord: string | null;
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
	const [editMagicWord, setEditMagicWord] = useState("");
	const [isEditingMagicWord, setIsEditingMagicWord] = useState(false);
	const [editSpendingLimit, setEditSpendingLimit] = useState(25);
	const [editCurrency, setEditCurrency] = useState("USD");
	const [isEditingSpendingLimit, setIsEditingSpendingLimit] = useState(false);
	const [saving, setSaving] = useState(false);
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
			setEditMagicWord(exchange.magicWord || "");
			setEditSpendingLimit(exchange.spendingLimit);
			setEditCurrency(exchange.currency);
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
						magicWord: "Snowflake",
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
					magicWord: "Snowflake",
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
				magicWord: "Snowflake",
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

	const handleSaveMagicWord = async () => {
		if (!editMagicWord.trim() || editMagicWord.trim().length < 3) {
			setError("Magic word must be at least 3 characters long");
			return;
		}

		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					magicWord: editMagicWord.trim(),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update magic word");
			}

			const updated = await response.json();
			setExchange(updated);
			setIsEditingMagicWord(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
	};

	const handleSaveSpendingLimit = async () => {
		if (!editSpendingLimit || editSpendingLimit <= 0 || editSpendingLimit % 5 !== 0) {
			setError("Spending limit must be a positive number in increments of 5");
			return;
		}

		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					spendingLimit: editSpendingLimit,
					currency: editCurrency,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update spending limit");
			}

			const updated = await response.json();
			setExchange(updated);
			setIsEditingSpendingLimit(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
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
					{error && (
						<Card style={{ marginBottom: "2rem", borderLeft: "3px solid", borderLeftColor: "inherit" }}>
							<p style={{ margin: 0, color: "inherit" }}>{error}</p>
						</Card>
					)}
					{activeTab === "invite" && (
						<>
							<Section>
								<div>
									<SectionTitle>Magic Word</SectionTitle>
									<SectionDescription>
										Exchangers will use this word along with your last name to join. Make sure to share
										this with participants.
									</SectionDescription>
								</div>
								<Card>
									{!isEditingMagicWord ? (
										<>
											<div style={{ marginBottom: "1rem" }}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.5rem",
														fontSize: "1.125rem",
														fontWeight: 600,
														color: "inherit",
													}}
												>
													<Key style={{ width: "20px", height: "20px" }} />
													<span>{exchange?.magicWord || "Not set"}</span>
												</div>
											</div>
											<PrimaryButton onClick={() => setIsEditingMagicWord(true)}>
												<Edit />
												Edit Magic Word
											</PrimaryButton>
										</>
									) : (
										<FormGroup>
											<Label htmlFor="magic-word">Magic Word</Label>
											<Input
												id="magic-word"
												type="text"
												value={editMagicWord}
												onChange={(e) => {
													setEditMagicWord(e.target.value);
													setError(null);
												}}
												placeholder="e.g., Snowflake"
											/>
											<div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
												<PrimaryButton onClick={handleSaveMagicWord} disabled={saving}>
													{saving ? "Saving..." : "Save"}
												</PrimaryButton>
												<Button
													onClick={() => {
														setIsEditingMagicWord(false);
														setEditMagicWord(exchange?.magicWord || "");
														setError(null);
													}}
													disabled={saving}
												>
													Cancel
												</Button>
											</div>
										</FormGroup>
									)}
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

							<Section>
								<div>
									<SectionTitle>Invite via Link</SectionTitle>
									<SectionDescription>
										Share this link to invite participants or view the link yourself to join the
										exchange!
									</SectionDescription>
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
									<SectionTitle>Edit Spending Limit</SectionTitle>
									<SectionDescription>
										Update the spending limit and currency for your gift exchange
									</SectionDescription>
								</div>
								<Card>
									{!isEditingSpendingLimit ? (
										<>
											<div style={{ marginBottom: "1rem" }}>
												<div
													style={{
														fontSize: "1.125rem",
														fontWeight: 600,
														color: "inherit",
														marginBottom: "0.5rem",
													}}
												>
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: exchange?.currency || "USD",
													}).format(exchange?.spendingLimit || 0)}
												</div>
											</div>
											<PrimaryButton onClick={() => setIsEditingSpendingLimit(true)}>
												<Edit />
												Edit Spending Limit
											</PrimaryButton>
										</>
									) : (
										<FormGroup>
											<Label htmlFor="spending-limit">Spending Limit</Label>
											<Input
												id="spending-limit"
												type="number"
												min="5"
												step="5"
												value={editSpendingLimit}
												onChange={(e) => {
													const value = parseInt(e.target.value, 10);
													if (!isNaN(value) && value >= 5) {
														setEditSpendingLimit(value);
													} else if (e.target.value === "") {
														setEditSpendingLimit(0);
													}
													setError(null);
												}}
											/>
											<Label htmlFor="currency-select">Currency</Label>
											<SelectRoot
												value={editCurrency}
												onValueChange={setEditCurrency}
												defaultValue={editCurrency}
											>
												<SelectTrigger id="currency-select" aria-label="Currency">
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
											<div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
												<PrimaryButton onClick={handleSaveSpendingLimit} disabled={saving}>
													{saving ? "Saving..." : "Save"}
												</PrimaryButton>
												<Button
													onClick={() => {
														setIsEditingSpendingLimit(false);
														setEditSpendingLimit(exchange?.spendingLimit || 25);
														setEditCurrency(exchange?.currency || "USD");
														setError(null);
													}}
													disabled={saving}
												>
													Cancel
												</Button>
											</div>
										</FormGroup>
									)}
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

