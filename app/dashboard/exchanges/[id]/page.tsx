"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import CreateExchangeWizard from "@/app/components/CreateExchangeWizard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import FallbackLinkComponent from "@/app/components/FallbackLink";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { QRCodeSVG } from "qrcode.react";
import {
	ArrowLeft,
	Users,
	Link as LinkIcon,
	QrCode,
	Edit,
	Trash2,
	Copy,
	Maximize2,
	X,
	Key,
	ChevronDown,
	ChevronUp,
	Check,
	Rocket,
	CheckCircle,
	Gift,
} from "lucide-react";
import {
	extractUrls,
	extractDomain,
	formatDomainName,
	getFaviconUrl,
} from "@/app/lib/link-preview-client";

const PageHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 2rem;

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const BackButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: transparent;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	padding: 0.5rem 0;
	border: none;
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	margin-bottom: 1rem;

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 18px;
		height: 18px;
	}
`;

const PageTitle = styled.h1`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 2rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.5rem 0;
	letter-spacing: -0.02em;

	@media (max-width: 768px) {
		font-size: 1.75rem;
	}
`;

const PageSubtitle = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;


const AccessDeniedContainer = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background: ${(props) => props.theme.lightMode.colors.background};
`;

const AccessDeniedCard = styled.div`
	width: 100%;
	max-width: 500px;
	background: ${(props) => props.theme.lightMode.colors.background};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 3rem 2rem;
	text-align: center;
`;

const AccessDeniedTitle = styled.h1`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.75rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	letter-spacing: -0.02em;
`;

const AccessDeniedText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const ErrorState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	text-align: center;
`;

const ErrorTitle = styled.h2`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 0.75rem 0;
	letter-spacing: -0.02em;
`;

const ErrorText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
	max-width: 400px;
`;

const TabsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`;

const TabsList = styled.div`
	display: flex;
	gap: 0.5rem;
	border-bottom: 1px solid ${(props) => props.theme.lightMode.colors.border};
	margin-bottom: 2rem;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 768px) {
		gap: 0.25rem;
	}
`;

const TabButton = styled.button<{ $active: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	border: none;
	border-bottom: 2px solid
		${(props) => (props.$active ? props.theme.lightMode.colors.foreground : "transparent")};
	background: transparent;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) =>
		props.$active
			? props.theme.lightMode.colors.foreground
			: props.theme.lightMode.colors.secondary};
	cursor: pointer;
	transition: all 0.2s ease;
	white-space: nowrap;
	margin-bottom: -1px;
	flex-shrink: 0;

	&:hover {
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 768px) {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		gap: 0.375rem;

		svg {
			width: 16px;
			height: 16px;
		}
	}
`;

const TabContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const SectionTitle = styled.h2`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.25rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const SectionDescription = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const Card = styled.div`
	background: ${(props) => props.theme.lightMode.colors.background};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 1.5rem;
`;

const ParticipantCount = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.125rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin-bottom: 1rem;
`;

const ParticipantList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const ParticipantItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.border};
		transform: translateY(-1px);
	}
`;

const ParticipantName = styled.span`
	font-weight: 500;
`;

const InviteLinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const CopySuccessMessage = styled.div`
	padding: 0.75rem 1rem;
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const LinkInputContainer = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: stretch;

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const LinkInput = styled.input`
	flex: 1;
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	border: none;
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	white-space: nowrap;

	svg {
		width: 18px;
		height: 18px;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

const PrimaryButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.primary};
	color: white;

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.lightMode.colors.primaryHover};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(192, 108, 85, 0.25);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const QrCodeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 2rem;
`;

const QrCodeWrapper = styled.div`
	width: 200px;
	height: 200px;
	border: 2px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	padding: 8px;
	background: ${(props) => props.theme.lightMode.colors.white};
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 100%;
		height: 100%;
	}
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const Label = styled.label`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	font-weight: 500;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const Input = styled.input`
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};

	&:focus {
		outline: none;
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const DangerButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.foreground};
	color: ${(props) => props.theme.lightMode.colors.background};

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.gray800};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: translateY(0);
	}
`;

const WarningText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

const QrModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.9);
	z-index: 1000;
`;

const QrModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 16px;
	padding: 3rem;
	z-index: 1001;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	max-width: 90vw;
	max-height: 90vh;

	@media (max-width: 768px) {
		padding: 2rem;
	}
`;

const QrModalCloseButton = styled(Dialog.Close)`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 24px;
		height: 24px;
	}
`;

const QrModalTitle = styled(Dialog.Title)`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
	text-align: center;
`;

const QrModalBrand = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-family: var(--font-playfair), Georgia, serif;
	font-size: 1.75rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	letter-spacing: -0.01em;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;

	svg {
		width: 32px;
		height: 32px;
		color: ${(props) => props.theme.lightMode.colors.primary};
	}
`;

const ParticipantModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

const ParticipantModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 16px;
	padding: 2rem;
	z-index: 1001;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 600px;
	width: 90vw;
	max-height: 80vh;
	overflow-y: auto;

	@media (max-width: 768px) {
		padding: 1.5rem;
	}
`;

const ParticipantModalCloseButton = styled(Dialog.Close)`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 24px;
		height: 24px;
	}
`;

const ParticipantModalTitle = styled(Dialog.Title)`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const WishlistItemsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const WishlistItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	line-height: 1.6;
`;

const WishlistItemDescription = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	line-height: 1.6;
`;

const PreviewCard = styled.a`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 0.75rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	background: ${(props) => props.theme.lightMode.colors.background};
	text-decoration: none;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
`;

const PreviewSource = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.8125rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
`;

const FaviconImage = styled.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
	flex-shrink: 0;
	display: inline-block;
	vertical-align: text-bottom;
	margin-left: 0.375rem;
	margin-right: 0.375rem;
	position: relative;
	top: 0.125em;
`;

const PreviewContentWrapper = styled.div`
	display: flex;
	gap: 0.75rem;
`;

const PreviewImage = styled.img`
	width: 80px;
	height: 80px;
	object-fit: cover;
	border-radius: 6px;
	flex-shrink: 0;
`;

const PreviewContent = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

const PreviewTitle = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
`;

const PreviewDescription = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.8125rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
`;


const EmptyWishlistText = styled.p`
	margin: 0;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	text-align: center;
	padding: 2rem;
`;

const QrCodeLargeWrapper = styled.div`
	width: 300px;
	height: 300px;
	border: 3px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 12px;
	padding: 12px;
	background: ${(props) => props.theme.lightMode.colors.white};
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 100%;
		height: 100%;
	}

	@media (max-width: 768px) {
		width: 280px;
		height: 280px;
	}
`;

const DeleteConfirmModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1000;
`;

const DeleteConfirmModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90vw;
	max-width: 500px;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 12px;
	padding: 2rem;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	z-index: 1001;

	@media (max-width: 768px) {
		width: 95vw;
		padding: 1.5rem;
	}
`;

const DeleteConfirmModalCloseButton = styled(Dialog.Close)`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;

const DeleteConfirmModalTitle = styled(Dialog.Title)`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0 0 1rem 0;
	letter-spacing: -0.02em;
`;

const DeleteConfirmModalDescription = styled(Dialog.Description)`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1.5rem 0;
	line-height: 1.6;
`;

