"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Gift, Users } from "lucide-react";

const StartContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const StartCard = styled.div`
  width: 100%;
  max-width: 640px;
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

const StartHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const StartTitle = styled.h1`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const StartSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    background: ${(props) => props.theme.lightMode.colors.muted};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
    flex-shrink: 0;
  }
`;

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const OptionTitle = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  letter-spacing: -0.01em;
`;

const OptionDescription = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.5;
`;

export default function StartPage() {
	const router = useRouter();

	return (
		<StartContainer>
			<StartCard>
				<StartHeader>
					<StartTitle>Get Started</StartTitle>
					<StartSubtitle>
						Choose how you&apos;d like to get started with your gift exchange
					</StartSubtitle>
				</StartHeader>

				<OptionsContainer>
					<OptionButton onClick={() => router.push("/auth")}>
						<Gift />
						<OptionContent>
							<OptionTitle>Create or manage a gift exchange</OptionTitle>
							<OptionDescription>
								Set up a new gift exchange or access your existing ones.
								You&apos;ll need to sign in to manage exchanges.
							</OptionDescription>
						</OptionContent>
					</OptionButton>

					<OptionButton onClick={() => router.push("/join")}>
						<Users />
						<OptionContent>
							<OptionTitle>Join or view a gift exchange</OptionTitle>
							<OptionDescription>
								Enter the organizer&apos;s information to find, join, or view an
								existing gift exchange.
							</OptionDescription>
						</OptionContent>
					</OptionButton>
				</OptionsContainer>
			</StartCard>
		</StartContainer>
	);
}
