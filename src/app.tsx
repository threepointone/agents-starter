import type { tools } from "./tools";
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/components/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
	ChatMessageTimestamp,
	ChatMessageBody,
} from "@/components/ui/chat-message";
import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { useAgent } from "agents-sdk/react";
import { useAgentChat } from "agents-sdk/ai-react";
import type { Message } from "@ai-sdk/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { cn } from "./lib/utils";
import { WelcomeMessage } from "@/components/welcome-message";
import {
	ToolNameComponent,
	ToolInvocationHeader,
	ToolInvocationComponent,
	ToolInvocationData,
	ToolInvocationDataTrigger,
	ToolInvocationBody,
	ToolInvocationConfirmation,
} from "@/components/ui/tool-invocation";
import { APPROVAL } from "./shared";

// List of tools that require human confirmation
const toolsRequiringConfirmation: (keyof typeof tools)[] = [
	"getWeatherInformation",
];

export default function App() {
	const agent = useAgent({
		agent: "chat",
	});

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		addToolResult,
		clearHistory,
		stop,
	} = useAgentChat({
		agent,
		maxSteps: 5,
	});

	const pendingToolCallConfirmation = messages.some((m: Message) =>
		m.parts?.some(
			(part) =>
				part.type === "tool-invocation" &&
				part.toolInvocation.state === "call" &&
				toolsRequiringConfirmation.includes(
					part.toolInvocation.toolName as keyof typeof tools,
				),
		),
	);

	const handleSubmitMessage = () => {
		if (isLoading) {
			return;
		}
		handleSubmit();
	};

	useEffect(() => {
		console.log("messages", JSON.parse(JSON.stringify(messages)));
	}, [messages]);

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<div className="flex flex-col h-screen">
				<header className="sticky top-0 shrink-0 bg-background border-b border-border p-3">
					<div className="w-full max-w-screen-md mx-auto flex flex-col sm:flex-row justify-between gap-4 px-2 md:px-4">
						<div className="flex flex-col items-start">
							<div className="flex items-center gap-3">
								<img src="/favicon.ico" alt="logo" className="size-8" />
								<h1 className="text-xl md:text-2xl font-bold">AI Chat Agent</h1>
							</div>

							<div className="flex flex-wrap justify-start md:justify-start text-sm text-muted-foreground gap-2">
								<p>
									Powered by{" "}
									<a
										href="https://www.npmjs.com/package/agents-sdk"
										className="underline hover:text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										Cloudflare Agents
									</a>
								</p>
								<p>•</p>
								<p>
									UI by{" "}
									<a
										href="https://simple-ai.dev"
										className="underline hover:text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										simple-ai
									</a>
								</p>
							</div>
						</div>
						<div className="flex justify-start items-center gap-2 sm:py-2">
							<Button
								variant="outline"
								size="sm"
								onClick={clearHistory}
								className="flex items-center gap-2"
							>
								<TrashIcon />
								Clear history
							</Button>
							<Separator orientation="vertical" />
							<ThemeToggle />
						</div>
					</div>
				</header>
				<div className="flex-1 overflow-hidden">
					<ChatMessageArea scrollButtonAlignment="center" className="h-full">
						<div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-4">
							{messages.length === 0 ? (
								<WelcomeMessage
									handleInputChange={handleInputChange}
									handleSubmitMessage={handleSubmitMessage}
								/>
							) : (
								messages.map((message: Message) => {
									if (message.role !== "user") {
										return (
											<ChatMessage key={message.id} id={message.id}>
												<ChatMessageAvatar imageSrc="/favicon.ico" />
												<ChatMessageBody>
													<ChatMessageTimestamp
														timestamp={
															message.createdAt
																? new Date(message.createdAt)
																: new Date()
														}
													/>
													{message.parts?.map((part, index) => {
														switch (part.type) {
															case "text":
																return (
																	<ChatMessageContent
																		key={`${message.id}-text-${index}`}
																		content={part.text.replace(
																			/^scheduled message: /,
																			"",
																		)}
																		className={cn(
																			part.text.startsWith(
																				"scheduled-message",
																			) && "font-bold",
																		)}
																	/>
																);
															case "tool-invocation": {
																const toolName = part.toolInvocation.toolName;
																const args = part.toolInvocation.args;
																const toolId = part.toolInvocation.toolCallId;
																const toolState = part.toolInvocation.state;
																if (
																	toolsRequiringConfirmation.includes(
																		toolName as keyof typeof tools,
																	)
																) {
																	if (
																		toolState === "call" ||
																		toolState === "result"
																	) {
																		return (
																			<ToolInvocationComponent
																				key={toolId}
																				collapsible={true}
																			>
																				<ToolInvocationHeader>
																					<ToolNameComponent
																						name={
																							toolState === "call"
																								? `Confirm ${toolName}`
																								: `Used ${toolName}`
																						}
																					/>
																					<ToolInvocationDataTrigger />
																				</ToolInvocationHeader>
																				<ToolInvocationBody>
																					<ToolInvocationData data={args} />
																					{toolState === "call" && (
																						<ToolInvocationConfirmation
																							onConfirm={() =>
																								addToolResult({
																									toolCallId: toolId,
																									result: APPROVAL.YES,
																								})
																							}
																							onCancel={() =>
																								addToolResult({
																									toolCallId: toolId,
																									result: APPROVAL.NO,
																								})
																							}
																						/>
																					)}
																				</ToolInvocationBody>
																			</ToolInvocationComponent>
																		);
																	}
																}
															}
														}
													})}
												</ChatMessageBody>
											</ChatMessage>
										);
									}
									return (
										<ChatMessage
											key={message.id}
											id={message.id}
											variant="bubble"
											type="outgoing"
										>
											<ChatMessageBody>
												<ChatMessageTimestamp
													timestamp={
														message.createdAt
															? new Date(message.createdAt)
															: new Date()
													}
												/>
												<ChatMessageContent content={message.content} />
											</ChatMessageBody>
										</ChatMessage>
									);
								})
							)}
						</div>
					</ChatMessageArea>
				</div>
				<div className="px-2 py-4 max-w-2xl mx-auto w-full">
					<ChatInput
						value={input}
						onChange={handleInputChange}
						onSubmit={handleSubmitMessage}
						loading={isLoading}
						onStop={stop}
						disabled={pendingToolCallConfirmation}
					>
						<ChatInputTextArea
							placeholder={
								pendingToolCallConfirmation
									? "Please respond to the tool confirmation above..."
									: "Type your message here..."
							}
						/>
						<ChatInputSubmit />
					</ChatInput>
				</div>
			</div>
		</ThemeProvider>
	);
}
