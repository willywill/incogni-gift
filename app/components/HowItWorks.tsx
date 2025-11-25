"use client";

import styled from "styled-components";
import { UserPlus, Users, Heart, Gift } from "lucide-react";
import * as motion from "motion/react-client";

const HowItWorksSection = styled.section`
  background: ${(props) => props.theme.lightMode.colors.surface};
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const StepCard = styled.div`
  text-align: center;
`;

const StepNumber = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  transition: all 0.3s ease;

  svg {
    width: 28px;
    height: 28px;
  }
  
  ${StepCard}:hover & {
    background: ${(props) => props.theme.lightMode.colors.accentLight};
  }
`;

const StepTitle = styled.h3`
  font-family: var(--font-playfair), Georgia, serif;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
`;

const StepDescription = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.6;
  margin: 0;
`;

const steps = [
	{
		icon: UserPlus,
		title: "Create",
		description:
			"Set up your exchange with spending limits and privacy settings.",
	},
	{
		icon: Users,
		title: "Invite",
		description: "Share your link. Participants join without needing accounts.",
	},
	{
		icon: Heart,
		title: "Match",
		description: "Our algorithm pairs everyone anonymously.",
	},
	{
		icon: Gift,
		title: "Reveal",
		description: "When the time comes, discover who had who!",
	},
];

const headerVariants = {
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

const stepsContainerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.2,
		},
	},
};

const stepVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const stepIconVariants = {
	hidden: { scale: 0, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 20,
		},
	},
};

export default function HowItWorks() {
	return (
		<HowItWorksSection id="how-it-works">
			<Container>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={headerVariants}
				>
					<SectionHeader>
						<SectionLabel>How It Works</SectionLabel>
						<SectionTitle>Simple from start to finish</SectionTitle>
						<SectionSubtitle>
							Get your gift exchange running in minutes.
						</SectionSubtitle>
					</SectionHeader>
				</motion.div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					variants={stepsContainerVariants}
				>
					<StepsContainer>
						{steps.map((step, index) => (
							<motion.div key={index} variants={stepVariants}>
								<StepCard>
									<motion.div
										variants={stepIconVariants}
										whileHover={{
											scale: 1.1,
											transition: {
												type: "spring",
												stiffness: 400,
												damping: 10,
											},
										}}
									>
										<StepNumber>
											<step.icon />
										</StepNumber>
									</motion.div>
									<StepTitle>{step.title}</StepTitle>
									<StepDescription>{step.description}</StepDescription>
								</StepCard>
							</motion.div>
						))}
					</StepsContainer>
				</motion.div>
			</Container>
		</HowItWorksSection>
	);
}
