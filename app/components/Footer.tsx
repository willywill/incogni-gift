"use client";

import styled from "styled-components";
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
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.white};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const BrandTagline = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.lightMode.colors.gray500};
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ColumnTitle = styled.h4`
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
  font-size: 0.95rem;
  transition: color 0.2s ease;
  width: fit-content;

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
  color: ${(props) => props.theme.lightMode.colors.gray500};
`;

const CreatedBy = styled.div`
  color: ${(props) => props.theme.lightMode.colors.gray500};
  
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
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#how-it-works">How It Works</FooterLink>
            <FooterLink href="#about">About</FooterLink>
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

