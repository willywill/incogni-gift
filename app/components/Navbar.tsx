"use client";

import styled from "styled-components";
import Link from "next/link";
import { Gift } from "lucide-react";
import * as motion from "motion/react-client";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${(props) => props.theme.lightMode.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.borderLight};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
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
  font-family: var(--font-playfair), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  cursor: pointer;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.lightMode.colors.primary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex: 1;
  margin-left: 3rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinkNext = styled(Link)`
  color: ${(props) => props.theme.lightMode.colors.secondary};
  text-decoration: none;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
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
  background: ${(props) => props.theme.lightMode.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${(props) => props.theme.lightMode.radii.lg};
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const navVariants = {
	hidden: { opacity: 0, y: -10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

const linkVariants = {
	hidden: { opacity: 0, y: -10 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.1 + i * 0.05,
			duration: 0.4,
			ease: [0.22, 1, 0.36, 1],
		},
	}),
};

const navLinks = [
	{ href: "/#features", label: "Features" },
	{ href: "/#how-it-works", label: "How It Works" },
	{ href: "/about", label: "About" },
	{ href: "/support", label: "Support" },
];

export default function Navbar() {
	return (
		<HeaderWrapper>
			<motion.div initial="hidden" animate="visible" variants={navVariants}>
				<Nav>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Brand href="/">
							<Gift />
							<span>IncogniGift</span>
						</Brand>
					</motion.div>
					<NavLinks>
						{navLinks.map((link, i) => (
							<motion.div
								key={link.href}
								custom={i}
								initial="hidden"
								animate="visible"
								variants={linkVariants}
								whileHover={{ y: -2 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<NavLinkNext href={link.href}>{link.label}</NavLinkNext>
							</motion.div>
						))}
					</NavLinks>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						<CTAButton href="/start">Start Gifting</CTAButton>
					</motion.div>
				</Nav>
			</motion.div>
		</HeaderWrapper>
	);
}
