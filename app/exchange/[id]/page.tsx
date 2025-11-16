"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";
import { Gift, Home } from "lucide-react";

const ExchangeContainer = styled.div`
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
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-width: 100%;
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

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2rem;
  width: 100%;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export default function ExchangePage() {
  const router = useRouter();
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
        <ContentWrapper>
          <ExchangeCard>
            <ExchangeHeader>
              <LoadingText>Loading...</LoadingText>
            </ExchangeHeader>
          </ExchangeCard>
        </ContentWrapper>
      </ExchangeContainer>
    );
  }

  if (error || !exchange) {
    return (
      <ExchangeContainer>
        <ContentWrapper>
          <ExchangeCard>
            <ExchangeHeader>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {!error && <ErrorMessage>Exchange not found</ErrorMessage>}
            </ExchangeHeader>
          </ExchangeCard>
        </ContentWrapper>
      </ExchangeContainer>
    );
  }

  return (
    <ExchangeContainer>
      <HeaderSection>
        {exchange.name && (
          <HeaderInfo>
            <HeaderLabel>Gift Exchange</HeaderLabel>
            <HeaderValue>{exchange.name}</HeaderValue>
          </HeaderInfo>
        )}
      </HeaderSection>

      <ContentWrapper>
        <ExchangeCard>
          <ExchangeHeader>
            <ExchangeTitle>
              <Gift />
              {exchange.name}
            </ExchangeTitle>
            <ExchangeSubtitle>
              You have successfully joined this gift exchange. We&apos;re waiting for the organizer to start the gift exchange.
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

          <PrimaryButton onClick={() => router.push("/")}>
            <Home />
            Go Home
          </PrimaryButton>
        </ExchangeCard>
      </ContentWrapper>
    </ExchangeContainer>
  );
}

