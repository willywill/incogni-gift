"use client";

import styled from "styled-components";
import { useSession } from "@/app/lib/auth";

const DashboardContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const DashboardCard = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 8px;
  }
`;

const DashboardTitle = styled.h1`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const DashboardSubtitle = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  line-height: 1.6;
`;

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <DashboardContainer>
        <DashboardCard>
          <DashboardTitle>Loading...</DashboardTitle>
        </DashboardCard>
      </DashboardContainer>
    );
  }

  if (!session?.user) {
    return (
      <DashboardContainer>
        <DashboardCard>
          <DashboardTitle>Access Denied</DashboardTitle>
          <DashboardSubtitle>Please sign in to access your dashboard.</DashboardSubtitle>
        </DashboardCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardCard>
        <DashboardTitle>Welcome to your Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Manage your gift exchanges here. This page will be expanded with gift exchange management features.
        </DashboardSubtitle>
        {session.user.email && (
          <DashboardSubtitle style={{ marginTop: "1rem" }}>
            Signed in as: {session.user.email}
          </DashboardSubtitle>
        )}
      </DashboardCard>
    </DashboardContainer>
  );
}