const DeleteConfirmError = styled.div`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0 0 1rem 0;
	padding: 0.75rem 1rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 8px;
	border-left: 3px solid ${(props) => props.theme.lightMode.colors.foreground};
`;

const DeleteConfirmButtonContainer = styled.div`
	display: flex;
	gap: 0.75rem;
	justify-content: flex-end;
	margin-top: 0.5rem;

	@media (max-width: 768px) {
		flex-direction: column-reverse;
	}
`;

const SecondaryButton = styled(Button)`
	background: transparent;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};

	&:hover:not(:disabled) {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}
`;

const SelectRoot = styled(Select.Root)`
	width: 100%;
`;

const SelectTrigger = styled(Select.Trigger)`
	width: 100%;
	padding: 0.875rem 1rem;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	background: ${(props) => props.theme.lightMode.colors.background};
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	&[data-state="open"] {
		border-color: ${(props) => props.theme.lightMode.colors.foreground};
		box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
	}

	svg {
		width: 16px;
		height: 16px;
		color: ${(props) => props.theme.lightMode.colors.secondary};
	}
`;

const SelectValue = styled(Select.Value)`
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const SelectContent = styled(Select.Content)`
	overflow: hidden;
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	z-index: 1002;
`;

const SelectViewport = styled(Select.Viewport)`
	padding: 0.5rem;
`;

const SelectItem = styled(Select.Item)`
	padding: 0.75rem 1rem;
	border-radius: 6px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	outline: none;

	&[data-highlighted] {
		background: ${(props) => props.theme.lightMode.colors.muted};
	}

	svg {
		width: 16px;
		height: 16px;
	}
`;

const SelectScrollButton = styled(Select.ScrollUpButton)`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 25px;
	background: ${(props) => props.theme.lightMode.colors.background};
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: default;
`;

const StartExchangeButton = styled(Button)`
	background: ${(props) => props.theme.lightMode.colors.primary};
	color: white;
	font-size: 1rem;
	padding: 1rem 2rem;
	font-weight: 600;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.primaryHover};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(192, 108, 85, 0.25);
	}

	&:active {
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		width: 100%;
		margin-top: 1rem;
	}
`;

const EndedNotice = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem 1.5rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border: 1px solid ${(props) => props.theme.lightMode.colors.border};
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;

	@media (max-width: 768px) {
		width: 100%;
		margin-top: 1rem;
	}
`;

const EndedNoticeTitle = styled.div`
	font-size: 0.9375rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const EndedNoticeDate = styled.div`
	font-size: 0.875rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
`;

const StartExchangeModalOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
`;

const StartExchangeModalContent = styled(Dialog.Content)`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${(props) => props.theme.lightMode.colors.background};
	border-radius: 16px;
	padding: 2rem;
	z-index: 1001;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 600px;
	width: 90vw;
	max-height: 85vh;
	overflow-y: auto;

	@media (max-width: 768px) {
		padding: 1.5rem;
	}
`;

const StartExchangeModalCloseButton = styled(Dialog.Close)`
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.muted};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 24px;
		height: 24px;
	}
`;

const StartExchangeModalTitle = styled(Dialog.Title)`
	font-family: var(--font-playfair), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1.5rem;
	font-weight: 700;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
	letter-spacing: -0.02em;
`;

const StartExchangeSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

const StartExchangeSectionTitle = styled.h3`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 1rem;
	font-weight: 600;
	color: ${(props) => props.theme.lightMode.colors.foreground};
	margin: 0;
`;

const StartExchangeText = styled.p`
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	margin: 0;
	line-height: 1.6;
`;

const StartExchangeError = styled.div`
	padding: 1rem;
	border-radius: 8px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	background: ${(props) => (props.theme.lightMode.colors as any).error || "#fee2e2"};
	color: ${(props) => (props.theme.lightMode.colors as any).errorText || "#991b1b"};
	border: 1px solid ${(props) => (props.theme.lightMode.colors as any).errorBorder || "#fecaca"};
`;

const StartExchangeParticipantsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	max-height: 200px;
	overflow-y: auto;
`;

const StartExchangeParticipantItem = styled.div`
	padding: 0.5rem 0.75rem;
	background: ${(props) => props.theme.lightMode.colors.muted};
	border-radius: 6px;
	font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif;
	font-size: 0.9375rem;
	color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const StartExchangeButtonContainer = styled.div`
	display: flex;
	gap: 0.75rem;
	justify-content: flex-end;
	margin-top: 0.5rem;

	@media (max-width: 768px) {
		flex-direction: column-reverse;
	}
`;

const ParticipantItemWithActions = styled(ParticipantItem)`
	justify-content: space-between;
`;

const RemoveParticipantButton = styled.button`
	background: transparent;
	border: none;
	color: ${(props) => props.theme.lightMode.colors.secondary};
	cursor: pointer;
	padding: 0.25rem;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	flex-shrink: 0;

	&:hover {
		background: ${(props) => props.theme.lightMode.colors.border};
		color: ${(props) => props.theme.lightMode.colors.foreground};
	}

	svg {
		width: 16px;
		height: 16px;
	}
`;

const currencies = [
	{ value: "USD", label: "USD - US Dollar" },
	{ value: "EUR", label: "EUR - Euro" },
	{ value: "GBP", label: "GBP - British Pound" },
	{ value: "CAD", label: "CAD - Canadian Dollar" },
	{ value: "AUD", label: "AUD - Australian Dollar" },
];

interface GiftExchange {
	id: string;
	name: string;
	magicWord: string | null;
	spendingLimit: number;
	currency: string;
	status: string;
	showRecipientNames: boolean;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

interface Participant {
	id: string;
	exchangeId: string;
	firstName: string;
	lastName: string | null;
	createdAt: string;
	updatedAt: string;
}

type TabType = "activity" | "invite" | "manage";

export default function GiftExchangeDetailPage() {
	const { data: session, isPending } = useSession();
	const params = useParams();
	const router = useRouter();
	const id = params.id as string;

	const [exchange, setExchange] = useState<GiftExchange | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabType>("invite");
	const [editName, setEditName] = useState("");
	const [editMagicWord, setEditMagicWord] = useState("");
	const [isEditingMagicWord, setIsEditingMagicWord] = useState(false);
	const [magicWordError, setMagicWordError] = useState<string | null>(null);
	const [editSpendingLimit, setEditSpendingLimit] = useState(25);
	const [editCurrency, setEditCurrency] = useState("USD");
	const [isEditingSpendingLimit, setIsEditingSpendingLimit] = useState(false);
	const [showRecipientNames, setShowRecipientNames] = useState(false);
	const [saving, setSaving] = useState(false);
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [participantsLoading, setParticipantsLoading] = useState(false);
	const [participantModalOpen, setParticipantModalOpen] = useState(false);
	const [selectedParticipant, setSelectedParticipant] =
		useState<Participant | null>(null);
	const [wishlistItems, setWishlistItems] = useState<
		{
			id: string;
			description: string;
			url?: string | null;
			previewImage?: string | null;
			previewTitle?: string | null;
			previewDescription?: string | null;
		}[]
	>([]);
	const [wishlistLoading, setWishlistLoading] = useState(false);
	const [wizardOpen, setWizardOpen] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);
	const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
	const [startExchangeModalOpen, setStartExchangeModalOpen] = useState(false);
	const [endExchangeModalOpen, setEndExchangeModalOpen] = useState(false);
	const [removingParticipantId, setRemovingParticipantId] = useState<
		string | null
	>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [participantToDelete, setParticipantToDelete] =
		useState<Participant | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [deleteExchangeConfirmOpen, setDeleteExchangeConfirmOpen] =
		useState(false);
	const [deleteExchangeError, setDeleteExchangeError] = useState<string | null>(
		null,
	);
	const [deletingExchange, setDeletingExchange] = useState(false);
	const [assignmentsList, setAssignmentsList] = useState<
		Array<{
			id: string;
			participantId: string;
			assignedToParticipantId: string;
			giverName: string;
			receiverName: string;
		}>
	>([]);
	const [assignmentsLoading, setAssignmentsLoading] = useState(false);

