"use client";

import styled from "styled-components";
import { Gift, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

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
`;

const EmptyIcon = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: ${(props) => props.theme.lightMode.colors.muted};
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;

	svg {
		width: 40px;
		height: 40px;
		color: ${(props) => props.theme.lightMode.colors.secondary};
	}
`;

const EmptyTitle = styled.h2`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.75rem 0;
	letter-spacing: -0.02em;
`;

const EmptyText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 2rem 0;
	line-height: 1.6;
	max-width: 400px;
`;

const CreateButton = styled.button`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};
	padding: 0.875rem 2rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	letter-spacing: -0.01em;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	&:active {
		transform: translateY(0);
	}
`;

const ExchangeCard = styled.div`
	background: ${(props) => props.theme.lightMode.colors.background};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 1.5rem;
	transition: all 0.2s ease;
	cursor: pointer;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	@media (max-width: 768px) {
		padding: 1.25rem;
	}
`;

const ExchangeHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
`;

const ExchangeName = styled.h3`
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.25rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
	flex: 1;
`;

const ExchangeDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const DetailRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};

	svg {
		width: 16px;
		height: 16px;
	}
`;

const LoadingState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	min-height: 400px;
`;

const LoadingText = styled.p`
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
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

interface GiftExchangeListProps {
	onCreateClick: () => void;
	refreshTrigger?: number;
}

export default function GiftExchangeList({ onCreateClick, refreshTrigger }: GiftExchangeListProps) {
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
		return (
			<LoadingState>
				<LoadingText>Loading exchanges...</LoadingText>
			</LoadingState>
		);
	}

	if (error) {
		return (
			<EmptyState>
				<EmptyTitle>Error</EmptyTitle>
				<EmptyText>{error}</EmptyText>
			</EmptyState>
		);
	}

	if (exchanges.length === 0) {
		return (
			<EmptyState>
				<EmptyIcon>
					<Gift />
				</EmptyIcon>
				<EmptyTitle>No gift exchanges yet</EmptyTitle>
				<EmptyText>
					Create your first gift exchange to get started. Set up a spending limit and invite
					participants to join the fun!
				</EmptyText>
				<CreateButton onClick={onCreateClick}>Create Gift Exchange</CreateButton>
			</EmptyState>
		);
	}

	return (
		<ListContainer>
			{exchanges.map((exchange) => (
				<ExchangeCard key={exchange.id}>
					<ExchangeHeader>
						<ExchangeName>{exchange.name}</ExchangeName>
					</ExchangeHeader>
					<ExchangeDetails>
						<DetailRow>
							<Gift />
							<span>
								Spending limit: {formatCurrency(exchange.spendingLimit, exchange.currency)}
							</span>
						</DetailRow>
						<DetailRow>
							<Calendar />
							<span>Created {formatDate(exchange.createdAt)}</span>
						</DetailRow>
					</ExchangeDetails>
				</ExchangeCard>
			))}
		</ListContainer>
	);
}

