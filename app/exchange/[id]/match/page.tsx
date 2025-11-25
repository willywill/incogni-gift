"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Gift, Check, Home, Clock, Edit } from "lucide-react";
import { getVisitorId } from "@/app/lib/fingerprint";
import ExchangeStepper from "@/app/components/ExchangeStepper";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import FallbackLinkComponent from "@/app/components/FallbackLink";
import Confetti from "react-confetti";
import {
	extractUrls,
	extractDomain,
	formatDomainName,
	getFaviconUrl,
} from "@/app/lib/link-preview-client";

const MatchContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: ${(props) => props.theme.lightMode.colors.background};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0;
    max-width: 100%;
  }
`;

const HeaderSection = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: ${(props) => props.theme.lightMode.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  @media (min-width: 769px) {
    padding: 1.5rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    border-left: none;
    border-right: none;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const HeaderDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${(props) => props.theme.lightMode.colors.border};
`;

const HeaderLabel = styled.span`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HeaderValue = styled.span`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const MatchCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-width: 100%;
  }
`;

const MatchHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const MatchTitle = styled.h1`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;

    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const MatchSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 auto;
  line-height: 1.6;
  text-align: center;
  max-width: 80%;
`;

const SpendingLimit = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
`;

const SpendingLimitText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0;
  font-weight: 600;
`;

const WishlistSection = styled.div`
  margin-top: 2rem;
`;

const WishlistSectionTitle = styled.h2`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
`;

const WishlistItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const WishlistItemContainer = styled.li<{ $completed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  opacity: ${(props) => (props.$completed ? 0.6 : 1)};
`;

const WishlistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  line-height: 1.6;
`;

const ItemDescription = styled.span`
  flex: 1;
`;

const PreviewCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.muted || "#f9fafb"};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewSource = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8125rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
`;

const FaviconImage = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 2px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: text-bottom;
  margin-left: 0.375rem;
  margin-right: 0.375rem;
  position: relative;
  top: 0.125em;
`;

const PreviewContentWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
`;

const PreviewContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PreviewTitle = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PreviewDescription = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8125rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;


