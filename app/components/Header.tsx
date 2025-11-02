"use client";

import styled from "styled-components";
import Link from "next/link";
import Navbar from "./Navbar";

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.08;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: -0.025em;
  }
`;

const HeroSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 2.5rem 0;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.65;
  }
`;

const HeroCTA = styled(Link)`
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Header() {
  return (
    <>
      <Navbar />
      <HeroSection id="hero">
        <HeroTitle>Anonymous gift pairing made simple</HeroTitle>
        <HeroSubtitle>
          Secret matches, unforgettable surprises. A little mystery. A lot of joy. 🎁✨
        </HeroSubtitle>
        <HeroCTA href="/start">Start Your Gift Exchange</HeroCTA>
      </HeroSection>
    </>
  );
}

