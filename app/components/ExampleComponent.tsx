"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.lightMode.colors.background};
  color: ${({ theme }) => theme.lightMode.colors.foreground};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.lightMode.colors.primary};
`;

const Description = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.lightMode.colors.secondary};
  text-align: center;
  max-width: 600px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: 2px solid ${({ theme }) => theme.lightMode.colors.border};
  background-color: ${({ theme }) => theme.lightMode.colors.background};
  color: ${({ theme }) => theme.lightMode.colors.foreground};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.lightMode.colors.muted};
    border-color: ${({ theme }) => theme.lightMode.colors.primary};
  }
`;

const DialogContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.lightMode.colors.background};
  border: 2px solid ${({ theme }) => theme.lightMode.colors.border};
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 4px 6px ${({ theme }) => theme.lightMode.colors.gray900}20;
`;

const DialogTitle = styled(Dialog.Title)`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.lightMode.colors.foreground};
`;

const DialogDescription = styled(Dialog.Description)`
  color: ${({ theme }) => theme.lightMode.colors.secondary};
  margin-bottom: 1.5rem;
`;

const DialogClose = styled(Dialog.Close)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.lightMode.colors.border};
  background-color: ${({ theme }) => theme.lightMode.colors.background};
  color: ${({ theme }) => theme.lightMode.colors.foreground};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.lightMode.colors.muted};
  }
`;

const TooltipContent = styled(Tooltip.Content)`
  background-color: ${({ theme }) => theme.lightMode.colors.gray900};
  color: ${({ theme }) => theme.lightMode.colors.white};
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;

export default function ExampleComponent() {
	return (
		<Container>
			<Title>Welcome to IncogniGift</Title>
			<Description>
				This is an example component demonstrating Radix UI and
				styled-components integration with a grayscale theme system.
			</Description>

			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger asChild>
						<Dialog.Root>
							<Dialog.Trigger asChild>
								<Button>Open Dialog</Button>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay
									style={{
										position: "fixed",
										inset: 0,
										backgroundColor: "rgba(0, 0, 0, 0.5)",
									}}
								/>
								<DialogContent>
									<DialogTitle>Example Dialog</DialogTitle>
									<DialogDescription>
										This dialog is built with Radix UI and styled with
										styled-components using the theme system.
									</DialogDescription>
									<DialogClose>Close</DialogClose>
								</DialogContent>
							</Dialog.Portal>
						</Dialog.Root>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<TooltipContent>
							<Tooltip.Arrow />
							Click to open a dialog
						</TooltipContent>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
		</Container>
	);
}
