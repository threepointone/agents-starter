// Chat Message Component from simple-ai.dev

import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { type VariantProps, cva } from "class-variance-authority";
import { SparklesIcon, UserIcon } from "lucide-react";
import React, { type ReactNode } from "react";

const chatMessageVariants = cva("flex gap-4 w-full", {
	variants: {
		variant: {
			default: "",
			bubble: "",
			full: "p-5",
		},
		type: {
			incoming: "justify-start mr-auto",
			outgoing: "justify-end ml-auto",
		},
	},
	compoundVariants: [
		{
			variant: "full",
			type: "outgoing",
			className: "bg-muted",
		},
		{
			variant: "full",
			type: "incoming",
			className: "bg-background",
		},
	],
	defaultVariants: {
		variant: "default",
		type: "incoming",
	},
});

interface MessageContextValue extends VariantProps<typeof chatMessageVariants> {
	id: string;
}

const ChatMessageContext = React.createContext<MessageContextValue | null>(
	null,
);

const useChatMessage = () => {
	const context = React.useContext(ChatMessageContext);
	return context;
};

// Root component
interface ChatMessageProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof chatMessageVariants> {
	children?: React.ReactNode;
	id: string;
}

function ChatMessage({
	className,
	variant = "default",
	type = "incoming",
	id,
	children,
	...props
}: ChatMessageProps) {
	return (
		<ChatMessageContext.Provider value={{ variant, type, id }}>
			<div
				className={cn(chatMessageVariants({ variant, type, className }))}
				{...props}
			>
				{children}
			</div>
		</ChatMessageContext.Provider>
	);
}

// Avatar component

const chatMessageAvatarVariants = cva(
	"w-8 h-8 flex items-center rounded-full justify-center ring-1 shrink-0 bg-transparent overflow-hidden",
	{
		variants: {
			type: {
				incoming: "ring-border",
				outgoing: "ring-muted-foreground/30",
			},
		},
		defaultVariants: {
			type: "incoming",
		},
	},
);

interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	imageSrc?: string;
	icon?: ReactNode;
}

function ChatMessageAvatar({
	className,
	icon: iconProps,
	imageSrc,
	...props
}: ChatMessageAvatarProps) {
	const context = useChatMessage();
	const type = context?.type ?? "incoming";
	const icon =
		iconProps ?? (type === "incoming" ? <SparklesIcon /> : <UserIcon />);
	return (
		<div
			className={cn(chatMessageAvatarVariants({ type, className }))}
			{...props}
		>
			{imageSrc ? (
				<img
					src={imageSrc}
					alt="Avatar"
					className="h-full w-full object-cover p-1"
				/>
			) : (
				<div className="translate-y-px [&_svg]:size-4 [&_svg]:shrink-0">
					{icon}
				</div>
			)}
		</div>
	);
}

const chatMessageBodyVariants = cva("flex flex-col flex-1 gap-2", {
	variants: {
		type: {
			incoming: "",
			outgoing: "items-end",
		},
	},
	defaultVariants: {
		type: "incoming",
	},
});

interface ChatMessageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
}

function ChatMessageBody({
	className,
	children,
	...props
}: ChatMessageBodyProps) {
	const context = useChatMessage();
	const type = context?.type ?? "incoming";

	return (
		<div
			className={cn(chatMessageBodyVariants({ type, className }))}
			{...props}
		>
			{children}
		</div>
	);
}

const chatMessageTimestampVariants = cva("text-xs text-muted-foreground/75", {
	variants: {
		type: {
			incoming: "text-left",
			outgoing: "text-right",
		},
	},
	defaultVariants: {
		type: "incoming",
	},
});

interface ChatMessageTimestampProps
	extends React.HTMLAttributes<HTMLDivElement> {
	format?: (date: Date) => string;
	timestamp: Date;
}

function ChatMessageTimestamp({
	className,
	format,
	timestamp,
	...props
}: ChatMessageTimestampProps) {
	const context = useChatMessage();
	const type = context?.type ?? "incoming";

	const formatTimestamp = (date: Date) => {
		if (format) {
			return format(date);
		}

		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();
		const isThisYear = date.getFullYear() === now.getFullYear();

		if (isToday) {
			return date.toLocaleTimeString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		if (isThisYear) {
			return date.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		}

		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div
			className={cn(chatMessageTimestampVariants({ type, className }))}
			title={timestamp.toLocaleString()}
			{...props}
		>
			{formatTimestamp(timestamp)}
		</div>
	);
}

// Content component

const chatMessageContentVariants = cva("flex flex-col gap-2", {
	variants: {
		variant: {
			default: "",
			bubble: "rounded-xl px-3 py-2",
			full: "",
		},
		type: {
			incoming: "",
			outgoing: "",
		},
	},
	compoundVariants: [
		{
			variant: "bubble",
			type: "incoming",
			className: "bg-secondary text-secondary-foreground",
		},
		{
			variant: "bubble",
			type: "outgoing",
			className: "bg-primary text-primary-foreground",
		},
	],
	defaultVariants: {
		variant: "default",
		type: "incoming",
	},
});

interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
	id?: string;
	content: string;
}

function ChatMessageContent({
	className,
	content,
	id: idProp,
	children,
	...props
}: ChatMessageContentProps) {
	const context = useChatMessage();

	const variant = context?.variant ?? "default";
	const type = context?.type ?? "incoming";
	const id = idProp ?? context?.id ?? "";

	return (
		<div
			className={cn(chatMessageContentVariants({ variant, type, className }))}
			{...props}
		>
			{content.length > 0 && <MarkdownContent id={id} content={content} />}
			{children}
		</div>
	);
}

export {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageBody,
	ChatMessageContent,
	ChatMessageTimestamp,
};
