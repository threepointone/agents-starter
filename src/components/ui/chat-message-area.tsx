// Chat Message Area Component from simple-ai.dev

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type ScrollButtonAlignment = "left" | "center" | "right";

interface ScrollButtonProps {
	onClick: () => void;
	alignment?: ScrollButtonAlignment;
	className?: string;
}

export function ScrollButton({
	onClick,
	alignment = "right",
	className,
}: ScrollButtonProps) {
	const alignmentClasses = {
		left: "left-4",
		center: "left-1/2 -translate-x-1/2",
		right: "right-4",
	};

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"absolute bottom-4 rounded-full shadow-lg hover:bg-secondary",
				alignmentClasses[alignment],
				className,
			)}
			onClick={onClick}
		>
			<ChevronDown className="h-4 w-4" />
		</Button>
	);
}

interface ChatMessageAreaProps {
	children: ReactNode;
	className?: string;
	scrollButtonAlignment?: ScrollButtonAlignment;
}

export function ChatMessageArea({
	children,
	className,
	scrollButtonAlignment = "right",
}: ChatMessageAreaProps) {
	const [containerRef, showScrollButton, scrollToBottom] =
		useScrollToBottom<HTMLDivElement>();

	return (
		<div className={cn("relative", className)}>
			<ScrollArea className="h-full">
				<div ref={containerRef}>{children}</div>
			</ScrollArea>
			{showScrollButton && (
				<ScrollButton
					onClick={scrollToBottom}
					alignment={scrollButtonAlignment}
					className="absolute bottom-4 rounded-full shadow-lg hover:bg-secondary"
				/>
			)}
		</div>
	);
}

ChatMessageArea.displayName = "ChatMessageArea";
