"use client";

import styled from "styled-components";
import { Gift, Calendar, Key, ArrowRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import * as motion from "motion/react-client";

const ListContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	text-align: center;
	min-height: 400px;
	background: ${(props) => props.theme.lightMode.colors.surface};
	border-radius: ${(props) => props.theme.lightMode.radii.xl};
`;

const EmptyIcon = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: ${(props) => props.theme.lightMode.colors.background};
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;

	svg {
		width: 36px;
		height: 36px;
		color: ${(props) => props.theme.lightMode.colors.accent};
	}
`;

const EmptyTitle = styled.h2`
	font-family: var(--font-playfair), Georgia, serif;
	font-size: 1.5rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.5rem 0;
	letter-spacing: -0.02em;
`;

const EmptyText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 2rem 0;
	line-height: 1.6;
	max-width: 360px;
`;

const CreateButton = styled.button`
	background: ${(props) => props.theme.lightMode.colors.primary};
	color: white;
	padding: 0.875rem 1.75rem;
	border: none;
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;

	svg {
		width: 18px;
		height: 18px;
	}

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.primaryHover};
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
`;

const ExchangeCard = styled.div`
	background: ${(props) => props.theme.lightMode.colors.surface};
	border-radius: ${(props) => props.theme.lightMode.radii.xl};
	padding: 1.5rem;
	transition: box-shadow 0.2s ease;
	cursor: pointer;

	&:hover {
		box-shadow: ${(props) => props.theme.lightMode.shadows.md};
	}

	@media (max-width: 768px) {
		padding: 1.25rem;
	}
`;

const ExchangeHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
`;

const ExchangeTitleWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
`;

const ExchangeIconWrapper = styled.div`
	width: 40px;
	height: 40px;
	background: ${(props) => props.theme.lightMode.colors.background};
	color: ${(props) => props.theme.lightMode.colors.accent};
	border-radius: ${(props) => props.theme.lightMode.radii.lg};
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		width: 20px;
		height: 20px;
	}
`;

const ExchangeName = styled.h3`
	font-family: var(--font-playfair), Georgia, serif;
	font-size: 1.125rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.01em;
`;

const ViewButton = styled.div`
	display: flex;
	align-items: center;
	gap: 0.25rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	font-weight: 500;
	transition: color 0.2s ease;

	svg {
		width: 16px;
		height: 16px;
		transition: transform 0.2s ease;
	}

	${ExchangeCard}:hover & {
		color: ${(props) => props.theme.lightMode.colors.primary};

		svg {
			transform: translateX(2px);
		}
	}
`;

const ExchangeDetails = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

const DetailItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.8125rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};

	svg {
		width: 14px;
		height: 14px;
		color: ${(props) => props.theme.lightMode.colors.secondaryLight};
	}
`;


const emptyStateVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const iconBounceVariants = {
	hidden: { scale: 0, rotate: -180 },
	visible: {
		scale: 1,
		rotate: 0,
		transition: {
			type: "spring",
			stiffness: 200,
			damping: 15,
			delay: 0.2,
		},
	},
};

const listVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.98 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

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

interface GiftExchangeListProps {
	onCreateClick: () => void;
	refreshTrigger?: number;
}

export default function GiftExchangeList({
	onCreateClick,
	refreshTrigger,
}: GiftExchangeListProps) {
	const router = useRouter();
	const [exchanges, setExchanges] = useState<GiftExchange[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchExchanges();
	}, [refreshTrigger]);

	const fetchExchanges = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch("/api/gift-exchanges");
			if (!response.ok) {
				throw new Error("Failed to fetch exchanges");
			}
			const data = await response.json();
			setExchanges(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);
	};

	if (loading) {
		return <LoadingSpinner fullPage={false} />;
	}

	if (error) {
		return (
			<motion.div
				initial="hidden"
				animate="visible"
				variants={emptyStateVariants}
			>
				<EmptyState>
					<EmptyTitle>Something went wrong</EmptyTitle>
					<EmptyText>{error}</EmptyText>
				</EmptyState>
			</motion.div>
		);
	}

	if (exchanges.length === 0) {
		return (
			<motion.div
				initial="hidden"
				animate="visible"
				variants={emptyStateVariants}
			>
				<EmptyState>
					<motion.div
						initial="hidden"
						animate="visible"
						variants={iconBounceVariants}
					>
						<EmptyIcon>
							<Gift />
						</EmptyIcon>
					</motion.div>
					<EmptyTitle>No exchanges yet</EmptyTitle>
					<EmptyText>
						Create your first gift exchange to get started. Set a budget and
						invite participants.
					</EmptyText>
					<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
						<CreateButton onClick={onCreateClick}>
							<Plus />
							Create Exchange
						</CreateButton>
					</motion.div>
				</EmptyState>
			</motion.div>
		);
	}

	return (
		<motion.div initial="hidden" animate="visible" variants={listVariants}>
			<ListContainer>
				{exchanges.map((exchange) => (
					<motion.div
						key={exchange.id}
						variants={cardVariants}
						whileHover={{ y: -4, transition: { duration: 0.2 } }}
						whileTap={{ scale: 0.99 }}
					>
						<ExchangeCard
							onClick={() => router.push(`/dashboard/exchanges/${exchange.id}`)}
						>
							<ExchangeHeader>
								<ExchangeTitleWrapper>
									<ExchangeIconWrapper>
										<Gift />
									</ExchangeIconWrapper>
									<ExchangeName>{exchange.name}</ExchangeName>
								</ExchangeTitleWrapper>
								<ViewButton>
									View
									<ArrowRight />
								</ViewButton>
							</ExchangeHeader>
							<ExchangeDetails>
								<DetailItem>
									<Gift />
									<span>
										{formatCurrency(exchange.spendingLimit, exchange.currency)}{" "}
										limit
									</span>
								</DetailItem>
								{exchange.magicWord && (
									<DetailItem>
										<Key />
										<span>{exchange.magicWord}</span>
									</DetailItem>
								)}
								<DetailItem>
									<Calendar />
									<span>{formatDate(exchange.createdAt)}</span>
								</DetailItem>
							</ExchangeDetails>
						</ExchangeCard>
					</motion.div>
				))}
			</ListContainer>
		</motion.div>
	);
}
