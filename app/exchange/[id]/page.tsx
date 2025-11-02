"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { Gift } from "lucide-react";

const ExchangeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const ExchangeCard = styled.div`
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

const ExchangeHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const ExchangeTitle = styled.h1`
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

const ExchangeSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const InfoLabel = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.125rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
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
`;

export default function ExchangePage() {
  const params = useParams();
  const exchangeId = params?.id as string;

  const [exchange, setExchange] = useState<{
    name: string;
    spendingLimit: number;
    currency: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exchangeId) return;

    const fetchExchange = async () => {
      try {
        const response = await fetch(`/api/gift-exchanges/${exchangeId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch exchange details");
        }

        const data = await response.json();
        setExchange({
          name: data.name,
          spendingLimit: data.spendingLimit,
          currency: data.currency,
        });
      } catch (err) {
        console.error("Error fetching exchange:", err);
        setError("Failed to load exchange details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExchange();
  }, [exchangeId]);

  if (loading) {
    return (
      <ExchangeContainer>
        <ExchangeCard>
          <ExchangeHeader>
            <LoadingText>Loading...</LoadingText>
          </ExchangeHeader>
        </ExchangeCard>
      </ExchangeContainer>
    );
  }

  if (error || !exchange) {
    return (
      <ExchangeContainer>
        <ExchangeCard>
          <ExchangeHeader>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {!error && <ErrorMessage>Exchange not found</ErrorMessage>}
          </ExchangeHeader>
        </ExchangeCard>
      </ExchangeContainer>
    );
  }

  return (
    <ExchangeContainer>
      <ExchangeCard>
        <ExchangeHeader>
          <ExchangeTitle>
            <Gift />
            {exchange.name}
          </ExchangeTitle>
          <ExchangeSubtitle>
            You have successfully joined this gift exchange
          </ExchangeSubtitle>
        </ExchangeHeader>

        <InfoSection>
          <InfoItem>
            <InfoLabel>Spending Limit</InfoLabel>
            <InfoValue>
              {exchange.currency} {exchange.spendingLimit}
            </InfoValue>
          </InfoItem>
        </InfoSection>
      </ExchangeCard>
    </ExchangeContainer>
  );
}

