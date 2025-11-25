"use client";

import styled from "styled-components";
import { useState } from "react";
import { useSession } from "@/app/lib/auth";
import DashboardLayout from "@/app/components/DashboardLayout";
import GiftExchangeList from "@/app/components/GiftExchangeList";
import CreateExchangeWizard from "@/app/components/CreateExchangeWizard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { Plus } from "lucide-react";

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
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
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
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const CreateButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: ${(props) => props.theme.lightMode.colors.primary};
	color: white;
	padding: 0.875rem 1.5rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	letter-spacing: -0.01em;
	margin-bottom: 2rem;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.primaryHover};
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(192, 108, 85, 0.25);
	}

	&:active {
		transform: translateY(0);
	}

	svg {
		width: 18px;
		height: 18px;
	}

	@media (min-width: 768px) {
		margin-bottom: 0;
	}
`;

const HeaderActions = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
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
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.75rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	letter-spacing: -0.02em;
`;

const AccessDeniedText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

export default function DashboardPage() {
	const { data: session, isPending } = useSession();
	const [wizardOpen, setWizardOpen] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (!session?.user) {
		return (
			<AccessDeniedContainer>
				<AccessDeniedCard>
					<AccessDeniedTitle>Access Denied</AccessDeniedTitle>
					<AccessDeniedText>
						Please sign in to access your dashboard.
					</AccessDeniedText>
				</AccessDeniedCard>
			</AccessDeniedContainer>
		);
	}

	return (
		<DashboardLayout onCreateClick={() => setWizardOpen(true)}>
			<PageHeader>
				<div>
					<PageTitle>Gift Exchanges</PageTitle>
					<PageSubtitle>Manage your active gift exchanges</PageSubtitle>
				</div>
				<HeaderActions>
					<CreateButton onClick={() => setWizardOpen(true)}>
						<Plus />
						Create Exchange
					</CreateButton>
				</HeaderActions>
			</PageHeader>

			<GiftExchangeList
				onCreateClick={() => setWizardOpen(true)}
				refreshTrigger={refreshTrigger}
			/>

			<CreateExchangeWizard
				open={wizardOpen}
				onOpenChange={setWizardOpen}
				onSuccess={() => {
					// Refresh the list
					setRefreshTrigger((prev) => prev + 1);
				}}
			/>
		</DashboardLayout>
	);
}
