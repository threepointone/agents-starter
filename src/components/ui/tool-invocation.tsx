import { Card } from "@/components/ui/card";
import { idToReadableText } from "@/lib/id-parsing";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface ToolInvocationContextValue {
	collapsible: boolean;
	id?: string;
}

const ToolInvocationContext =
	React.createContext<ToolInvocationContextValue | null>(null);

export const useToolInvocation = () => {
	const context = React.useContext(ToolInvocationContext);
	if (!context) {
		throw new Error(
			"Tool Invocation components must be used within a ToolInvocationComponent",
		);
	}
	return context;
};

export function ToolInvocationHeader({
	children,
}: { children: React.ReactNode }) {
	return <div className="flex gap-2">{children}</div>;
}

export function ToolInvocationBody({
	children,
}: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-2 pb-2">{children}</div>;
}

export function ToolNameComponent({
	name,
	capitalize = true,
}: { name: string; capitalize?: boolean }) {
	return (
		<span className="flex items-center gap-2">
			<div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
			<span className="font-medium">
				{idToReadableText(name, { capitalize })}
			</span>
		</span>
	);
}

function renderObjectAsListItems(obj: unknown, level = 0) {
	if (typeof obj !== "object" || obj === null) {
		return <span>{String(obj)}</span>;
	}

	return (
		<ul className={`list-disc ${level === 0 ? "" : "ml-4"}`}>
			{Object.entries(obj).map(([key, value]) => (
				<li key={key} className="mt-1">
					<span className="font-medium">{idToReadableText(key)}:</span>{" "}
					{renderObjectAsListItems(value, level + 1)}
				</li>
			))}
		</ul>
	);
}

export function ToolInvocationDataTrigger() {
	return (
		<CollapsibleTrigger className="hover:text-accent-foreground transition-colors">
			<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
		</CollapsibleTrigger>
	);
}

export function ToolInvocationData({
	data,
	collapsible,
}: {
	data: unknown;
	collapsible?: boolean;
}) {
	const context = useToolInvocation();
	const isCollapsible = collapsible ?? context.collapsible;

	if (!isCollapsible) {
		return (
			<div className="pl-4">
				{typeof data === "string" ? (
					<span className="text-sm">{data}</span>
				) : (
					<div className="text-sm">{renderObjectAsListItems(data)}</div>
				)}
			</div>
		);
	}
	return (
		<CollapsibleContent className="pl-4 pb-1">
			{typeof data === "string" ? (
				<span className="text-sm">{data}</span>
			) : (
				<div className="text-sm">{renderObjectAsListItems(data)}</div>
			)}
		</CollapsibleContent>
	);
}

export function ToolInvocationConfirmation({
	onConfirm,
	onCancel,
}: {
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<div className="flex gap-2">
			<Button onClick={onConfirm}>Confirm</Button>
			<Button variant="destructive" onClick={onCancel}>
				Cancel
			</Button>
		</div>
	);
}

export interface ToolInvocationProps {
	children: React.ReactNode;
	collapsible?: boolean;
	id?: string;
}

export function ToolInvocationComponent({
	children,
	collapsible = false,
	id,
}: ToolInvocationProps) {
	const contextValue = React.useMemo(
		() => ({
			collapsible,
			id,
		}),
		[collapsible, id],
	);

	if (collapsible) {
		return (
			<ToolInvocationContext.Provider value={contextValue}>
				<Collapsible>
					<Card className="w-fit p-4 flex flex-col gap-2 pb-1">{children}</Card>
				</Collapsible>
			</ToolInvocationContext.Provider>
		);
	}
	return (
		<ToolInvocationContext.Provider value={contextValue}>
			<Card className="w-fit p-4 flex flex-col gap-2 pb-1">{children}</Card>
		</ToolInvocationContext.Provider>
	);
}
