"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import ExchangeStepper from "@/app/components/ExchangeStepper";
import { extractUrls, extractDomain, formatDomainName, getFaviconUrl } from "@/app/lib/link-preview-client";

const MAX_ITEMS_PER_PARTICIPANT = 10;

const WishlistContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${(props) => props.theme.lightMode.colors.background};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const WishlistCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: ${(props) => props.theme.lightMode.colors.background};
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-width: 100%;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ParticipantName = styled.div`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.lightMode.colors.foreground};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.muted};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WishlistHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const WishlistTitle = styled.h1`
  font-family: var(--font-space-grotesk), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const SpendingLimit = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const AddItemForm = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  background: ${(props) => props.theme.lightMode.colors.background};
  transition: all 0.2s ease;
  letter-spacing: -0.01em;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: ${(props) => props.theme.lightMode.colors.secondary};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.background};
`;

const ItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const ItemDescription = styled.span`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.foreground};
  flex: 1;
`;

const PreviewCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.lightMode.colors.muted || "#f9fafb"};
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.8125rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${(props) => props.theme.lightMode.colors.border};
  border-radius: 6px;
  background: ${(props) => props.theme.lightMode.colors.background};
  color: ${(props) => props.theme.lightMode.colors.foreground};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.lightMode.colors.muted};
    border-color: ${(props) => props.theme.lightMode.colors.foreground};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  background: ${(props) => props.theme.lightMode.colors.foreground};
  color: ${(props) => props.theme.lightMode.colors.background};

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.lightMode.colors.gray800};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  background: ${(props) => props.theme.lightMode.colors.error || "#fee2e2"};
  color: ${(props) => props.theme.lightMode.colors.errorText || "#991b1b"};
  border: 1px solid ${(props) => props.theme.lightMode.colors.errorBorder || "#fecaca"};
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmptyStateText = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9375rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
`;

const EmptyStateSubtext = styled.p`
  font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: ${(props) => props.theme.lightMode.colors.secondary};
  margin: 0;
  opacity: 0.8;
`;

interface WishlistItem {
  id: string;
  description: string;
  url?: string | null;
  previewImage?: string | null;
  previewTitle?: string | null;
  previewDescription?: string | null;
}

export default function WishlistPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const exchangeId = params?.id as string;
  const participantId = searchParams?.get("participantId");

  const [itemDescription, setItemDescription] = useState("");
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spendingLimit, setSpendingLimit] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [participantName, setParticipantName] = useState<string | null>(null);

  useEffect(() => {
    if (!exchangeId || !participantId) {
      router.push("/join");
      return;
    }

    // Fetch exchange details, existing wishlist items, and participant info
    const fetchData = async () => {
      try {
        const [exchangeResponse, itemsResponse, participantResponse] = await Promise.all([
          fetch(`/api/gift-exchanges/${exchangeId}`),
          fetch(`/api/participants/${participantId}/wishlist`),
          fetch(`/api/participants/${participantId}`),
        ]);

        if (!exchangeResponse.ok) {
          throw new Error("Failed to fetch exchange details");
        }

        const exchange = await exchangeResponse.json();
        setSpendingLimit(exchange.spendingLimit);
        setCurrency(exchange.currency);

        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          setItems(itemsData);
        }

        if (participantResponse.ok) {
          const participantData = await participantResponse.json();
          setParticipantName(`${participantData.firstName} ${participantData.lastName || ""}`.trim());
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load exchange details. Please try again.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [exchangeId, participantId, router]);

  const handleAddItem = async () => {
    if (!itemDescription.trim() || !participantId) return;
    if (items.length >= MAX_ITEMS_PER_PARTICIPANT) {
      setError(`Maximum of ${MAX_ITEMS_PER_PARTICIPANT} items allowed`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/participants/${participantId}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: itemDescription.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to add item");
        setLoading(false);
        return;
      }

      const newItem = await response.json();
      setItems([...items, newItem]);
      setItemDescription("");
      setLoading(false);
    } catch (error) {
      console.error("Error adding wishlist item:", error);
      setError("Failed to add item. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!participantId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/participants/${participantId}/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete item");
        setLoading(false);
        return;
      }

      setItems(items.filter((item) => item.id !== itemId));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      setError("Failed to delete item. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    // Redirect to exchanger dashboard
    router.push(`/exchange/${exchangeId}`);
  };

  if (fetching) {
    return (
      <WishlistContainer>
        <WishlistCard>
          <WishlistHeader>
            <WishlistTitle>Loading...</WishlistTitle>
          </WishlistHeader>
        </WishlistCard>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <WishlistCard>
        <HeaderRow>
          <BackButton onClick={() => router.push(`/exchange/${exchangeId}/register`)} aria-label="Go back">
            <ArrowLeft />
          </BackButton>
          {participantName && <ParticipantName>{participantName}</ParticipantName>}
        </HeaderRow>
        <ExchangeStepper currentStep={3} />
        <WishlistHeader>
          <WishlistTitle>Create Your Wishlist</WishlistTitle>
          {spendingLimit !== null && (
            <SpendingLimit>
              Spending Limit: {currency} ${spendingLimit}
            </SpendingLimit>
          )}
        </WishlistHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AddItemForm>
          <Input
            type="text"
            placeholder="Enter a gift idea..."
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
            disabled={loading || items.length >= MAX_ITEMS_PER_PARTICIPANT}
          />
          <AddButton
            onClick={handleAddItem}
            disabled={loading || !itemDescription.trim() || items.length >= MAX_ITEMS_PER_PARTICIPANT}
          >
            <Plus />
            Add
          </AddButton>
        </AddItemForm>

        {items.length >= MAX_ITEMS_PER_PARTICIPANT && (
          <ErrorMessage>
            Maximum of {MAX_ITEMS_PER_PARTICIPANT} items reached. Delete an item to add more.
          </ErrorMessage>
        )}

        <ItemsList>
          {items.length === 0 ? (
            <EmptyState>
              <EmptyStateText>No items yet. Add your first wishlist item above!</EmptyStateText>
              <EmptyStateSubtext>You can add product links too!</EmptyStateSubtext>
            </EmptyState>
          ) : (
            items.map((item) => (
              <ItemCard key={item.id}>
                <ItemContent>
                  <ItemDescription>
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
                                      <FaviconImage src={faviconUrl} alt={domainName} />
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
                  </ItemDescription>
                  <DeleteButton
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={loading}
                    aria-label="Delete item"
                  >
                    <Trash2 />
                  </DeleteButton>
                </ItemContent>
                {item.url && (item.previewImage || item.previewTitle || item.previewDescription) && (
                  <PreviewCard href={item.url} target="_blank" rel="noopener noreferrer">
                    <PreviewContentWrapper>
                      {item.previewImage && (
                        <PreviewImage src={item.previewImage} alt={item.previewTitle || "Preview"} />
                      )}
                      <PreviewContent>
                        {item.previewTitle && <PreviewTitle>{item.previewTitle}</PreviewTitle>}
                        {item.previewDescription && (
                          <PreviewDescription>{item.previewDescription}</PreviewDescription>
                        )}
                      </PreviewContent>
                    </PreviewContentWrapper>
                  </PreviewCard>
                )}
              </ItemCard>
            ))
          )}
        </ItemsList>

        <SubmitButton onClick={handleSubmit} disabled={loading || items.length === 0}>
          {items.length === 0 ? "Add at least one item to continue" : "Continue"}
        </SubmitButton>
      </WishlistCard>
    </WishlistContainer>
  );
}

