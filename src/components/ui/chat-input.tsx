// Chat Input Component from simple-ai.dev
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ArrowUpIcon } from "lucide-react";
import type React from "react";
import { createContext, useContext } from "react";

interface ChatInputContextValue {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
	variant?: "default" | "unstyled";
	rows?: number;
	disabled?: boolean;
}

const ChatInputContext = createContext<ChatInputContextValue>({});

interface ChatInputProps extends Omit<ChatInputContextValue, "variant"> {
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "unstyled";
	rows?: number;
	disabled?: boolean;
}

function ChatInput({
	children,
	className,
	variant = "default",
	value,
	onChange,
	onSubmit,
	loading,
	onStop,
	rows = 1,
	disabled,
}: ChatInputProps) {
	const contextValue: ChatInputContextValue = {
		value,
		onChange,
		onSubmit,
		loading,
		onStop,
		variant,
		rows,
		disabled,
	};

	return (
		<ChatInputContext.Provider value={contextValue}>
			<div
				className={cn(
					variant === "default" &&
						"flex flex-col items-end w-full p-2 rounded-2xl border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden",
					variant === "unstyled" && "flex items-start gap-2 w-full",
					className,
				)}
			>
				{children}
			</div>
		</ChatInputContext.Provider>
	);
}

interface ChatInputTextAreaProps extends React.ComponentProps<typeof Textarea> {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	variant?: "default" | "unstyled";
	disabled?: boolean;
}

function ChatInputTextArea({
	onSubmit: onSubmitProp,
	value: valueProp,
	onChange: onChangeProp,
	className,
	variant: variantProp,
	disabled: disabledProp,
	...props
}: ChatInputTextAreaProps) {
	const context = useContext(ChatInputContext);
	const value = valueProp ?? context.value ?? "";
	const onChange = onChangeProp ?? context.onChange;
	const onSubmit = onSubmitProp ?? context.onSubmit;
	const rows = context.rows ?? 1;
	const disabled = disabledProp ?? context.disabled ?? false;

	const variant =
		variantProp ?? (context.variant === "default" ? "unstyled" : "default");

	const textareaRef = useTextareaResize(value, rows);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!onSubmit) {
			return;
		}
		if (e.key === "Enter" && !e.shiftKey) {
			if (typeof value !== "string" || value.trim().length === 0) {
				return;
			}
			e.preventDefault();
			onSubmit();
		}
	};

	return (
		<Textarea
			ref={textareaRef}
			{...props}
			value={value}
			onChange={onChange}
			onKeyDown={handleKeyDown}
			className={cn(
				"max-h-[400px] min-h-0 resize-none overflow-x-hidden",
				variant === "unstyled" &&
					"border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
				//disabled && "cursor-not-allowed opacity-50",
				className,
			)}
			rows={rows}
			disabled={disabled}
		/>
	);
}

interface ChatInputSubmitProps extends React.ComponentProps<typeof Button> {
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
	disabled?: boolean;
}

function ChatInputSubmit({
	onSubmit: onSubmitProp,
	loading: loadingProp,
	onStop: onStopProp,
	className,
	disabled: disabledProp,
	...props
}: ChatInputSubmitProps) {
	const context = useContext(ChatInputContext);
	const loading = loadingProp ?? context.loading;
	const onStop = onStopProp ?? context.onStop;
	const onSubmit = onSubmitProp ?? context.onSubmit;
	const disabled = disabledProp ?? context.disabled ?? false;

	if (loading && onStop) {
		return (
			<Button
				size="icon"
				onClick={onStop}
				className={cn(
					"shrink-0 rounded-full border dark:border-zinc-600",
					className,
				)}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-label="Stop"
				>
					<title>Stop</title>
					<rect x="6" y="6" width="12" height="12" />
				</svg>
			</Button>
		);
	}

	const isDisabled =
		disabled ||
		typeof context.value !== "string" ||
		context.value.trim().length === 0;

	return (
		<Button
			size="icon"
			className={cn(
				"shrink-0 rounded-full border dark:border-zinc-600",
				className,
			)}
			disabled={isDisabled}
			onClick={(event) => {
				event.preventDefault();
				if (!isDisabled) {
					onSubmit?.();
				}
			}}
			{...props}
		>
			<ArrowUpIcon />
		</Button>
	);
}

export { ChatInput, ChatInputTextArea, ChatInputSubmit };
