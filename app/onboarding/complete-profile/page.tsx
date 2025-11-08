"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useSession } from "@/app/lib/auth";
import { User } from "lucide-react";

const ProfileContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const ProfileCard = styled.div`
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

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const ProfileTitle = styled.h1`
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

const ProfileSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const InfoBox = styled.div`
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

const InfoText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
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

const Message = styled.div<{ $type: "success" | "error" }>`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) =>
    props.$type === "success"
      ? props.theme.lightMode.colors.muted
      : props.theme.lightMode.colors.muted};
  color: ${(props) =>
    props.$type === "success"
      ? props.theme.lightMode.colors.foreground
      : props.theme.lightMode.colors.foreground};
  border: 1px solid
    ${(props) =>
    props.$type === "success"
      ? props.theme.lightMode.colors.border
      : props.theme.lightMode.colors.border};
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const LoadingText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
`;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/auth");
      return;
    }

    // Check if user already has first and last name
    const checkProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const profile = await response.json();
          if (profile.firstName && profile.lastName) {
            // Profile already complete, redirect to dashboard
            router.push("/dashboard");
            return;
          }
          // Pre-fill if available
          if (profile.firstName) setFirstName(profile.firstName);
          if (profile.lastName) setLastName(profile.lastName);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setMessage({
        type: "error",
        text: "Please provide both first and last name.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  if (isPending || checkingProfile) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!session?.user) {
    return null; // Will redirect in useEffect
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>Complete Your Profile</ProfileTitle>
          <ProfileSubtitle>
            We need a few details to get you started
          </ProfileSubtitle>
        </ProfileHeader>

        <InfoBox>
          <InfoText>
            <strong>Note:</strong> Your last name will be used to look up gift exchanges. Make sure to use the same last name that the exchange organizer knows.
          </InfoText>
        </InfoBox>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
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
                disabled={loading}
                autoFocus
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
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
                required
                disabled={loading}
              />
            </InputWrapper>
          </FormGroup>

          {message && <Message $type={message.type}>{message.text}</Message>}

          <SubmitButton type="submit" disabled={loading || !firstName.trim() || !lastName.trim()}>
            {loading ? "Saving..." : "Continue"}
          </SubmitButton>
        </Form>
      </ProfileCard>
    </ProfileContainer>
  );
}

