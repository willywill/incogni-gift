"use client";

import styled from "styled-components";
import { Lock, Shield, Sparkles, Eye } from "lucide-react";
import * as motion from "motion/react-client";

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionLabel = styled.span`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.accent};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-playfair), Georgia, serif;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.0625rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FeatureCard = styled.div`
  background: ${(props) => props.theme.lightMode.colors.surface};
  padding: 2rem;
  border-radius: ${(props) => props.theme.lightMode.radii.xl};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.lightMode.shadows.lg};
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.accent};
  border-radius: ${(props) => props.theme.lightMode.radii.lg};
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
  font-family: var(--font-playfair), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.625rem 0;
  letter-spacing: -0.01em;
`;

const FeatureDescription = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.7;
  margin: 0;
`;

const features = [
	{
		icon: Lock,
		title: "Flexible Anonymity",
		description:
			"Identities stay secret until the reveal. Creators can optionally let participants see who they're buying for right away.",
	},
	{
		icon: Shield,
		title: "Privacy-First",
		description:
			"Share interests without sharing identity. Your match partner never sees your personal information.",
	},
	{
		icon: Sparkles,
		title: "Effortless Experience",
		description:
			"Beautiful, intuitive design that makes organizing gift exchanges simple and delightful.",
	},
	{
		icon: Eye,
		title: "Controlled Reveal",
		description:
			"Full control over anonymity settings. Choose when and how identities are revealed.",
	},
];

const sectionHeaderVariants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const gridVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.2,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 40, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

export default function Features() {
	return (
		<FeaturesSection id="features">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				variants={sectionHeaderVariants}
			>
				<SectionHeader>
					<SectionLabel>Features</SectionLabel>
					<SectionTitle>
						Everything you need for thoughtful exchanges
					</SectionTitle>
					<SectionSubtitle>
						Simple tools that make anonymous gifting secure and memorable.
					</SectionSubtitle>
				</SectionHeader>
			</motion.div>
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-50px" }}
				variants={gridVariants}
			>
				<FeaturesGrid>
					{features.map((feature, index) => (
						<motion.div key={index} variants={cardVariants}>
							<FeatureCard>
								<IconWrapper>
									<feature.icon />
								</IconWrapper>
								<FeatureTitle>{feature.title}</FeatureTitle>
								<FeatureDescription>{feature.description}</FeatureDescription>
							</FeatureCard>
						</motion.div>
					))}
				</FeaturesGrid>
			</motion.div>
		</FeaturesSection>
	);
}
