"use client";

import styled from "styled-components";
import { Gift } from "lucide-react";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${(props) => props.theme.lightMode.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  margin-left: 3rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const CTAButton = styled.button`
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

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
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 2.5rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroCTA = styled.button`
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

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
      <HeaderWrapper>
        <Nav>
          <Brand>
            <Gift />
            <span>IncogniGift</span>
          </Brand>
          <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#about">About</NavLink>
          </NavLinks>
          <CTAButton>Get Started</CTAButton>
        </Nav>
      </HeaderWrapper>
      <HeroSection id="hero">
        <HeroTitle>Anonymous gift pairing made simple</HeroTitle>
        <HeroSubtitle>
          Secret matches, unforgettable surprises. A little mystery. A lot of joy. 🎁✨
        </HeroSubtitle>
        <HeroCTA>Start Your Gift Exchange</HeroCTA>
      </HeroSection>
    </>
  );
}

