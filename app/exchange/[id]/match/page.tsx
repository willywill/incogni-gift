"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Gift } from "lucide-react";
import { getVisitorId } from "@/app/lib/fingerprint";

const MatchContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
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
    border-radius: 8px;
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
  margin: 0;
  line-height: 1.6;
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

const WishlistItem = styled.li`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  line-height: 1.6;
`;

const EmptyWishlistText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-align: center;
  padding: 2rem;
  margin: 0;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    if (!exchangeId || !participantId) {
      router.push("/join");
      return;
    }

    // Fetch match's wishlist items
    const fetchMatchData = async (vid: string | null) => {
      try {
        setLoading(true);
        setError(null);

        const url = `/api/participants/${participantId}/match${vid ? `?visitorId=${encodeURIComponent(vid)}` : ""}`;
        const response = await fetch(url);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load match information");
        }

        const data = await response.json();
        setWishlistItems(data.wishlistItems || []);
        setSpendingLimit(data.exchangeInfo?.spendingLimit || null);
        setCurrency(data.exchangeInfo?.currency || "USD");
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

  if (loading) {
    return (
      <MatchContainer>
        <MatchCard>
          <LoadingText>Loading your match&apos;s gift ideas...</LoadingText>
        </MatchCard>
      </MatchContainer>
    );
  }

  return (
    <MatchContainer>
      <MatchCard>
        <MatchHeader>
          <MatchTitle>
            <Gift />
            Your Gift Match
          </MatchTitle>
          <MatchSubtitle>
            Here are some gift ideas for the person you&apos;re giving to. Remember to keep it anonymous!
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
                <WishlistItem key={item.id}>{item.description}</WishlistItem>
              ))}
            </WishlistItemsList>
          ) : (
            <EmptyWishlistText>
              No gift ideas have been added yet. Check back later!
            </EmptyWishlistText>
          )}
        </WishlistSection>
      </MatchCard>
    </MatchContainer>
  );
}

