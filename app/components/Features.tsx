"use client";

import styled from "styled-components";
import { Lock, Gift, Shield, Sparkles, Eye } from "lucide-react";

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  background: ${(props) => props.theme.lightMode.colors.muted};

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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: ${(props) => props.theme.lightMode.colors.background};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.lightMode.colors.gray300};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const FeatureTitle = styled.h3`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.7;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const features = [
  {
    icon: Lock,
    title: "Flexible Anonymity",
    description: "By default, identities stay secret until the big reveal. Creators can optionally enable a mode where participants see who they're buying gifts for right away.",
  },
  {
    icon: Shield,
    title: "Zero Personal Info Exposed",
    description: "Your privacy is our priority. Share interests without sharing identity. Your match partner never sees your personal information.",
  },
  {
    icon: Sparkles,
    title: "Clean & Modern UI",
    description: "Enjoy a beautiful, intuitive interface designed to make your gift exchange experience delightful and effortless.",
  },
  {
    icon: Eye,
    title: "Controlled Reveal",
    description: "Exchange creators have full control over anonymity settings. Choose whether to keep identities secret or show recipient names immediately after matching.",
  },
];

export default function Features() {
  return (
    <FeaturesSection id="features">
      <SectionTitle>Everything you need for the perfect gift exchange</SectionTitle>
      <SectionSubtitle>
        Thoughtfully designed features that make anonymous gifting fun, secure, and memorable.
      </SectionSubtitle>
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <IconWrapper>
              <feature.icon />
            </IconWrapper>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesSection>
  );
}

