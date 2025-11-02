"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styled from "styled-components";
import { User } from "lucide-react";
import { getVisitorId } from "@/app/lib/fingerprint";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const RegisterCard = styled.div`
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

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const RegisterTitle = styled.h1`
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

const RegisterSubtitle = styled.p`
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

const ErrorMessage = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) => props.theme.lightMode.colors.error || "#fee2e2"};
  color: ${(props) => props.theme.lightMode.colors.errorText || "#991b1b"};
  border: 1px solid ${(props) => props.theme.lightMode.colors.errorBorder || "#fecaca"};
`;

const ExchangeInfo = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ExchangeInfoText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
`;

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const exchangeId = params?.id as string;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchange, setExchange] = useState<{
    name: string;
    spendingLimit: number;
    currency: string;
    status: string;
  } | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(true);
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    if (!exchangeId) {
      router.push("/join");
      return;
    }

    // Get visitor ID on mount
    getVisitorId()
      .then((id) => {
        setVisitorId(id);
      })
      .catch((err) => {
        console.error("Error getting visitor ID:", err);
      });

    // Fetch exchange details to check status
    const fetchExchange = async () => {
      try {
        const response = await fetch(`/api/gift-exchanges/${exchangeId}`);
        if (response.ok) {
          const data = await response.json();
          setExchange({
            name: data.name,
            spendingLimit: data.spendingLimit,
            currency: data.currency,
            status: data.status,
          });
        } else {
          setError("Exchange not found");
        }
      } catch (err) {
        console.error("Error fetching exchange:", err);
        setError("Failed to load exchange details");
      } finally {
        setExchangeLoading(false);
      }
    };

    fetchExchange();
  }, [exchangeId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if exchange has started
    if (exchange?.status === "started") {
      setError("This exchange has already started. Registration is closed.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exchangeId,
          firstName: firstName.trim(),
          lastName: lastName.trim() || null,
          visitorId: visitorId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "An error occurred while registering. Please try again.");
        setLoading(false);
        return;
      }

      const participant = await response.json();
      // Redirect to wishlist page with participant ID
      router.push(`/exchange/${exchangeId}/wishlist?participantId=${participant.id}`);
    } catch (error) {
      console.error("Error registering participant:", error);
      setError("An error occurred while registering. Please try again.");
      setLoading(false);
    }
  };

  const isExchangeStarted = exchange?.status === "started";
  const isDisabled = isExchangeStarted || loading || exchangeLoading;

  if (exchangeLoading) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <RegisterHeader>
            <RegisterTitle>Loading...</RegisterTitle>
          </RegisterHeader>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Join the Exchange</RegisterTitle>
          <RegisterSubtitle>
            {isExchangeStarted
              ? "This exchange has already started"
              : "Enter your name to join the gift exchange"}
          </RegisterSubtitle>
        </RegisterHeader>

        {exchange && (
          <ExchangeInfo>
            <strong style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif", fontSize: "0.9375rem", color: "inherit" }}>
              {exchange.name}
            </strong>
            <ExchangeInfoText>
              Spending Limit: {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: exchange.currency,
              }).format(exchange.spendingLimit)}
            </ExchangeInfoText>
          </ExchangeInfo>
        )}

        {isExchangeStarted && (
          <ErrorMessage style={{ marginBottom: "1.5rem" }}>
            This exchange has already started. Registration is closed.
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="firstName">First Name *</Label>
            <InputWrapper>
              <InputIcon>
                <User />
              </InputIcon>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isDisabled}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="lastName">Last Name (Optional)</Label>
            <InputWrapper>
              <InputIcon>
                <User />
              </InputIcon>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isDisabled}
              />
            </InputWrapper>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isDisabled || !firstName.trim()}>
            {loading ? "Joining..." : "Continue"}
          </SubmitButton>
        </Form>
      </RegisterCard>
    </RegisterContainer>
  );
}

