"use client";

import styled from "styled-components";
import { UserPlus, Users, Heart, Gift } from "lucide-react";

const HowItWorksSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  text-align: center;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: -0.025em;
  }
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  text-align: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 4rem 0;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StepCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
  letter-spacing: -0.02em;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const StepTitle = styled.h3`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const StepDescription = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.7;
  margin: 0;
  max-width: 280px;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const ConnectorLine = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  width: calc(100% - 160px);
  height: 2px;
  background: ${(props) => props.theme.lightMode.colors.border};
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const steps = [
  {
    icon: UserPlus,
    title: "Create & Manage",
    description: "Create a gift exchange with just an email—no password needed. Manage everything, set spending limits, and control when to start and end.",
  },
  {
    icon: Users,
    title: "Easy Participation",
    description: "Participants join conveniently without needing an account. They simply add their interests and preferences.",
  },
  {
    icon: Heart,
    title: "Smart Anonymous Matching",
    description: "Participants are matched anonymously using our smart matching system with your defined spending limits.",
  },
  {
    icon: Gift,
    title: "Exchange & Reveal",
    description: "When the exchange ends, it's revealed who should receive the gifts. The surprise moment everyone's been waiting for!",
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksSection id="how-it-works">
      <SectionTitle>How It Works</SectionTitle>
      <SectionSubtitle>
        Simple and seamless gift exchange from creation to reveal
      </SectionSubtitle>
      <StepsContainer>
        {steps.map((step, index) => (
          <StepCard key={index}>
            <StepNumber>
              <IconWrapper>
                <step.icon />
              </IconWrapper>
            </StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepCard>
        ))}
      </StepsContainer>
    </HowItWorksSection>
  );
}

