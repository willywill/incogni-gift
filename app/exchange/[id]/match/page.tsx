"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Gift, Check, Home } from "lucide-react";
import { getVisitorId } from "@/app/lib/fingerprint";
import ExchangeStepper from "@/app/components/ExchangeStepper";

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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HeaderValue = styled.span`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0;
  font-weight: 600;
`;

const WishlistSection = styled.div`
  margin-top: 2rem;
`;

const WishlistSectionTitle = styled.h2`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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

const WishlistItem = styled.li<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  line-height: 1.6;
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
  opacity: ${(props) => (props.$completed ? 0.6 : 1)};
`;

const ItemDescription = styled.span`
  flex: 1;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-align: center;
  padding: 2rem;
  margin: 0;
`;

const BottomNav = styled.nav`
  width: 100%;
  background: ${(props) => props.theme.lightMode.colors.background};
  border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
  padding: 2rem 1rem;
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.muted};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LoadingText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) => props.theme.lightMode.colors.error || "#fee2e2"};
  color: ${(props) => props.theme.lightMode.colors.errorText || "#991b1b"};
  border: 1px solid ${(props) => props.theme.lightMode.colors.errorBorder || "#fecaca"};
  margin-bottom: 1.5rem;
`;

interface WishlistItem {
  id: string;
  description: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [completingItemId, setCompletingItemId] = useState<string | null>(null);

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

        if (participantResponse.ok) {
          const participantData = await participantResponse.json();
          setParticipantName(`${participantData.firstName} ${participantData.lastName || ""}`.trim());
        }
      } catch (err) {
        console.error("Error fetching match data:", err);
        setError(err instanceof Error ? err.message : "Failed to load match information. Please try again.");
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

  const handleToggleComplete = async (itemId: string, currentCompleted: boolean) => {
    if (completingItemId || !participantId) return;

    setCompletingItemId(itemId);

    try {
      const response = await fetch(`/api/participants/${participantId}/match/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlistItemId: itemId,
          completed: !currentCompleted,
        }),
      });

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
            : item
        )
      );
    } catch (err) {
      console.error("Error toggling item completion:", err);
      setError(err instanceof Error ? err.message : "Failed to update item. Please try again.");
    } finally {
      setCompletingItemId(null);
    }
  };

  if (loading) {
    return (
      <MatchContainer>
        <ContentWrapper>
          <MatchCard>
            <LoadingText>Loading your match&apos;s gift ideas...</LoadingText>
          </MatchCard>
        </ContentWrapper>
      </MatchContainer>
    );
  }

  return (
    <MatchContainer>
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
          <MatchHeader>
            <MatchTitle>
              <Gift />
              Your Gift Match
            </MatchTitle>
            <MatchSubtitle>
              Here are some gift ideas your match suggested you get for them. Let the gifting begin!
            </MatchSubtitle>
          </MatchHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {spendingLimit !== null && (
            <SpendingLimit>
              <SpendingLimitText>
                Spending Limit: {new Intl.NumberFormat("en-US", {
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
                  <WishlistItem key={item.id} $completed={item.completed}>
                    <Checkbox
                      $checked={item.completed}
                      onClick={() => handleToggleComplete(item.id, item.completed)}
                      disabled={completingItemId === item.id}
                      aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {item.completed && <Check />}
                    </Checkbox>
                    <ItemDescription>{item.description}</ItemDescription>
                  </WishlistItem>
                ))}
              </WishlistItemsList>
            ) : (
              <EmptyWishlistText>
                No gift ideas have been added yet. Check back later!
              </EmptyWishlistText>
            )}
          </WishlistSection>
        </MatchCard>
      </ContentWrapper>

      <BottomNav>
        <HomeButton onClick={() => router.push("/")}>
          <Home />
          Home
        </HomeButton>
      </BottomNav>
    </MatchContainer>
  );
}

