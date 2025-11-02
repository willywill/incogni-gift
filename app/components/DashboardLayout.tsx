"use client";

import styled from "styled-components";
import { Gift, Plus, Settings, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/lib/auth";

const DashboardWrapper = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: ${(props) => props.theme.lightMode.colors.background};

	@media (min-width: 768px) {
		flex-direction: row;
	}
`;

const Sidebar = styled.aside`
	display: none;
	width: 260px;
	border-right: 1px solid ${(props) => props.theme.lightMode.colors.border};
	background: ${(props) => props.theme.lightMode.colors.background};
	padding: 2rem 0;
	flex-shrink: 0;

	@media (min-width: 768px) {
		display: flex;
		flex-direction: column;
	}
`;

const SidebarHeader = styled.div`
	padding: 0 2rem 2rem 2rem;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
	margin-bottom: 2rem;
`;

const Brand = styled(Link)`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	cursor: pointer;
	letter-spacing: -0.01em;
	text-decoration: none;

	svg {
		width: 28px;
		height: 28px;
	}
`;

const NavList = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0 1rem;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 1rem;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	background: ${(props) =>
		props.$active ? props.theme.lightMode.colors.muted : "transparent"};
	cursor: pointer;
	transition: all 0.2s ease;
	letter-spacing: -0.01em;
	text-decoration: none;

	svg {
		width: 20px;
		height: 20px;
	}

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const NavButton = styled.button<{ $active?: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 1rem;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	background: ${(props) =>
		props.$active ? props.theme.lightMode.colors.muted : "transparent"};
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
	letter-spacing: -0.01em;
	width: 100%;
	text-align: left;

	svg {
		width: 20px;
		height: 20px;
	}

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const MainContent = styled.main`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding-bottom: 80px;

	@media (min-width: 768px) {
		padding-bottom: 0;
	}
`;

const ContentArea = styled.div`
	flex: 1;
	padding: 2rem;

	@media (min-width: 768px) {
		padding: 3rem;
	}
`;

const BottomNav = styled.nav`
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-top: 1px solid ${(props) => props.theme.lightMode.colors.border};
	padding: 0.75rem 0;
	z-index: 100;
	backdrop-filter: blur(8px);
	background: rgba(255, 255, 255, 0.95);

	@media (min-width: 768px) {
		display: none;
	}
`;

const BottomNavItem = styled(Link)<{ $active?: boolean }>`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.5rem;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.75rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;

	svg {
		width: 22px;
		height: 22px;
	}

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const BottomNavButton = styled.button<{ $active?: boolean }>`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.5rem;
	border-radius: 8px;
	font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.75rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
	background: transparent;

	svg {
		width: 22px;
		height: 22px;
	}

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

interface DashboardLayoutProps {
	children: React.ReactNode;
	onCreateClick?: () => void;
}

export default function DashboardLayout({ children, onCreateClick }: DashboardLayoutProps) {
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		const isBypassMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
		
		if (isBypassMode) {
			// For bypass mode, clear the session cookie via API
			try {
				await fetch("/api/auth/sign-out-bypass", {
					method: "POST",
				});
			} catch (error) {
				console.error("Error signing out in bypass mode:", error);
			}
		} else {
			// For normal mode, use better-auth signOut
			try {
				await signOut();
			} catch (error) {
				console.error("Error signing out:", error);
			}
		}
		
		// Redirect to home page
		router.push("/");
	};

	return (
		<DashboardWrapper>
			<Sidebar>
				<SidebarHeader>
					<Brand href="/dashboard">
						<Gift />
						<span>IncogniGift</span>
					</Brand>
				</SidebarHeader>
				<NavList>
					<NavItem href="/dashboard" $active={pathname === "/dashboard"}>
						<Gift />
						<span>Exchanges</span>
					</NavItem>
					{onCreateClick ? (
						<NavButton onClick={onCreateClick} $active={false}>
							<Plus />
							<span>Create</span>
						</NavButton>
					) : (
						<NavItem href="/dashboard/create" $active={pathname === "/dashboard/create"}>
							<Plus />
							<span>Create</span>
						</NavItem>
					)}
					<NavItem href="/dashboard/settings" $active={pathname === "/dashboard/settings"}>
						<Settings />
						<span>Settings</span>
					</NavItem>
					<NavButton onClick={handleSignOut} $active={false}>
						<LogOut />
						<span>Sign Out</span>
					</NavButton>
				</NavList>
			</Sidebar>

			<MainContent>
				<ContentArea>{children}</ContentArea>
			</MainContent>

			<BottomNav>
				<BottomNavItem href="/dashboard" $active={pathname === "/dashboard"}>
					<Gift />
					<span>Exchanges</span>
				</BottomNavItem>
				{onCreateClick ? (
					<BottomNavButton onClick={onCreateClick} $active={false}>
						<Plus />
						<span>Create</span>
					</BottomNavButton>
				) : (
					<BottomNavItem href="/dashboard/create" $active={pathname === "/dashboard/create"}>
						<Plus />
						<span>Create</span>
					</BottomNavItem>
				)}
				<BottomNavItem href="/dashboard/settings" $active={pathname === "/dashboard/settings"}>
					<Settings />
					<span>Settings</span>
				</BottomNavItem>
				<BottomNavButton onClick={handleSignOut} $active={false}>
					<LogOut />
					<span>Sign Out</span>
				</BottomNavButton>
			</BottomNav>
		</DashboardWrapper>
	);
}

