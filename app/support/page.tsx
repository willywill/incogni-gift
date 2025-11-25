"use client";

import { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, HelpCircle, ChevronDown } from "lucide-react";

const SupportSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: -0.025em;
  }
`;

const PageSubtitle = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  text-align: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0 0 4rem 0;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ContactSection = styled.div`
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 12px;
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const ContactTitle = styled.h2`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  svg {
    width: 28px;
    height: 28px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const ContactText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.0625rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.8;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const EmailLink = styled.a`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.foreground};
    color: ${(props) => props.theme.lightMode.colors.background};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FAQSection = styled.div`
  margin-bottom: 2rem;
`;

const FAQTitle = styled.h2`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 2.5rem 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 28px;
    height: 28px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${(props) => props.theme.lightMode.colors.background};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.lightMode.colors.gray300};
  }
`;

const FAQButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 1.5rem;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.muted};
  }
`;

const FAQQuestion = styled.h3`
  font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.4;
  flex: 1;
`;

const FAQIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${(props) => (props.$isOpen ? "0 1.5rem 1.5rem 1.5rem" : "0 1.5rem")};
`;

const FAQAnswerText = styled.p`
  font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

interface FAQ {
	question: string;
	answer: string;
}

const faqs: FAQ[] = [
	{
		question: "How does IncogniGift work?",
		answer:
			"IncogniGift digitizes the traditional secret gift exchange. Participants join a gift exchange, share their interests and gift preferences, and get anonymously matched with another participant. You'll receive gift suggestions based on your match's preferences while keeping identities secret until the big reveal.",
	},
	{
		question: "Do I need an account to participate?",
		answer:
			"Only the gift exchange creator needs an account to set up and manage the exchange. Other participants can join using a simple link or invitation. The creator administers the matching and manages the exchange throughout the process.",
	},
	{
		question: "How do magic links work?",
		answer:
			"Magic links are secure, passwordless authentication. When you sign up or sign in, we send a unique link to your email. Click the link to instantly access your account—no password required. Magic links are time-limited and single-use for security.",
	},
	{
		question: "Is my identity really kept secret?",
		answer:
			"Yes! IncogniGift is designed to maintain complete anonymity until you choose to reveal yourself. Your match partner will only see your interests and preferences, never your name or personal information. You control when and how to reveal your identity after the gift exchange.",
	},
	{
		question: "How do I create a gift exchange?",
		answer:
			"After creating an account, you can start a new gift exchange from your dashboard. You'll set a name for the exchange, add participants, and configure settings like spending limits and reveal dates. Once set up, you can invite participants and start the matching process.",
	},
	{
		question: "Can I participate in multiple gift exchanges?",
		answer:
			"Yes! You can create multiple exchanges and join as many as you'd like. Each exchange is independent, so you can have different exchanges for different groups—family, friends, coworkers, etc. All your exchanges are managed from your dashboard.",
	},
	{
		question: "What if I have technical issues?",
		answer:
			"If you encounter any technical problems or have questions about using IncogniGift, please reach out to us at help@incognigift.com. We're here to help and typically respond within 24-48 hours.",
	},
	{
		question: "Is IncogniGift free to use?",
		answer:
			"IncogniGift is designed to be accessible and easy to use. For details about pricing and features, please check our homepage or contact us at help@incognigift.com for more information.",
	},
];

function FAQItemComponent({
	faq,
	isOpen,
	onClick,
}: {
	faq: FAQ;
	isOpen: boolean;
	onClick: () => void;
}) {
	return (
		<FAQItem>
			<FAQButton $isOpen={isOpen} onClick={onClick} type="button">
				<FAQQuestion>{faq.question}</FAQQuestion>
				<FAQIcon $isOpen={isOpen}>
					<ChevronDown />
				</FAQIcon>
			</FAQButton>
			<FAQAnswer $isOpen={isOpen}>
				<FAQAnswerText>{faq.answer}</FAQAnswerText>
			</FAQAnswer>
		</FAQItem>
	);
}

export default function SupportPage() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<main>
			<Navbar />
			<SupportSection>
				<PageTitle>Support & Help</PageTitle>
				<PageSubtitle>
					We&apos;re here to help. Find answers to common questions or reach out
					directly.
				</PageSubtitle>

				<ContentWrapper>
					<ContactSection>
						<ContactTitle>
							<Mail />
							Get in Touch
						</ContactTitle>
						<ContactText>
							Have a question or need assistance? We&apos;d love to hear from
							you.
						</ContactText>
						<EmailLink href="mailto:help@incognigift.com">
							<Mail />
							help@incognigift.com
						</EmailLink>
					</ContactSection>

					<FAQSection>
						<FAQTitle>
							<HelpCircle />
							Frequently Asked Questions
						</FAQTitle>
						<FAQList>
							{faqs.map((faq, index) => (
								<FAQItemComponent
									key={index}
									faq={faq}
									isOpen={openIndex === index}
									onClick={() => toggleFAQ(index)}
								/>
							))}
						</FAQList>
					</FAQSection>
				</ContentWrapper>
			</SupportSection>
			<Footer />
		</main>
	);
}
