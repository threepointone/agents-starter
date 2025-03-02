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
} from "@/components/ui/chat-message";
import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { useAgent } from "agents-sdk/react";
import { useAgentChat } from "agents-sdk/ai-react";

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

	const handleSubmitMessage = () => {
		if (isLoading) {
			return;
		}
		handleSubmit();
	};

	return (
		<div className="flex flex-col h-screen">
			<header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background border-b border-border">
				<div className="flex flex-1 items-center gap-2 px-3">
					Cloudflare Agents Starter
				</div>
			</header>
			<div className="flex-1 overflow-hidden">
				<ChatMessageArea scrollButtonAlignment="center" className="h-full">
					<div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-4">
						{messages.map((message) => {
							if (message.role !== "user") {
								return (
									<ChatMessage key={message.id} id={message.id}>
										<ChatMessageAvatar />
										<ChatMessageContent content={message.content} />
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
									<ChatMessageContent content={message.content} />
								</ChatMessage>
							);
						})}
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
				>
					<ChatInputTextArea placeholder="Type a message..." />
					<ChatInputSubmit />
				</ChatInput>
			</div>
		</div>
	);
}
