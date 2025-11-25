"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Gift, X } from "lucide-react";
import * as motion from "motion/react-client";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FooterWrapper = styled.footer`
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.mushroom};
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
  border-bottom: 1px solid rgba(235, 229, 222, 0.15);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-bottom: 2.5rem;
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
  font-family: var(--font-playfair), Georgia, serif;
  font-size: 1.375rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.background};
  letter-spacing: -0.01em;
  
  svg {
    width: 22px;
    height: 22px;
    color: ${(props) => props.theme.lightMode.colors.primary};
  }
`;

const BrandTagline = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: rgba(235, 229, 222, 0.7);
  line-height: 1.7;
  margin: 0;
  max-width: 300px;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ColumnTitle = styled.h4`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.accent};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FooterLinkButton = styled.button`
  color: rgba(235, 229, 222, 0.7);
  text-decoration: none;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: color 0.2s ease;
  width: fit-content;
  background: none;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  text-align: left;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.background};
  }
`;

const FooterLinkNext = styled(Link)`
  color: rgba(235, 229, 222, 0.7);
  text-decoration: none;
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  transition: color 0.2s ease;
  width: fit-content;
  padding: 0.25rem 0;

  &:hover {
    color: ${(props) => props.theme.lightMode.colors.background};
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
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  color: rgba(235, 229, 222, 0.5);
  font-size: 0.875rem;
`;

const CreatedBy = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  color: rgba(235, 229, 222, 0.5);
  font-size: 0.875rem;
  
  a {
    color: rgba(235, 229, 222, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${(props) => props.theme.lightMode.colors.background};
    }
  }
`;

const ModalOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(54, 50, 48, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  max-height: 85vh;
  background: ${(props) => props.theme.lightMode.colors.background};
  border-radius: ${(props) => props.theme.lightMode.radii.xl};
  padding: 0;
  box-shadow: ${(props) => props.theme.lightMode.shadows.xl};
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 768px) {
    width: 95vw;
    max-height: 90vh;
    border-radius: ${(props) => props.theme.lightMode.radii.xl} ${(props) => props.theme.lightMode.radii.xl} 0 0;
    top: auto;
    bottom: 0;
    transform: translate(-50%, 0);
  }
`;

const ModalHeader = styled.div`
  padding: 1.75rem 2rem;
  border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalTitle = styled(Dialog.Title)`
  font-family: var(--font-playfair), Georgia, serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0;
  letter-spacing: -0.02em;
`;

const ModalCloseButton = styled(Dialog.Close)`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.lightMode.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.surface};
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ModalText = styled.div`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.7;

  h2 {
    font-family: var(--font-playfair), Georgia, serif;
    font-size: 1.125rem;
    font-weight: 500;
    color: ${(props) => props.theme.lightMode.colors.foreground};
    margin: 2rem 0 0.75rem 0;
    padding-top: 1rem;
    border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
  }

  h2:first-of-type {
    margin-top: 1rem;
    padding-top: 0;
    border-top: none;
  }

  p {
    margin: 0 0 0.75rem 0;
  }

  a {
    color: ${(props) => props.theme.lightMode.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  
  strong {
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const footerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

const footerItemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
	const [termsModalOpen, setTermsModalOpen] = useState(false);

	const currentDate = "November 13, 2025";
	const contactEmail = "help@incognigift.com";

	return (
		<FooterWrapper>
			<FooterContent>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					variants={footerVariants}
				>
					<FooterTop>
						<motion.div variants={footerItemVariants}>
							<BrandSection>
								<Brand>
									<Gift />
									<span>IncogniGift</span>
								</Brand>
								<BrandTagline>
									Thoughtful gifts, effortlessly delivered. Anonymous matching,
									joyful surprises.
								</BrandTagline>
							</BrandSection>
						</motion.div>

						<motion.div variants={footerItemVariants}>
							<FooterColumn>
								<ColumnTitle>Product</ColumnTitle>
								<FooterLinkNext href="/#features">Features</FooterLinkNext>
								<FooterLinkNext href="/#how-it-works">
									How It Works
								</FooterLinkNext>
								<FooterLinkNext href="/about">About</FooterLinkNext>
								<FooterLinkNext href="/support">Support</FooterLinkNext>
							</FooterColumn>
						</motion.div>

						<motion.div variants={footerItemVariants}>
							<FooterColumn>
								<ColumnTitle>Legal</ColumnTitle>
								<FooterLinkButton
									type="button"
									onClick={(e) => {
										e.preventDefault();
										setPrivacyModalOpen(true);
									}}
								>
									Privacy Policy
								</FooterLinkButton>
								<FooterLinkButton
									type="button"
									onClick={(e) => {
										e.preventDefault();
										setTermsModalOpen(true);
									}}
								>
									Terms of Service
								</FooterLinkButton>
							</FooterColumn>
						</motion.div>
					</FooterTop>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					<FooterBottom>
						<Copyright>
							© {currentYear} IncogniGift. All rights reserved.
						</Copyright>
						<CreatedBy>
							Made by{" "}
							<a
								href="https://williamgermany.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								William Germany
							</a>
						</CreatedBy>
					</FooterBottom>
				</motion.div>
			</FooterContent>

			{/* Privacy Policy Modal */}
			<Dialog.Root open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Privacy Policy</ModalTitle>
						<ModalCloseButton asChild>
							<button>
								<X />
							</button>
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<ModalText>
							<p>
								<strong>Last updated: {currentDate}</strong>
							</p>
							<p>
								This app ("the Service") allows users to organize and
								participate in anonymous gift exchanges.
							</p>

							<h2>Information We Collect</h2>
							<p>
								When creating an exchange, we collect your name and email
								address.
							</p>
							<p>
								Participants do not need to log in or share personal
								information.
							</p>

							<h2>How We Use Information</h2>
							<p>
								Your email is used only to manage your exchange and send related
								notifications or magic links.
							</p>
							<p>
								We do not sell, rent, or share your information with third
								parties.
							</p>

							<h2>Cookies and Device Info</h2>
							<p>
								We may use basic cookies or browser storage to remember your
								exchange session.
							</p>
							<p>No tracking or analytics cookies are used.</p>

							<h2>Data Security</h2>
							<p>
								We take reasonable steps to protect your information from
								unauthorized access or disclosure.
							</p>

							<h2>Your Rights</h2>
							<p>
								You may request deletion of your exchange or your data at any
								time by contacting us at{" "}
								<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
							</p>

							<h2>Changes to This Policy</h2>
							<p>
								We may update this policy from time to time. The latest version
								will always be available on this page.
							</p>

							<h2>Contact</h2>
							<p>
								If you have questions about this policy, contact{" "}
								<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
							</p>
						</ModalText>
					</ModalBody>
				</ModalContent>
			</Dialog.Root>

			{/* Terms of Service Modal */}
			<Dialog.Root open={termsModalOpen} onOpenChange={setTermsModalOpen}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<ModalTitle>Terms of Service</ModalTitle>
						<ModalCloseButton asChild>
							<button>
								<X />
							</button>
						</ModalCloseButton>
					</ModalHeader>
					<ModalBody>
						<ModalText>
							<p>
								<strong>Last updated: {currentDate}</strong>
							</p>
							<p>
								By using this app ("the Service"), you agree to these terms.
							</p>

							<h2>Use of the Service</h2>
							<p>
								The Service is provided for organizing anonymous gift exchanges.
							</p>
							<p>
								You are responsible for the accuracy of any information you
								provide.
							</p>

							<h2>No Warranties</h2>
							<p>
								The Service is provided "as is" without warranties of any kind.
							</p>
							<p>
								We are not responsible for any lost gifts, missed deliveries, or
								disputes between participants.
							</p>

							<h2>Changes to the Service</h2>
							<p>
								We may modify or discontinue the Service at any time without
								notice.
							</p>

							<h2>Limitation of Liability</h2>
							<p>
								We are not liable for damages or losses arising from use of the
								Service.
							</p>

							<h2>Governing Law</h2>
							<p>
								These terms are governed by the laws of Ohio, United States.
							</p>

							<h2>Contact</h2>
							<p>
								For questions, contact{" "}
								<a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
							</p>
						</ModalText>
					</ModalBody>
				</ModalContent>
			</Dialog.Root>
		</FooterWrapper>
	);
}
