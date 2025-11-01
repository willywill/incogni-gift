"use client";

import styled from "styled-components";
import Link from "next/link";
import { Gift } from "lucide-react";

const FooterWrapper = styled.footer`
  background: ${(props) => props.theme.lightMode.colors.gray950};
  color: ${(props) => props.theme.lightMode.colors.gray400};
  border-top: 1px solid ${(props) => props.theme.lightMode.colors.gray900};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem 1.5rem 1.5rem;
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.gray900};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 2rem;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.white};
  letter-spacing: -0.01em;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const BrandTagline = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.gray500};
  line-height: 1.7;
  margin: 0;
  max-width: 300px;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ColumnTitle = styled.h4`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.white};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterLink = styled.a`
  color: ${(props) => props.theme.lightMode.colors.gray400};
  text-decoration: none;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: color 0.2s ease;
  width: fit-content;
  letter-spacing: -0.01em;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.white};
  }
`;

const FooterLinkNext = styled(Link)`
  color: ${(props) => props.theme.lightMode.colors.gray400};
  text-decoration: none;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: color 0.2s ease;
  width: fit-content;
  letter-spacing: -0.01em;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.white};
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${(props) => props.theme.lightMode.colors.gray500};
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const CreatedBy = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  color: ${(props) => props.theme.lightMode.colors.gray500};
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  
  a {
    color: ${(props) => props.theme.lightMode.colors.gray300};
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${(props) => props.theme.lightMode.colors.white};
    }
  }
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterTop>
          <BrandSection>
            <Brand>
              <Gift />
              <span>IncogniGift</span>
            </Brand>
            <BrandTagline>
              Anonymous gift pairing made simple. Secret matches, unforgettable surprises.
            </BrandTagline>
          </BrandSection>

          <FooterColumn>
            <ColumnTitle>Product</ColumnTitle>
            <FooterLinkNext href="/#features">Features</FooterLinkNext>
            <FooterLinkNext href="/#how-it-works">How It Works</FooterLinkNext>
            <FooterLinkNext href="/about">About</FooterLinkNext>
            <FooterLinkNext href="/support">Support</FooterLinkNext>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Legal</ColumnTitle>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterColumn>
        </FooterTop>

        <FooterBottom>
          <Copyright>© {currentYear} IncogniGift. All rights reserved.</Copyright>
          <CreatedBy>
            Created by <a href="https://williamgermany.com" target="_blank" rel="noopener noreferrer">William Germany</a>
          </CreatedBy>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
}

