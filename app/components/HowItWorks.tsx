"use client";

import styled from "styled-components";
import { UserPlus, Users, Lightbulb, Gift } from "lucide-react";

const HowItWorksSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 4rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
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
    title: "Create Your Profile",
    description: "Sign up and share your interests, hobbies, and preferences to help us find the perfect match.",
  },
  {
    icon: Users,
    title: "Get Matched Anonymously",
    description: "Our algorithm pairs you with someone special while keeping both identities completely secret.",
  },
  {
    icon: Lightbulb,
    title: "Receive Smart Suggestions",
    description: "Get personalized gift ideas based on your match's interests without revealing who they are.",
  },
  {
    icon: Gift,
    title: "Exchange & Reveal",
    description: "Send the perfect gift and choose when to reveal your identity for that magical moment.",
  },
];

export default function HowItWorks() {
  return (
    <HowItWorksSection id="how-it-works">
      <SectionTitle>How It Works</SectionTitle>
      <SectionSubtitle>
        Four simple steps to create unforgettable gift exchange experiences
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

