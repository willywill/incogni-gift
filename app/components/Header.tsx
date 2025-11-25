"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import { ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";

const HeroWrapper = styled.div`
  background: ${(props) => props.theme.lightMode.colors.background};
  min-height: 70vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem 8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  flex: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 4rem 2rem 5rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem 4rem;
  }
`;

const HeroContent = styled.div`
  @media (max-width: 968px) {
    order: 1;
  }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-playfair), Georgia, serif;
  font-size: clamp(2.75rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1.15;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;

  em {
    font-style: italic;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.125rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 2.5rem 0;
  max-width: 480px;
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 968px) {
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroCTA = styled(Link)`
  background: ${(props) => props.theme.lightMode.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: ${(props) => props.theme.lightMode.radii.lg};
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.primaryHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const HeroVisual = styled.div`
  background: ${(props) => props.theme.lightMode.colors.surface};
  border-radius: ${(props) => props.theme.lightMode.radii.xl};
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 968px) {
    order: 0;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }
`;

const HeroImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const TrustIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
  flex-wrap: wrap;
  
  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  font-weight: 500;
`;

const TrustDot = styled.span`
  width: 6px;
  height: 6px;
  background: ${(props) => props.theme.lightMode.colors.accent};
  border-radius: 50%;
`;

const heroContentVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.1,
		},
	},
};

const heroItemVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const visualVariants = {
	hidden: { opacity: 0, scale: 0.9, rotate: -3 },
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 0.8,
			ease: [0.22, 1, 0.36, 1],
			delay: 0.3,
		},
	},
};

const trustItemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
			delay: 0.8 + i * 0.1,
		},
	}),
};

export default function Header() {
	return (
		<>
			<Navbar />
			<HeroWrapper>
				<HeroSection id="hero">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={heroContentVariants}
					>
						<HeroContent>
							<motion.div variants={heroItemVariants}>
								<HeroTitle>
									Thoughtful gifts,
									<br />
									<em>effortlessly delivered.</em>
								</HeroTitle>
							</motion.div>

							<motion.div variants={heroItemVariants}>
								<HeroSubtitle>
									Create memorable gift exchanges with friends, family, or
									coworkers. Anonymous matching, simple participation, joyful
									surprises.
								</HeroSubtitle>
							</motion.div>

							<motion.div variants={heroItemVariants}>
								<HeroCTA href="/start">
									Start Gifting
									<ArrowRight />
								</HeroCTA>
							</motion.div>

							<TrustIndicators>
								{[
									"100% Free",
									"No sign-up for participants",
									"Privacy-first",
								].map((text, i) => (
									<motion.div
										key={text}
										custom={i}
										initial="hidden"
										animate="visible"
										variants={trustItemVariants}
									>
										<TrustItem>
											<TrustDot />
											<span>{text}</span>
										</TrustItem>
									</motion.div>
								))}
							</TrustIndicators>
						</HeroContent>
					</motion.div>

					<motion.div
						initial="hidden"
						animate="visible"
						variants={visualVariants}
					>
						<HeroVisual>
							<HeroImage
								src="/holiday-sample-pic.png"
								alt="Elegantly wrapped gifts with natural kraft paper and terracotta ribbons"
								width={600}
								height={450}
								priority
							/>
						</HeroVisual>
					</motion.div>
				</HeroSection>
			</HeroWrapper>
		</>
	);
}
