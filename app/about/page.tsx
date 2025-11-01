"use client";

import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Heart, Code, Users } from "lucide-react";

const AboutSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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

const StorySection = styled.div`
  margin-bottom: 4rem;
`;

const StoryTitle = styled.h2`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1.5rem 0;
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

const StoryText = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.0625rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  line-height: 1.8;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  letter-spacing: -0.01em;

  p {
    margin: 0 0 1.5rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const OriginSection = styled.div`
  background: ${(props) => props.theme.lightMode.colors.muted};
  border-radius: 12px;
  padding: 2.5rem;
  margin-bottom: 4rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const OriginTitle = styled.h3`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const OriginText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

const CreatorSection = styled.div`
  text-align: center;
  padding: 2.5rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const CreatorTitle = styled.h3`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
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
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.lightMode.colors.foreground};
  }
`;

const CreatorText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.01em;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutSection>
        <PageTitle>About IncogniGift</PageTitle>
        <PageSubtitle>
          A digital reimagining of a cherished family tradition
        </PageSubtitle>

        <ContentWrapper>
          <StorySection>
            <StoryTitle>
              <Heart />
              Our Story
            </StoryTitle>
            <StoryText>
              <p>
                Every year for Thanksgiving, our family prepares for the holidays by
                saying we want to participate in the upcoming gift giving during the
                Christmas season. We write our names down and some gifts or gift cards
                we&apos;d like to receive, and put our names into a hat.
              </p>
              <p>
                My aunt would administer the gift exchange, and we&apos;d draw a name.
                The others wouldn&apos;t know that we have them and we&apos;re buying
                their gift. Then during Christmas, we&apos;d do the big reveal and go
                through the names and receive our gifts from our anonymous gift giver.
              </p>
              <p>
                This app embodies our tradition—bringing that same magic, anticipation,
                and joy to families and groups everywhere, all while making the process
                easier and more seamless than ever before.
              </p>
            </StoryText>
          </StorySection>

          <OriginSection>
            <OriginTitle>
              <Users />
              The Digital Evolution
            </OriginTitle>
            <OriginText>
              What started as a simple paper-and-hat tradition has evolved into a modern,
              secure platform that preserves the anonymity and excitement of the
              original experience. IncogniGift digitizes this family tradition, making
              it accessible to families and groups who want to maintain the mystery and
              magic of anonymous gift giving, no matter where they are.
            </OriginText>
          </OriginSection>

          <CreatorSection>
            <CreatorTitle>
              <Code />
              Built with Care
            </CreatorTitle>
            <CreatorText>
              I&apos;m a software engineer with 14 years of experience, and I wanted to
              make this process easier for my family. What began as a personal project
              to streamline our own gift exchange has grown into something I&apos;m
              excited to share with others who value the same tradition of anonymous
              giving and surprise.
            </CreatorText>
          </CreatorSection>
        </ContentWrapper>
      </AboutSection>
      <Footer />
    </main>
  );
}