const Checkbox = styled.button<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: 2px solid ${(props) => (props.$checked ? props.theme.lightMode.colors.foreground : props.theme.lightMode.colors.border)};
  border-radius: 4px;
  background: ${(props) => (props.$checked ? props.theme.lightMode.colors.foreground : props.theme.lightMode.colors.background)};
  color: ${(props) => (props.$checked ? props.theme.lightMode.colors.background : props.theme.lightMode.colors.foreground)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyWishlistText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-align: center;
  padding: 2rem;
  margin: 0;
`;


const ErrorMessage = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) => props.theme.lightMode.colors.error || "#fee2e2"};
  color: ${(props) => props.theme.lightMode.colors.errorText || "#991b1b"};
  border: 1px solid ${(props) => props.theme.lightMode.colors.errorBorder || "#fecaca"};
  margin-bottom: 1.5rem;
`;

const CelebrationBanner = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 12px;
  border: 2px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

const CelebrationTitle = styled.h2`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
`;

const CelebrationText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.125rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0.5rem 0;
  line-height: 1.6;
`;

const MatchedName = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const ConfettiWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const NotStartedBanner = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 12px;
  border: 2px solid ${(props) => props.theme.lightMode.colors.border};
`;

const NotStartedTitle = styled.h2`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const NotStartedText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0.5rem 0;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
  width: 100%;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.muted};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

interface WishlistItem {
	id: string;
	description: string;
	url?: string | null;
	previewImage?: string | null;
	previewTitle?: string | null;
	previewDescription?: string | null;
	createdAt: string;
	completed: boolean;
	completedBy: string | null;
	completedAt: string | null;
}

export default function MatchPage() {
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const exchangeId = params?.id as string;
	const participantId = searchParams?.get("participantId");

	const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
	const [spendingLimit, setSpendingLimit] = useState<number | null>(null);
	const [currency, setCurrency] = useState<string>("USD");
	const [exchangeName, setExchangeName] = useState<string | null>(null);
	const [exchangeStatus, setExchangeStatus] = useState<string | null>(null);
	const [showRecipientNames, setShowRecipientNames] = useState<boolean>(false);
	const [matchedParticipantName, setMatchedParticipantName] = useState<
		string | null
	>(null);
	const [buyingForYouName, setBuyingForYouName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [visitorId, setVisitorId] = useState<string | null>(null);
	const [participantName, setParticipantName] = useState<string | null>(null);
	const [completingItemId, setCompletingItemId] = useState<string | null>(null);
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	const isEnded = exchangeStatus === "ended";
	const isNotStarted = exchangeStatus === "active";

	useEffect(() => {
		if (!exchangeId || !participantId) {
			router.push("/join");
			return;
		}

		// Fetch match's wishlist items and participant info
		const fetchMatchData = async (vid: string | null) => {
			try {
				setLoading(true);
				setError(null);

				const url = `/api/participants/${participantId}/match${vid ? `?visitorId=${encodeURIComponent(vid)}` : ""}`;
				const [matchResponse, participantResponse] = await Promise.all([
					fetch(url),
					fetch(`/api/participants/${participantId}`),
				]);

				if (!matchResponse.ok) {
					const data = await matchResponse.json();
					throw new Error(data.error || "Failed to load match information");
				}

				const data = await matchResponse.json();
				setWishlistItems(data.wishlistItems || []);
				setSpendingLimit(data.exchangeInfo?.spendingLimit || null);
				setCurrency(data.exchangeInfo?.currency || "USD");
				setExchangeName(data.exchangeInfo?.name || null);
				setExchangeStatus(data.exchangeInfo?.status || null);
				setShowRecipientNames(data.exchangeInfo?.showRecipientNames || false);
				setMatchedParticipantName(
					data.exchangeInfo?.matchedParticipantName || null,
				);
				setBuyingForYouName(data.exchangeInfo?.buyingForYouName || null);

				if (participantResponse.ok) {
					const participantData = await participantResponse.json();
					setParticipantName(
						`${participantData.firstName} ${participantData.lastName || ""}`.trim(),
					);
				}
			} catch (err) {
				console.error("Error fetching match data:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to load match information. Please try again.",
				);
			} finally {
				setLoading(false);
			}
		};

		// Get visitor ID for validation, then fetch
		getVisitorId()
			.then((id) => {
				setVisitorId(id);
				fetchMatchData(id);
			})
			.catch(() => {
				// Even if visitor ID fails, try fetching without it
				fetchMatchData(null);
			});
	}, [exchangeId, participantId, router]);

	// Set window size for confetti
	useEffect(() => {
		const updateWindowSize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		updateWindowSize();
		window.addEventListener("resize", updateWindowSize);
		return () => window.removeEventListener("resize", updateWindowSize);
	}, []);

	const handleToggleComplete = async (
		itemId: string,
		currentCompleted: boolean,
	) => {
		if (completingItemId || !participantId) return;

		setCompletingItemId(itemId);

		try {
			const response = await fetch(
				`/api/participants/${participantId}/match/complete`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						wishlistItemId: itemId,
						completed: !currentCompleted,
					}),
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update item");
			}

			const updatedItem = await response.json();

			// Update the item in the local state
			setWishlistItems((items) =>
				items.map((item) =>
					item.id === itemId
						? {
								...item,
								completed: updatedItem.completed,
								completedBy: updatedItem.completedBy,
								completedAt: updatedItem.completedAt,
							}
						: item,
				),
			);
		} catch (err) {
			console.error("Error toggling item completion:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to update item. Please try again.",
			);
		} finally {
			setCompletingItemId(null);
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<MatchContainer>
			{isEnded && windowSize.width > 0 && windowSize.height > 0 && (
				<ConfettiWrapper>
					<Confetti
						width={windowSize.width}
						height={windowSize.height}
						colors={["#000000", "#FFFFFF"]}
						numberOfPieces={200}
						recycle={false}
						gravity={0.3}
					/>
				</ConfettiWrapper>
			)}
			<HeaderSection>
				{exchangeName && (
					<>
						<HeaderInfo>
							<HeaderLabel>Gift Exchange</HeaderLabel>
							<HeaderValue>{exchangeName}</HeaderValue>
						</HeaderInfo>
						{participantName && <HeaderDivider />}
					</>
				)}
				{participantName && (
					<HeaderInfo>
						<HeaderLabel>Your Name</HeaderLabel>
						<HeaderValue>{participantName}</HeaderValue>
					</HeaderInfo>
				)}
			</HeaderSection>

			<ContentWrapper>
				<MatchCard>
					<ExchangeStepper currentStep={4} />
					{isNotStarted ? (
						<>
							<NotStartedBanner>
								<NotStartedTitle>
									<Clock />
									The Exchange Hasn&apos;t Started Yet!
								</NotStartedTitle>
								<NotStartedText>
									Hold tight! The organizer is still setting things up. Once
									they start the exchange, you&apos;ll be able to see your
									match&apos;s gift ideas.
								</NotStartedText>
								{spendingLimit !== null && (
									<NotStartedText>
										<strong>Spending Limit:</strong>{" "}
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: currency,
										}).format(spendingLimit)}
									</NotStartedText>
								)}
							</NotStartedBanner>
							<ButtonContainer>
								<SecondaryButton
									onClick={() =>
										router.push(
											`/exchange/${exchangeId}/wishlist?participantId=${participantId}`,
										)
									}
								>
									<Edit />
									Edit Suggested Items
								</SecondaryButton>
								<PrimaryButton onClick={() => router.push("/")}>
									<Home />
									Go Home
								</PrimaryButton>
							</ButtonContainer>
						</>
					) : isEnded ? (
						<>
							<CelebrationBanner>
								<CelebrationTitle>🎉 Exchange Complete! 🎉</CelebrationTitle>
								<CelebrationText>The gift exchange has ended!</CelebrationText>
								{matchedParticipantName && (
									<CelebrationText>
										You can now give your gifts to{" "}
										<MatchedName>{matchedParticipantName}</MatchedName>
									</CelebrationText>
								)}
								{buyingForYouName && (
									<CelebrationText>
										<MatchedName>{buyingForYouName}</MatchedName> was buying
										gifts for you!
									</CelebrationText>
								)}
							</CelebrationBanner>
							<MatchHeader>
								<MatchTitle>
									<Gift />
									Gift Ideas for {matchedParticipantName || "Your Match"}
								</MatchTitle>
								<MatchSubtitle>
									Here are the gift ideas{" "}
									{matchedParticipantName || "your match"} suggested. Time to
									spread some joy!
								</MatchSubtitle>
							</MatchHeader>
							{spendingLimit !== null && (
								<SpendingLimit>
									<SpendingLimitText>
										Spending Limit:{" "}
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: currency,
										}).format(spendingLimit)}
									</SpendingLimitText>
								</SpendingLimit>
							)}
							<WishlistSection>
								<WishlistSectionTitle>Gift Ideas</WishlistSectionTitle>
								{wishlistItems.length > 0 ? (
									<WishlistItemsList>
										{wishlistItems.map((item) => (
											<WishlistItemContainer
												key={item.id}
												$completed={item.completed}
											>
												<WishlistItem>
													<Checkbox
														$checked={item.completed}
														onClick={() =>
															handleToggleComplete(item.id, item.completed)
														}
														disabled={completingItemId === item.id}
														aria-label={
															item.completed
																? "Mark as incomplete"
																: "Mark as complete"
														}
													>
														{item.completed && <Check />}
													</Checkbox>
													<ItemDescription
														style={{
															textDecoration: item.completed
																? "line-through"
																: "none",
														}}
													>
														{(() => {
															const urls = extractUrls(item.description);
															if (urls.length > 0 && item.url) {
																const domain = extractDomain(item.url);
																if (domain) {
																	const domainName = formatDomainName(domain);
																	const faviconUrl = getFaviconUrl(domain);
																	const urlRegex = /(https?:\/\/[^\s]+)/gi;
																	const parts =
																		item.description.split(urlRegex);
																	return (
																		<>
																			{parts.map((part, index) => {
																				// Check if this part is a URL (odd indices after split are URLs)
																				if (index % 2 === 1) {
																					return (
																						<span key={index}>
																							<span>From </span>
																							<FaviconImage
																								src={faviconUrl}
																								alt={domainName}
																							/>
																							<span>{domainName}</span>
																						</span>
																					);
																				}
																				return <span key={index}>{part}</span>;
																			})}
																		</>
																	);
																}
															}
															return item.description;
														})()}
													</ItemDescription>
												</WishlistItem>
												{item.url &&
													(item.previewImage ||
													item.previewTitle ||
													item.previewDescription ? (
														<PreviewCard
															href={item.url}
															target="_blank"
															rel="noopener noreferrer"
														>
															<PreviewContentWrapper>
																{item.previewImage && (
																	<PreviewImage
																		src={item.previewImage}
																		alt={item.previewTitle || "Preview"}
																	/>
																)}
																<PreviewContent>
																	{item.previewTitle && (
																		<PreviewTitle>
																			{item.previewTitle}
																		</PreviewTitle>
																	)}
																	{item.previewDescription && (
																		<PreviewDescription>
																			{item.previewDescription}
																		</PreviewDescription>
																	)}
																</PreviewContent>
															</PreviewContentWrapper>
														</PreviewCard>
													) : (
														<FallbackLinkComponent url={item.url} />
													))}
											</WishlistItemContainer>
										))}
									</WishlistItemsList>
								) : (
									<EmptyWishlistText>
										No gift ideas have been added yet. Check back later!
									</EmptyWishlistText>
								)}
							</WishlistSection>
							<PrimaryButton onClick={() => router.push("/")}>
								<Home />
								Go Home
							</PrimaryButton>
						</>
					) : (
						<>
							{showRecipientNames && matchedParticipantName ? (
								<MatchHeader>
									<MatchTitle>
										<Gift />
										Gift Ideas for {matchedParticipantName}
									</MatchTitle>
									<MatchSubtitle>
										You&apos;re buying gifts for {matchedParticipantName}! Here
										are some gift ideas they suggested. Let the gifting begin!
									</MatchSubtitle>
								</MatchHeader>
							) : (
								<MatchHeader>
									<MatchTitle>
										<Gift />
										Your Gift Match
									</MatchTitle>
									<MatchSubtitle>
										Here are some gift ideas your match suggested you get for
										them. Let the gifting begin!
									</MatchSubtitle>
								</MatchHeader>
							)}

							{error && <ErrorMessage>{error}</ErrorMessage>}

							{spendingLimit !== null && (
								<SpendingLimit>
									<SpendingLimitText>
										Spending Limit:{" "}
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: currency,
										}).format(spendingLimit)}
									</SpendingLimitText>
								</SpendingLimit>
							)}

							<WishlistSection>
								<WishlistSectionTitle>Gift Ideas</WishlistSectionTitle>
								{wishlistItems.length > 0 ? (
									<WishlistItemsList>
										{wishlistItems.map((item) => (
											<WishlistItemContainer
												key={item.id}
												$completed={item.completed}
											>
												<WishlistItem>
													<Checkbox
														$checked={item.completed}
														onClick={() =>
															handleToggleComplete(item.id, item.completed)
														}
														disabled={completingItemId === item.id}
														aria-label={
															item.completed
																? "Mark as incomplete"
																: "Mark as complete"
														}
													>
														{item.completed && <Check />}
													</Checkbox>
													<ItemDescription
														style={{
															textDecoration: item.completed
																? "line-through"
																: "none",
														}}
													>
														{(() => {
															const urls = extractUrls(item.description);
															if (urls.length > 0 && item.url) {
																const domain = extractDomain(item.url);
																if (domain) {
																	const domainName = formatDomainName(domain);
																	const faviconUrl = getFaviconUrl(domain);
																	const urlRegex = /(https?:\/\/[^\s]+)/gi;
																	const parts =
																		item.description.split(urlRegex);
																	return (
																		<>
																			{parts.map((part, index) => {
																				// Check if this part is a URL (odd indices after split are URLs)
																				if (index % 2 === 1) {
																					return (
																						<span key={index}>
																							<span>From </span>
																							<FaviconImage
																								src={faviconUrl}
																								alt={domainName}
																							/>
																							<span>{domainName}</span>
																						</span>
																					);
																				}
																				return <span key={index}>{part}</span>;
																			})}
																		</>
																	);
																}
															}
															return item.description;
														})()}
													</ItemDescription>
												</WishlistItem>
												{item.url &&
													(item.previewImage ||
													item.previewTitle ||
													item.previewDescription ? (
														<PreviewCard
															href={item.url}
															target="_blank"
															rel="noopener noreferrer"
														>
															<PreviewContentWrapper>
																{item.previewImage && (
																	<PreviewImage
																		src={item.previewImage}
																		alt={item.previewTitle || "Preview"}
																	/>
																)}
																<PreviewContent>
																	{item.previewTitle && (
																		<PreviewTitle>
																			{item.previewTitle}
																		</PreviewTitle>
																	)}
																	{item.previewDescription && (
																		<PreviewDescription>
																			{item.previewDescription}
																		</PreviewDescription>
																	)}
																</PreviewContent>
															</PreviewContentWrapper>
														</PreviewCard>
													) : (
														<FallbackLinkComponent url={item.url} />
													))}
											</WishlistItemContainer>
										))}
									</WishlistItemsList>
								) : (
									<EmptyWishlistText>
										No gift ideas have been added yet. Check back later!
									</EmptyWishlistText>
								)}
							</WishlistSection>
							<PrimaryButton onClick={() => router.push("/")}>
								<Home />
								Go Home
							</PrimaryButton>
						</>
					)}
				</MatchCard>
			</ContentWrapper>
		</MatchContainer>
	);
}
