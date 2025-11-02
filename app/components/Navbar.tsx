"use client";

import styled from "styled-components";
import Link from "next/link";
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

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  cursor: pointer;
  letter-spacing: -0.01em;
  text-decoration: none;
  
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

const NavLinkNext = styled(Link)`
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-decoration: none;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  letter-spacing: -0.01em;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const CTAButton = styled(Link)`
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Navbar() {
  return (
    <HeaderWrapper>
      <Nav>
        <Brand href="/">
          <Gift />
          <span>IncogniGift</span>
        </Brand>
        <NavLinks>
          <NavLinkNext href="/#features">Features</NavLinkNext>
          <NavLinkNext href="/#how-it-works">How It Works</NavLinkNext>
          <NavLinkNext href="/about">About</NavLinkNext>
          <NavLinkNext href="/support">Support</NavLinkNext>
        </NavLinks>
        <CTAButton href="/start">Get Started</CTAButton>
      </Nav>
    </HeaderWrapper>
  );
}