	// Generate invitation link dynamically using NEXT_PUBLIC_BASE_URL or fallback to window.location.origin
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(typeof window !== "undefined" ? window.location.origin : "");
	const inviteLink = id ? `${baseUrl}/exchange/${id}/register` : "";

	useEffect(() => {
		if (id) {
			fetchExchange();
		}
	}, [id]);

	useEffect(() => {
		if (exchange) {
			setEditName(exchange.name);
			setEditMagicWord(exchange.magicWord || "");
			setEditSpendingLimit(exchange.spendingLimit);
			setEditCurrency(exchange.currency);
			setShowRecipientNames(exchange.showRecipientNames);

			// If exchange is started or ended and we're on the invite tab, switch to activity tab
			if (
				(exchange.status === "started" || exchange.status === "ended") &&
				activeTab === "invite"
			) {
				setActiveTab("activity");
			}
			// If exchange is started or ended and we're editing spending limit, close the edit form
			if (
				(exchange.status === "started" || exchange.status === "ended") &&
				isEditingSpendingLimit
			) {
				setIsEditingSpendingLimit(false);
			}
			// If exchange is ended and we're editing magic word, close the edit form
			if (exchange.status === "ended" && isEditingMagicWord) {
				setIsEditingMagicWord(false);
			}
		}
	}, [exchange, activeTab, isEditingSpendingLimit, isEditingMagicWord]);

	useEffect(() => {
		if (exchange && activeTab === "activity") {
			fetchParticipants();
			if (exchange.status === "started" || exchange.status === "ended") {
				fetchAssignments();
			}
		}
	}, [exchange, activeTab]);

	// Generate QR code when modal opens if not already generated
	useEffect(() => {
		if (qrModalOpen && !qrCodeGenerated && inviteLink) {
			setQrCodeGenerated(true);
		}
	}, [qrModalOpen, qrCodeGenerated, inviteLink]);

	const fetchParticipants = async () => {
		if (!exchange) return;

		try {
			setParticipantsLoading(true);
			const response = await fetch(
				`/api/participants?exchangeId=${exchange.id}`,
			);
			if (response.ok) {
				const data = await response.json();
				setParticipants(data);
			} else {
				console.error("Failed to fetch participants");
				setParticipants([]);
			}
		} catch (err) {
			console.error("Error fetching participants:", err);
			setParticipants([]);
		} finally {
			setParticipantsLoading(false);
		}
	};

	const fetchAssignments = async () => {
		if (!exchange) return;

		try {
			setAssignmentsLoading(true);
			const response = await fetch(
				`/api/assignments?exchangeId=${exchange.id}`,
			);
			if (response.ok) {
				const data = await response.json();
				setAssignmentsList(data);
			} else {
				console.error("Failed to fetch assignments");
				setAssignmentsList([]);
			}
		} catch (err) {
			console.error("Error fetching assignments:", err);
			setAssignmentsList([]);
		} finally {
			setAssignmentsLoading(false);
		}
	};

	const handleParticipantClick = async (participant: Participant) => {
		setSelectedParticipant(participant);
		setParticipantModalOpen(true);
		setWishlistLoading(true);
		setWishlistItems([]);

		try {
			const response = await fetch(
				`/api/participants/${participant.id}/wishlist`,
			);
			if (response.ok) {
				const items = await response.json();
				setWishlistItems(items);
			} else {
				console.error("Failed to fetch wishlist items");
				setWishlistItems([]);
			}
		} catch (err) {
			console.error("Error fetching wishlist items:", err);
			setWishlistItems([]);
		} finally {
			setWishlistLoading(false);
		}
	};

