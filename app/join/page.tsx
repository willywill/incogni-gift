"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { User, Key, Gift } from "lucide-react";
import { getVisitorId } from "@/app/lib/fingerprint";

const JoinContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const JoinCard = styled.div`
  width: 100%;
  max-width: 480px;
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

const JoinHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const JoinTitle = styled.h1`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const JoinSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  letter-spacing: -0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  background: ${(props) => props.theme.lightMode.colors.background};
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: ${(props) => props.theme.lightMode.colors.secondary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
`;

const ConfirmationScreen = styled.div`
  text-align: center;
`;

const ExchangeName = styled.h2`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
`;

const ConfirmationQuestion = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.foreground};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.lightMode.colors.muted};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(Message)`
  background: ${(props) => props.theme.lightMode.colors.error || "#fee2e2"};
  color: ${(props) => props.theme.lightMode.colors.errorText || "#991b1b"};
  border-color: ${(props) => props.theme.lightMode.colors.errorBorder || "#fecaca"};
`;

const ReturningParticipantSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
`;

const ReturningParticipantTitle = styled.h2`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
`;

const ReturningParticipantText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const ExchangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ExchangeListItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    background: ${(props) => props.theme.lightMode.colors.muted};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
    flex-shrink: 0;
  }
`;

const ExchangeListItemContent = styled.div`
  flex: 1;
`;

const ExchangeListItemName = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin-bottom: 0.25rem;
`;

const ExchangeListItemParticipant = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
`;

interface ReturningExchange {
  participantId: string;
  participantName: string;
  exchangeId: string;
  exchangeName: string;
}

export default function JoinPage() {
  const router = useRouter();
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [magicWord, setMagicWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundExchange, setFoundExchange] = useState<{ id: string; name: string } | null>(null);
  const [returningExchanges, setReturningExchanges] = useState<ReturningExchange[] | null>(null);
  const [checkingVisitor, setCheckingVisitor] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setFoundExchange(null);

    try {
      const response = await fetch("/api/gift-exchanges/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName: organizerLastName.trim(),
          magicWord: magicWord.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "No exchange found matching the provided information");
        setLoading(false);
        return;
      }

      const exchange = await response.json();
      setFoundExchange({
        id: exchange.id,
        name: exchange.name,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error looking up exchange:", error);
      setError("An error occurred while looking up the exchange. Please try again.");
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (foundExchange) {
      router.push(`/exchange/${foundExchange.id}/register`);
    }
  };

  const handleTryAgain = () => {
    setFoundExchange(null);
    setError(null);
    setMessage(null);
    setOrganizerLastName("");
    setMagicWord("");
  };

  useEffect(() => {
    // Check for returning participant on mount
    const checkReturningParticipant = async () => {
      try {
        const visitorId = await getVisitorId();
        const response = await fetch("/api/participants/lookup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.found && data.exchanges.length > 0) {
            setReturningExchanges(data.exchanges);
          }
        }
      } catch (err) {
        console.error("Error checking returning participant:", err);
      } finally {
        setCheckingVisitor(false);
      }
    };

    checkReturningParticipant();
  }, []);

  const handleExchangeSelect = (exchange: ReturningExchange) => {
    // Redirect to match view page if exchange has started
    router.push(`/exchange/${exchange.exchangeId}/match?participantId=${exchange.participantId}`);
  };

  const handleUseDifferentInfo = () => {
    setReturningExchanges(null);
  };

  // Show returning participant screen if found
  if (returningExchanges && returningExchanges.length > 0 && !foundExchange) {
    return (
      <JoinContainer>
        <JoinCard>
          <JoinHeader>
            <JoinTitle>Welcome Back!</JoinTitle>
            <JoinSubtitle>
              Hey {returningExchanges[0].participantName}, it looks like you&apos;re returning!
            </JoinSubtitle>
          </JoinHeader>

          <ReturningParticipantSection>
            <ReturningParticipantTitle>Your Gift Exchanges</ReturningParticipantTitle>
            <ReturningParticipantText>
              Select an exchange to view your match and gift ideas:
            </ReturningParticipantText>
            <ExchangeList>
              {returningExchanges.map((exchange) => (
                <ExchangeListItem
                  key={`${exchange.exchangeId}-${exchange.participantId}`}
                  onClick={() => handleExchangeSelect(exchange)}
                >
                  <Gift />
                  <ExchangeListItemContent>
                    <ExchangeListItemName>{exchange.exchangeName}</ExchangeListItemName>
                    <ExchangeListItemParticipant>As {exchange.participantName}</ExchangeListItemParticipant>
                  </ExchangeListItemContent>
                </ExchangeListItem>
              ))}
            </ExchangeList>
          </ReturningParticipantSection>

          <ButtonGroup>
            <SecondaryButton onClick={handleUseDifferentInfo}>
              Use Different Information
            </SecondaryButton>
          </ButtonGroup>
        </JoinCard>
      </JoinContainer>
    );
  }

  // Show confirmation screen if exchange was found
  if (foundExchange) {
    return (
      <JoinContainer>
        <JoinCard>
          <JoinHeader>
            <JoinTitle>Join a Gift Exchange</JoinTitle>
          </JoinHeader>

          <ConfirmationScreen>
            <ExchangeName>{foundExchange.name}</ExchangeName>
            <ConfirmationQuestion>Does this look right?</ConfirmationQuestion>

            <ButtonGroup>
              <SubmitButton onClick={handleContinue}>
                Continue
              </SubmitButton>
              <SecondaryButton onClick={handleTryAgain}>
                Try Again
              </SecondaryButton>
            </ButtonGroup>
          </ConfirmationScreen>
        </JoinCard>
      </JoinContainer>
    );
  }

  // Show loading while checking visitor
  if (checkingVisitor) {
    return (
      <JoinContainer>
        <JoinCard>
          <JoinHeader>
            <JoinTitle>Loading...</JoinTitle>
          </JoinHeader>
        </JoinCard>
      </JoinContainer>
    );
  }

  return (
    <JoinContainer>
      <JoinCard>
        <JoinHeader>
          <JoinTitle>Join or View a Gift Exchange</JoinTitle>
          <JoinSubtitle>
            Enter the organizer&apos;s information to find, join, or view an existing exchange
          </JoinSubtitle>
        </JoinHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="organizerLastName">Organizer&apos;s Last Name</Label>
            <InputWrapper>
              <InputIcon>
                <User />
              </InputIcon>
              <Input
                id="organizerLastName"
                type="text"
                placeholder="Smith"
                value={organizerLastName}
                onChange={(e) => setOrganizerLastName(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="magicWord">Magic Word</Label>
            <InputWrapper>
              <InputIcon>
                <Key />
              </InputIcon>
              <Input
                id="magicWord"
                type="text"
                placeholder="Enter the magic word"
                value={magicWord}
                onChange={(e) => setMagicWord(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <Message>{message}</Message>}

          <SubmitButton type="submit" disabled={loading || !organizerLastName.trim() || !magicWord.trim()}>
            {loading ? "Finding exchange..." : "Find Exchange"}
          </SubmitButton>
        </Form>
      </JoinCard>
    </JoinContainer>
  );
}

