"use client";

import { useState } from "react";
import styled from "styled-components";
import { User, Key } from "lucide-react";

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

export default function JoinPage() {
  const [organizerLastName, setOrganizerLastName] = useState("");
  const [magicWord, setMagicWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Placeholder for future backend integration
    // TODO: Implement exchange lookup when backend is ready
    setTimeout(() => {
      setMessage("Exchange lookup functionality will be available soon!");
      setLoading(false);
    }, 500);
  };

  return (
    <JoinContainer>
      <JoinCard>
        <JoinHeader>
          <JoinTitle>Join a Gift Exchange</JoinTitle>
          <JoinSubtitle>
            Enter the organizer&apos;s information to find and join an existing exchange
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

          {message && <Message>{message}</Message>}

          <SubmitButton type="submit" disabled={loading || !organizerLastName.trim() || !magicWord.trim()}>
            {loading ? "Finding exchange..." : "Find Exchange"}
          </SubmitButton>
        </Form>
      </JoinCard>
    </JoinContainer>
  );
}