	const fetchExchange = async () => {
		try {
			setLoading(true);
			setError(null);
			// Try to fetch from API, or use mock data if not found
			const response = await fetch("/api/gift-exchanges");
			if (response.ok) {
				const exchanges = await response.json();
				const found = exchanges.find((ex: GiftExchange) => ex.id === id);
				if (found) {
					setExchange(found);
				} else {
					// Use mock data if not found
					setExchange({
						id: id,
						name: "Holiday Gift Exchange",
						magicWord: "Snowflake",
						spendingLimit: 50,
						currency: "USD",
						status: "active",
						showRecipientNames: false,
						createdBy: session?.user?.id || "",
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					});
				}
			} else {
				// Use mock data if API fails
				setExchange({
					id: id,
					name: "Holiday Gift Exchange",
					magicWord: "Snowflake",
					spendingLimit: 50,
					currency: "USD",
					status: "active",
					showRecipientNames: false,
					createdBy: session?.user?.id || "",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				});
			}
		} catch (err) {
			// Use mock data on error
			setExchange({
				id: id,
				name: "Holiday Gift Exchange",
				magicWord: "Snowflake",
				spendingLimit: 50,
				currency: "USD",
				status: "active",
				showRecipientNames: false,
				createdBy: session?.user?.id || "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		} finally {
			setLoading(false);
		}
	};

	if (isPending || loading) {
		return <LoadingSpinner />;
	}

	if (!session?.user) {
		return (
			<DashboardLayout onCreateClick={() => router.push("/dashboard")}>
				<AccessDeniedContainer>
					<AccessDeniedCard>
						<AccessDeniedTitle>Access Denied</AccessDeniedTitle>
						<AccessDeniedText>
							Please sign in to access this page.
						</AccessDeniedText>
					</AccessDeniedCard>
				</AccessDeniedContainer>
			</DashboardLayout>
		);
	}

	if (error) {
		return (
			<DashboardLayout onCreateClick={() => router.push("/dashboard")}>
				<ErrorState>
					<ErrorTitle>Error</ErrorTitle>
					<ErrorText>{error}</ErrorText>
				</ErrorState>
			</DashboardLayout>
		);
	}

	if (!exchange) {
		return (
			<DashboardLayout onCreateClick={() => router.push("/dashboard")}>
				<ErrorState>
					<ErrorTitle>Exchange Not Found</ErrorTitle>
					<ErrorText>
						The gift exchange you're looking for doesn't exist.
					</ErrorText>
				</ErrorState>
			</DashboardLayout>
		);
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(inviteLink);
			setCopySuccess(true);
			setTimeout(() => {
				setCopySuccess(false);
			}, 3000);
		} catch (err) {
			// Fallback if clipboard API fails
			console.error("Failed to copy link:", err);
		}
	};

	const handleSaveName = async () => {
		if (!editName.trim()) {
			setError("Exchange name cannot be empty");
			return;
		}

		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: editName.trim(),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update exchange name");
			}

			const updated = await response.json();
			setExchange(updated);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteExchange = () => {
		if (exchange) {
			setDeleteExchangeError(null);
			setDeleteExchangeConfirmOpen(true);
		}
	};

	const handleConfirmDeleteExchange = async () => {
		if (!exchange) return;

		try {
			setDeleteExchangeError(null);
			setDeletingExchange(true);

			const response = await fetch(`/api/gift-exchanges/${exchange.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete exchange");
			}

			// Redirect to dashboard on success
			router.push("/dashboard");
		} catch (err) {
			setDeleteExchangeError(
				err instanceof Error
					? err.message
					: "An error occurred while deleting the exchange",
			);
		} finally {
			setDeletingExchange(false);
		}
	};

	const handleSaveMagicWord = async () => {
		if (!editMagicWord.trim() || editMagicWord.trim().length < 3) {
			setMagicWordError("Magic word must be at least 3 characters long");
			return;
		}

		try {
			setSaving(true);
			setMagicWordError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					magicWord: editMagicWord.trim(),
				}),
			});

			if (!response.ok) {
				let errorMessage = "Failed to update magic word";
				try {
					const data = await response.json();
					errorMessage = data.error || errorMessage;
				} catch {
					// If response is not JSON, use default error message
				}
				throw new Error(errorMessage);
			}

			const updated = await response.json();
			setExchange(updated);
			setIsEditingMagicWord(false);
			setMagicWordError(null);
		} catch (err) {
			setMagicWordError(
				err instanceof Error ? err.message : "An error occurred",
			);
		} finally {
			setSaving(false);
		}
	};

	const handleSaveSpendingLimit = async () => {
		if (
			!editSpendingLimit ||
			editSpendingLimit <= 0 ||
			editSpendingLimit % 5 !== 0
		) {
			setError("Spending limit must be a positive number in increments of 5");
			return;
		}

		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					spendingLimit: editSpendingLimit,
					currency: editCurrency,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update spending limit");
			}

			const updated = await response.json();
			setExchange(updated);
			setIsEditingSpendingLimit(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
	};

	const handleToggleShowRecipientNames = async () => {
		try {
			setSaving(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					showRecipientNames: !showRecipientNames,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update anonymity settings");
			}

			const updated = await response.json();
			setExchange(updated);
			setShowRecipientNames(updated.showRecipientNames);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSaving(false);
		}
	};

	const handleStartExchange = async () => {
		// Fetch participants if not already loaded or in activity tab
		if (exchange && (participants.length === 0 || activeTab !== "activity")) {
			await fetchParticipants();
		}
		setStartExchangeModalOpen(true);
	};

	const handleConfirmStartExchange = async () => {
		if (!exchange || participants.length < 2) {
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${exchange.id}/start`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to start exchange");
			}

			const result = await response.json();

			// Refresh exchange data
			await fetchExchange();

			// Refresh participants data
			await fetchParticipants();

			// Refresh assignments data
			await fetchAssignments();

			// Close modal
			setStartExchangeModalOpen(false);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while starting the exchange",
			);
			console.error("Error starting exchange:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleEndExchange = async () => {
		setEndExchangeModalOpen(true);
	};

	const handleConfirmEndExchange = async () => {
		if (!exchange) {
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/gift-exchanges/${exchange.id}/end`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to end exchange");
			}

			const result = await response.json();

			// Refresh exchange data
			await fetchExchange();

			// Close modal
			setEndExchangeModalOpen(false);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while ending the exchange",
			);
			console.error("Error ending exchange:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveParticipant = (participantId: string) => {
		const participant = participants.find((p) => p.id === participantId);
		if (participant) {
			setParticipantToDelete(participant);
			setDeleteError(null);
			setDeleteConfirmOpen(true);
		}
	};

	const handleConfirmDeleteParticipant = async () => {
		if (!participantToDelete) return;

		try {
			setDeleteError(null);
			setRemovingParticipantId(participantToDelete.id);

			const response = await fetch(
				`/api/participants/${participantToDelete.id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to delete participant");
			}

			// Close modal and refetch participants
			setDeleteConfirmOpen(false);
			setParticipantToDelete(null);
			await fetchParticipants();
		} catch (err) {
			setDeleteError(
				err instanceof Error
					? err.message
					: "An error occurred while deleting the participant",
			);
		} finally {
			setRemovingParticipantId(null);
		}
	};

	return (
		<DashboardLayout onCreateClick={() => setWizardOpen(true)}>
			<BackButton onClick={() => router.push("/dashboard")}>
				<ArrowLeft />
				Back to Exchanges
			</BackButton>
			<PageHeader>
				<div>
					<PageTitle>{exchange.name}</PageTitle>
					<PageSubtitle>Manage your gift exchange</PageSubtitle>
				</div>
				{exchange.status === "active" && (
					<StartExchangeButton onClick={handleStartExchange}>
						<Rocket />
						Start Exchange
					</StartExchangeButton>
				)}
				{exchange.status === "started" && (
					<StartExchangeButton onClick={handleEndExchange}>
						<CheckCircle />
						End Exchange
					</StartExchangeButton>
				)}
				{exchange.status === "ended" && (
					<EndedNotice>
						<EndedNoticeTitle>
							<CheckCircle style={{ width: "18px", height: "18px" }} />
							Exchange Ended
						</EndedNoticeTitle>
						<EndedNoticeDate>
							Ended on{" "}
							{new Intl.DateTimeFormat("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric",
								hour: "numeric",
								minute: "2-digit",
							}).format(new Date(exchange.updatedAt))}
						</EndedNoticeDate>
					</EndedNotice>
				)}
			</PageHeader>

			<TabsContainer>
				<TabsList>
					{exchange?.status === "active" && (
						<TabButton
							$active={activeTab === "invite"}
							onClick={() => setActiveTab("invite")}
						>
							<LinkIcon />
							Invite
						</TabButton>
					)}
					<TabButton
						$active={activeTab === "activity"}
						onClick={() => setActiveTab("activity")}
					>
						<Users />
						Activity
					</TabButton>
					<TabButton
						$active={activeTab === "manage"}
						onClick={() => setActiveTab("manage")}
					>
						<Edit />
						Manage
					</TabButton>
				</TabsList>

				<TabContent>
					{error && (
						<Card
							style={{
								marginBottom: "2rem",
								borderLeft: "3px solid",
								borderLeftColor: "inherit",
							}}
						>
							<p style={{ margin: 0, color: "inherit" }}>{error}</p>
						</Card>
					)}
					{activeTab === "invite" && (
						<>
							<Section>
								<div>
									<SectionTitle>Magic Word</SectionTitle>
									<SectionDescription>
										Exchangers will use this word along with your last name to
										join. The combination of your last name and magic word must
										be unique. Make sure to share this with participants.
									</SectionDescription>
								</div>
								<Card>
									{!isEditingMagicWord ? (
										<>
											<div style={{ marginBottom: "1rem" }}>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.5rem",
														fontSize: "1.125rem",
														fontWeight: 600,
														color: "inherit",
													}}
												>
													<Key style={{ width: "20px", height: "20px" }} />
													<span>{exchange?.magicWord || "Not set"}</span>
												</div>
											</div>
											<PrimaryButton
												onClick={() => setIsEditingMagicWord(true)}
												disabled={exchange?.status === "ended"}
											>
												<Edit />
												Edit Magic Word
											</PrimaryButton>
										</>
									) : (
										<FormGroup>
											<Label htmlFor="magic-word">Magic Word</Label>
											<div
												style={{
													fontSize: "0.8125rem",
													color: "inherit",
													opacity: 0.7,
													marginTop: "-0.5rem",
													marginBottom: "0.5rem",
												}}
											>
												The combination of your last name and magic word must be
												unique.
											</div>
											<Input
												id="magic-word"
												type="text"
												value={editMagicWord}
												onChange={(e) => {
													setEditMagicWord(e.target.value);
													setMagicWordError(null);
												}}
												placeholder="e.g., Snowflake"
												disabled={exchange?.status === "ended"}
											/>
											{magicWordError && (
												<div
													style={{
														fontSize: "0.875rem",
														color: "inherit",
														padding: "0.75rem 1rem",
														background: "rgba(0, 0, 0, 0.05)",
														borderRadius: "8px",
														borderLeft: "3px solid",
														borderLeftColor: "inherit",
														marginTop: "0.5rem",
													}}
												>
													{magicWordError}
												</div>
											)}
											<div
												style={{
													display: "flex",
													gap: "0.75rem",
													marginTop: "0.5rem",
												}}
											>
												<PrimaryButton
													onClick={handleSaveMagicWord}
													disabled={saving || exchange?.status === "ended"}
												>
													{saving ? "Saving..." : "Save"}
												</PrimaryButton>
												<Button
													onClick={() => {
														setIsEditingMagicWord(false);
														setEditMagicWord(exchange?.magicWord || "");
														setMagicWordError(null);
													}}
													disabled={saving}
												>
													Cancel
												</Button>
											</div>
										</FormGroup>
									)}
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Invite via QR Code</SectionTitle>
									<SectionDescription>
										Share this QR code for easy access
									</SectionDescription>
								</div>
								<Card>
									<QrCodeContainer>
										{qrCodeGenerated ? (
											<QrCodeWrapper>
												<QRCodeSVG
													value={inviteLink}
													size={184}
													level="M"
													includeMargin={false}
												/>
											</QrCodeWrapper>
										) : (
											<QrCodeWrapper
												style={{
													background: "#f5f5f5",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<QrCode
													style={{
														width: "64px",
														height: "64px",
														opacity: 0.3,
													}}
												/>
											</QrCodeWrapper>
										)}
										<PrimaryButton
											onClick={() => {
												if (!qrCodeGenerated) {
													setQrCodeGenerated(true);
												}
												setQrModalOpen(true);
											}}
										>
											<Maximize2 />
											{qrCodeGenerated ? "Expand" : "Show QR Code"}
										</PrimaryButton>
									</QrCodeContainer>
								</Card>
								<Dialog.Root open={qrModalOpen} onOpenChange={setQrModalOpen}>
									<QrModalOverlay />
									<QrModalContent>
										<QrModalCloseButton asChild>
											<button>
												<X />
											</button>
										</QrModalCloseButton>
										<QrModalTitle>Scan to Join</QrModalTitle>
										<QrModalBrand>
											<Gift />
											<span>IncogniGift</span>
										</QrModalBrand>
										{qrCodeGenerated && inviteLink ? (
											<QrCodeLargeWrapper>
												<QRCodeSVG
													value={inviteLink}
													size={276}
													level="M"
													includeMargin={false}
												/>
											</QrCodeLargeWrapper>
										) : (
											<QrCodeLargeWrapper
												style={{
													background: "#f5f5f5",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<QrCode
													style={{
														width: "96px",
														height: "96px",
														opacity: 0.3,
													}}
												/>
											</QrCodeLargeWrapper>
										)}
									</QrModalContent>
								</Dialog.Root>
							</Section>

							<Section>
								<div>
									<SectionTitle>Invite via Link</SectionTitle>
									<SectionDescription>
										Share this link to invite participants or view the link
										yourself to join the exchange!
									</SectionDescription>
								</div>
								<Card>
									<InviteLinkContainer>
										<LinkInputContainer>
											<LinkInput type="text" value={inviteLink} readOnly />
											<PrimaryButton onClick={handleCopyLink}>
												<Copy />
												Copy Link
											</PrimaryButton>
										</LinkInputContainer>
										{copySuccess && (
											<CopySuccessMessage>
												<Check />
												Link copied to clipboard!
											</CopySuccessMessage>
										)}
									</InviteLinkContainer>
								</Card>
							</Section>
						</>
					)}

					{activeTab === "activity" && (
						<>
							{(exchange?.status === "started" ||
								exchange?.status === "ended") && (
								<Section>
									<div>
										<SectionTitle>Gift Pairings</SectionTitle>
										<SectionDescription>
											Who gives to whom in this exchange
										</SectionDescription>
									</div>
									<Card>
										{assignmentsLoading ? (
											<ParticipantCount>Loading pairings...</ParticipantCount>
										) : assignmentsList.length > 0 ? (
											<ParticipantList>
												{assignmentsList.map((assignment) => (
													<div
														key={assignment.id}
														style={{
															padding: "1rem",
															border: "1px solid",
															borderColor: "inherit",
															borderRadius: "8px",
															marginBottom: "0.75rem",
															display: "flex",
															alignItems: "center",
															gap: "0.5rem",
															fontFamily:
																"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
															fontSize: "0.9375rem",
															color: "inherit",
														}}
													>
														<span style={{ fontWeight: 600 }}>
															{assignment.giverName}
														</span>
														<span style={{ opacity: 0.6, fontSize: "1.2rem" }}>
															↔
														</span>
														<span style={{ fontWeight: 600 }}>
															{assignment.receiverName}
														</span>
													</div>
												))}
											</ParticipantList>
										) : (
											<p
												style={{
													margin: 0,
													color: "inherit",
													fontFamily:
														"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
													fontSize: "0.9375rem",
												}}
											>
												No pairings found.
											</p>
										)}
									</Card>
								</Section>
							)}
							<Section>
								<div>
									<SectionTitle>Participants</SectionTitle>
									<SectionDescription>
										See all active participants in this exchange
									</SectionDescription>
								</div>
								<Card>
									{participantsLoading ? (
										<ParticipantCount>Loading participants...</ParticipantCount>
									) : (
										<>
											<ParticipantCount>
												{participants.length} Participant
												{participants.length !== 1 ? "s" : ""}
											</ParticipantCount>
											{participants.length > 0 ? (
												<ParticipantList>
													{participants.map((participant) => {
														const fullName =
															`${participant.firstName} ${participant.lastName || ""}`.trim();
														return (
															<ParticipantItemWithActions key={participant.id}>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																		gap: "0.75rem",
																		flex: 1,
																		cursor: "pointer",
																	}}
																	onClick={() =>
																		handleParticipantClick(participant)
																	}
																>
																	<Users
																		style={{ width: "20px", height: "20px" }}
																	/>
																	<ParticipantName>{fullName}</ParticipantName>
																</div>
																<RemoveParticipantButton
																	onClick={(e) => {
																		e.stopPropagation();
																		handleRemoveParticipant(participant.id);
																	}}
																	disabled={
																		removingParticipantId === participant.id
																	}
																	title="Remove participant"
																>
																	<Trash2 />
																</RemoveParticipantButton>
															</ParticipantItemWithActions>
														);
													})}
												</ParticipantList>
											) : (
												<p
													style={{
														margin: 0,
														color: "inherit",
														fontFamily:
															"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
														fontSize: "0.9375rem",
													}}
												>
													No participants have joined this exchange yet.
												</p>
											)}
										</>
									)}
								</Card>
							</Section>
						</>
					)}

					{activeTab === "manage" && (
						<>
							<Section>
								<div>
									<SectionTitle>Edit Name</SectionTitle>
									<SectionDescription>
										Update the name of your gift exchange
									</SectionDescription>
								</div>
								<Card>
									<FormGroup>
										<Label htmlFor="exchange-name">Exchange Name</Label>
										<Input
											id="exchange-name"
											type="text"
											value={editName}
											onChange={(e) => {
												setEditName(e.target.value);
												setError(null);
											}}
											placeholder="Enter exchange name"
											disabled={exchange?.status === "ended"}
										/>
										<PrimaryButton
											onClick={handleSaveName}
											disabled={saving || exchange?.status === "ended"}
										>
											<Edit />
											{saving ? "Saving..." : "Save Changes"}
										</PrimaryButton>
									</FormGroup>
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Edit Spending Limit</SectionTitle>
									<SectionDescription>
										{exchange?.status === "started" ||
										exchange?.status === "ended"
											? "Spending limit cannot be changed after the exchange has started."
											: "Update the spending limit and currency for your gift exchange"}
									</SectionDescription>
								</div>
								<Card>
									{!isEditingSpendingLimit ? (
										<>
											<div style={{ marginBottom: "1rem" }}>
												<div
													style={{
														fontSize: "1.125rem",
														fontWeight: 600,
														color: "inherit",
														marginBottom: "0.5rem",
													}}
												>
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: exchange?.currency || "USD",
													}).format(exchange?.spendingLimit || 0)}
												</div>
											</div>
											{(exchange?.status === "started" ||
												exchange?.status === "ended") && (
												<div
													style={{
														padding: "0.875rem 1rem",
														borderRadius: "8px",
														background: "rgba(0, 0, 0, 0.05)",
														marginBottom: "1rem",
														fontFamily:
															"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
														fontSize: "0.875rem",
														color: "inherit",
													}}
												>
													Spending limit cannot be changed after the exchange
													has started.
												</div>
											)}
											<PrimaryButton
												onClick={() => setIsEditingSpendingLimit(true)}
												disabled={
													exchange?.status === "started" ||
													exchange?.status === "ended"
												}
											>
												<Edit />
												Edit Spending Limit
											</PrimaryButton>
										</>
									) : (
										<FormGroup>
											{(exchange?.status === "started" ||
												exchange?.status === "ended") && (
												<div
													style={{
														padding: "0.875rem 1rem",
														borderRadius: "8px",
														background: "rgba(0, 0, 0, 0.05)",
														marginBottom: "1rem",
														fontFamily:
															"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
														fontSize: "0.875rem",
														color: "inherit",
													}}
												>
													Spending limit cannot be changed after the exchange
													has started.
												</div>
											)}
											<Label htmlFor="spending-limit">Spending Limit</Label>
											<Input
												id="spending-limit"
												type="number"
												min="5"
												step="5"
												value={editSpendingLimit}
												onChange={(e) => {
													const value = parseInt(e.target.value, 10);
													if (!isNaN(value) && value >= 5) {
														setEditSpendingLimit(value);
													} else if (e.target.value === "") {
														setEditSpendingLimit(0);
													}
													setError(null);
												}}
												disabled={
													exchange?.status === "started" ||
													exchange?.status === "ended"
												}
											/>
											<Label htmlFor="currency-select">Currency</Label>
											<SelectRoot
												value={editCurrency}
												onValueChange={setEditCurrency}
												defaultValue={editCurrency}
												disabled={
													exchange?.status === "started" ||
													exchange?.status === "ended"
												}
											>
												<SelectTrigger
													id="currency-select"
													aria-label="Currency"
												>
													<SelectValue />
													<Select.Icon>
														<ChevronDown />
													</Select.Icon>
												</SelectTrigger>
												<Select.Portal>
													<SelectContent position="popper" sideOffset={5}>
														<Select.ScrollUpButton asChild>
															<SelectScrollButton>
																<ChevronUp />
															</SelectScrollButton>
														</Select.ScrollUpButton>
														<SelectViewport>
															{currencies.map((curr) => (
																<SelectItem key={curr.value} value={curr.value}>
																	<Select.ItemText>
																		{curr.label}
																	</Select.ItemText>
																	<Select.ItemIndicator>
																		<Check />
																	</Select.ItemIndicator>
																</SelectItem>
															))}
														</SelectViewport>
														<Select.ScrollDownButton asChild>
															<SelectScrollButton>
																<ChevronDown />
															</SelectScrollButton>
														</Select.ScrollDownButton>
													</SelectContent>
												</Select.Portal>
											</SelectRoot>
											<div
												style={{
													display: "flex",
													gap: "0.75rem",
													marginTop: "0.5rem",
												}}
											>
												<PrimaryButton
													onClick={handleSaveSpendingLimit}
													disabled={
														saving ||
														exchange?.status === "started" ||
														exchange?.status === "ended"
													}
												>
													{saving ? "Saving..." : "Save"}
												</PrimaryButton>
												<Button
													onClick={() => {
														setIsEditingSpendingLimit(false);
														setEditSpendingLimit(exchange?.spendingLimit || 25);
														setEditCurrency(exchange?.currency || "USD");
														setError(null);
													}}
													disabled={saving}
												>
													Cancel
												</Button>
											</div>
										</FormGroup>
									)}
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Anonymity Settings</SectionTitle>
									<SectionDescription>
										{exchange?.status === "started" ||
										exchange?.status === "ended"
											? "Anonymity settings cannot be changed after the exchange has started."
											: "Control whether participants can see who they're buying gifts for before the exchange ends."}
									</SectionDescription>
								</div>
								<Card>
									{(exchange?.status === "started" ||
										exchange?.status === "ended") && (
										<div
											style={{
												padding: "0.875rem 1rem",
												borderRadius: "8px",
												background: "rgba(0, 0, 0, 0.05)",
												marginBottom: "1rem",
												fontFamily:
													"var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
												fontSize: "0.875rem",
												color: "inherit",
											}}
										>
											Anonymity settings cannot be changed after the exchange
											has started.
										</div>
									)}
									<div
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "0.75rem",
											padding: "1rem",
											border: "1px solid",
											borderColor: "inherit",
											borderRadius: "8px",
											cursor:
												exchange?.status === "started" ||
												exchange?.status === "ended"
													? "not-allowed"
													: "pointer",
											transition: "all 0.2s ease",
											background: showRecipientNames
												? "rgba(0, 0, 0, 0.03)"
												: "transparent",
											opacity:
												exchange?.status === "started" ||
												exchange?.status === "ended"
													? 0.5
													: 1,
										}}
										onClick={() => {
											if (
												exchange?.status !== "started" &&
												exchange?.status !== "ended" &&
												!saving
											) {
												handleToggleShowRecipientNames();
											}
										}}
									>
										<input
											type="checkbox"
											id="showRecipientNames"
											checked={showRecipientNames}
											onChange={handleToggleShowRecipientNames}
											disabled={
												exchange?.status === "started" ||
												exchange?.status === "ended" ||
												saving
											}
											style={{
												width: "20px",
												height: "20px",
												cursor:
													exchange?.status === "started" ||
													exchange?.status === "ended"
														? "not-allowed"
														: "pointer",
												marginTop: "2px",
											}}
										/>
										<div
											style={{
												flex: 1,
												cursor:
													exchange?.status === "started" ||
													exchange?.status === "ended"
														? "not-allowed"
														: "pointer",
											}}
										>
											<Label
												htmlFor="showRecipientNames"
												style={{
													cursor:
														exchange?.status === "started" ||
														exchange?.status === "ended"
															? "not-allowed"
															: "pointer",
													display: "block",
													marginBottom: "0.25rem",
												}}
											>
												Show recipient names to participants
											</Label>
											<div
												style={{
													fontSize: "0.875rem",
													color: "inherit",
													opacity: 0.7,
													lineHeight: "1.5",
												}}
											>
												When enabled, participants will see the name of who
												they&apos;re buying gifts for as soon as the exchange
												starts. When the exchange ends, they&apos;ll also see
												who was buying gifts for them.
											</div>
										</div>
									</div>
								</Card>
							</Section>

							<Section>
								<div>
									<SectionTitle>Delete Exchange</SectionTitle>
									<SectionDescription>
										Permanently delete this gift exchange. This action cannot be
										undone.
									</SectionDescription>
								</div>
								<Card>
									<WarningText>
										Deleting this exchange will remove all participants and
										associated data. This action cannot be undone.
									</WarningText>
									<ButtonContainer>
										<DangerButton onClick={handleDeleteExchange}>
											<Trash2 />
											Delete Exchange
										</DangerButton>
									</ButtonContainer>
								</Card>
							</Section>
						</>
					)}
				</TabContent>
			</TabsContainer>

			<Dialog.Root
				open={participantModalOpen}
				onOpenChange={setParticipantModalOpen}
			>
				<ParticipantModalOverlay />
				<ParticipantModalContent>
					<ParticipantModalCloseButton asChild>
						<button>
							<X />
						</button>
					</ParticipantModalCloseButton>
					{selectedParticipant && (
						<>
							<ParticipantModalTitle>
								{`${selectedParticipant.firstName} ${selectedParticipant.lastName || ""}`.trim()}
								's Gift Ideas
							</ParticipantModalTitle>
							{wishlistLoading ? (
								<EmptyWishlistText>Loading wishlist items...</EmptyWishlistText>
							) : wishlistItems.length > 0 ? (
								<WishlistItemsList>
									{wishlistItems.map((item) => (
										<WishlistItem key={item.id}>
											<WishlistItemDescription>
												{(() => {
													const urls = extractUrls(item.description);
													if (urls.length > 0 && item.url) {
														const domain = extractDomain(item.url);
														if (domain) {
															const domainName = formatDomainName(domain);
															const faviconUrl = getFaviconUrl(domain);
															const urlRegex = /(https?:\/\/[^\s]+)/gi;
															const parts = item.description.split(urlRegex);
															return (
																<>
																	{parts.map((part, index) => {
																		// Check if this part is a URL (odd indices after split are URLs)
																		if (index % 2 === 1) {
																			return (
																				<span key={index}>
																					<span>From </span>
																					<FaviconImage
																						src={faviconUrl}
																						alt={domainName}
																					/>
																					<span>{domainName}</span>
																				</span>
																			);
																		}
																		return <span key={index}>{part}</span>;
																	})}
																</>
															);
														}
													}
													return item.description;
												})()}
											</WishlistItemDescription>
											{item.url &&
												(item.previewImage ||
												item.previewTitle ||
												item.previewDescription ? (
													<PreviewCard
														href={item.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<PreviewContentWrapper>
															{item.previewImage && (
																<PreviewImage
																	src={item.previewImage}
																	alt={item.previewTitle || "Preview"}
																/>
															)}
															<PreviewContent>
																{item.previewTitle && (
																	<PreviewTitle>
																		{item.previewTitle}
																	</PreviewTitle>
																)}
																{item.previewDescription && (
																	<PreviewDescription>
																		{item.previewDescription}
																	</PreviewDescription>
																)}
															</PreviewContent>
														</PreviewContentWrapper>
													</PreviewCard>
												) : (
													<FallbackLinkComponent url={item.url} />
												))}
										</WishlistItem>
									))}
								</WishlistItemsList>
							) : (
								<EmptyWishlistText>
									This participant hasn't submitted any gift ideas yet.
								</EmptyWishlistText>
							)}
						</>
					)}
				</ParticipantModalContent>
			</Dialog.Root>

			<Dialog.Root
				open={startExchangeModalOpen}
				onOpenChange={setStartExchangeModalOpen}
			>
				<StartExchangeModalOverlay />
				<StartExchangeModalContent>
					<StartExchangeModalCloseButton asChild>
						<button>
							<X />
						</button>
					</StartExchangeModalCloseButton>
					<StartExchangeModalTitle>Start Exchange?</StartExchangeModalTitle>

					{participants.length < 2 ? (
						<>
							<StartExchangeError>
								You need at least 2 participants to start the exchange.
							</StartExchangeError>
							<StartExchangeText>
								Currently, you have {participants.length} participant
								{participants.length !== 1 ? "s" : ""}. Please invite more
								participants before starting the exchange.
							</StartExchangeText>
						</>
					) : (
						<>
							<StartExchangeText>
								Are you sure you want to start this exchange? Once started, no
								new participants can join.
							</StartExchangeText>

							<StartExchangeSection>
								<StartExchangeSectionTitle>
									Exchange Details
								</StartExchangeSectionTitle>
								<StartExchangeText>
									<strong>Spending Limit:</strong>{" "}
									{new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: exchange?.currency || "USD",
									}).format(exchange?.spendingLimit || 0)}
								</StartExchangeText>
								<StartExchangeText>
									<strong>Participants:</strong> {participants.length}
								</StartExchangeText>
								<StartExchangeParticipantsList>
									{participants.map((participant) => {
										const fullName =
											`${participant.firstName} ${participant.lastName || ""}`.trim();
										return (
											<StartExchangeParticipantItem key={participant.id}>
												{fullName}
											</StartExchangeParticipantItem>
										);
									})}
								</StartExchangeParticipantsList>
							</StartExchangeSection>

							<StartExchangeSection>
								<StartExchangeSectionTitle>
									Pairing Information
								</StartExchangeSectionTitle>
								{participants.length % 2 === 0 ? (
									<>
										<StartExchangeText>
											<strong>Number of Pairs:</strong>{" "}
											{Math.floor(participants.length / 2)}
										</StartExchangeText>
										<StartExchangeText>
											Each person will give a gift to one person and receive a
											gift from one person.
										</StartExchangeText>
									</>
								) : (
									<>
										<StartExchangeText>
											<strong>Number of Pairs:</strong>{" "}
											{Math.floor(participants.length / 2)} pairs
										</StartExchangeText>
										<StartExchangeText>
											<strong>
												{Math.floor(participants.length / 2) === 1
													? ""
													: "Plus "}
												1 three-way mini-circle
											</strong>
										</StartExchangeText>
										<StartExchangeText
											style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
										>
											Since you have an odd number of participants, one group of
											3 will form a mini-circle: A → B → C → A
										</StartExchangeText>
										<StartExchangeText
											style={{
												marginLeft: "1rem",
												fontSize: "0.875rem",
												opacity: 0.8,
											}}
										>
											• A gives to B and receives from C<br />• B gives to C and
											receives from A<br />• C gives to A and receives from B
										</StartExchangeText>
										<StartExchangeText style={{ marginTop: "0.75rem" }}>
											Everyone still gives one gift and receives one gift.
											Alternatively, you can invite another participant to make
											an even number.
										</StartExchangeText>
									</>
								)}
							</StartExchangeSection>

							<StartExchangeSection>
								<StartExchangeSectionTitle>
									What Will Happen
								</StartExchangeSectionTitle>
								<StartExchangeText>
									{participants.length % 2 === 0
										? "We will randomly pair each person with another participant. Each person gives to one person and receives from one person. Once started, no new participants can join."
										: "We will randomly create pairs, with one group of 3 participants forming a mini-circle (A → B → C → A). Each person gives one gift and receives one gift. Once started, no new participants can join."}
								</StartExchangeText>
							</StartExchangeSection>
						</>
					)}

					<StartExchangeButtonContainer>
						<Button onClick={() => setStartExchangeModalOpen(false)}>
							Cancel
						</Button>
						{participants.length >= 2 && (
							<PrimaryButton onClick={handleConfirmStartExchange}>
								<Rocket />
								Start Exchange
							</PrimaryButton>
						)}
					</StartExchangeButtonContainer>
				</StartExchangeModalContent>
			</Dialog.Root>

			<Dialog.Root
				open={endExchangeModalOpen}
				onOpenChange={setEndExchangeModalOpen}
			>
				<StartExchangeModalOverlay />
				<StartExchangeModalContent>
					<StartExchangeModalCloseButton asChild>
						<button>
							<X />
						</button>
					</StartExchangeModalCloseButton>
					<StartExchangeModalTitle>End Exchange?</StartExchangeModalTitle>

					<StartExchangeText>
						Are you sure you want to end this exchange? Once ended, participants
						will be able to see who their match is and can give their gifts.
					</StartExchangeText>

					<StartExchangeSection>
						<StartExchangeSectionTitle>
							What Will Happen
						</StartExchangeSectionTitle>
						<StartExchangeText>When you end the exchange:</StartExchangeText>
						<StartExchangeText style={{ marginLeft: "1rem" }}>
							• The name of their matched participant will be revealed
						</StartExchangeText>
						<StartExchangeText style={{ marginLeft: "1rem" }}>
							• They can continue to view their match&apos;s gift ideas
						</StartExchangeText>
						<StartExchangeText style={{ marginLeft: "1rem" }}>
							• They will be able to give their gifts to their match
						</StartExchangeText>
					</StartExchangeSection>

					<StartExchangeButtonContainer>
						<Button onClick={() => setEndExchangeModalOpen(false)}>
							Cancel
						</Button>
						<PrimaryButton onClick={handleConfirmEndExchange}>
							<CheckCircle />
							End Exchange
						</PrimaryButton>
					</StartExchangeButtonContainer>
				</StartExchangeModalContent>
			</Dialog.Root>

			<Dialog.Root
				open={deleteConfirmOpen}
				onOpenChange={(open) => {
					setDeleteConfirmOpen(open);
					if (!open) {
						setParticipantToDelete(null);
						setDeleteError(null);
					}
				}}
			>
				<DeleteConfirmModalOverlay />
				<DeleteConfirmModalContent>
					<DeleteConfirmModalCloseButton asChild>
						<button>
							<X />
						</button>
					</DeleteConfirmModalCloseButton>
					<DeleteConfirmModalTitle>Remove Participant</DeleteConfirmModalTitle>
					<DeleteConfirmModalDescription>
						Are you sure you want to remove{" "}
						<strong>
							{participantToDelete
								? `${participantToDelete.firstName} ${participantToDelete.lastName || ""}`.trim()
								: "this participant"}
						</strong>
						? This action cannot be undone and will permanently delete the
						participant and all their wishlist items.
					</DeleteConfirmModalDescription>
					{deleteError && (
						<DeleteConfirmError>{deleteError}</DeleteConfirmError>
					)}
					<DeleteConfirmButtonContainer>
						<SecondaryButton
							onClick={() => {
								setDeleteConfirmOpen(false);
								setParticipantToDelete(null);
								setDeleteError(null);
							}}
							disabled={removingParticipantId !== null}
						>
							Cancel
						</SecondaryButton>
						<DangerButton
							onClick={handleConfirmDeleteParticipant}
							disabled={removingParticipantId !== null}
						>
							{removingParticipantId !== null
								? "Removing..."
								: "Remove Participant"}
						</DangerButton>
					</DeleteConfirmButtonContainer>
				</DeleteConfirmModalContent>
			</Dialog.Root>

			<Dialog.Root
				open={deleteExchangeConfirmOpen}
				onOpenChange={(open) => {
					setDeleteExchangeConfirmOpen(open);
					if (!open) {
						setDeleteExchangeError(null);
					}
				}}
			>
				<DeleteConfirmModalOverlay />
				<DeleteConfirmModalContent>
					<DeleteConfirmModalCloseButton asChild>
						<button>
							<X />
						</button>
					</DeleteConfirmModalCloseButton>
					<DeleteConfirmModalTitle>Delete Exchange</DeleteConfirmModalTitle>
					<DeleteConfirmModalDescription>
						Are you sure you want to delete{" "}
						<strong>{exchange?.name || "this exchange"}</strong>? This action
						cannot be undone and will permanently delete the exchange, all
						participants, assignments, and wishlist items.
					</DeleteConfirmModalDescription>
					{deleteExchangeError && (
						<DeleteConfirmError>{deleteExchangeError}</DeleteConfirmError>
					)}
					<DeleteConfirmButtonContainer>
						<SecondaryButton
							onClick={() => {
								setDeleteExchangeConfirmOpen(false);
								setDeleteExchangeError(null);
							}}
							disabled={deletingExchange}
						>
							Cancel
						</SecondaryButton>
						<DangerButton
							onClick={handleConfirmDeleteExchange}
							disabled={deletingExchange}
						>
							{deletingExchange ? "Deleting..." : "Delete Exchange"}
						</DangerButton>
					</DeleteConfirmButtonContainer>
				</DeleteConfirmModalContent>
			</Dialog.Root>

			<CreateExchangeWizard
				open={wizardOpen}
				onOpenChange={setWizardOpen}
				onSuccess={() => {
					// Navigate to dashboard after creating exchange
					router.push("/dashboard");
				}}
			/>
		</DashboardLayout>
	);
}
