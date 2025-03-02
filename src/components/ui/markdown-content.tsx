// Markdown Content Component from simple-ai.dev

import { cn } from "@/lib/utils";
import { marked } from "marked";
import type * as React from "react";
import { Suspense, isValidElement, memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_PRE_BLOCK_CLASS =
	"my-4 overflow-x-auto w-fit rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-900 border border-border p-4";

const extractTextContent = (node: React.ReactNode): string => {
	if (typeof node === "string") {
		return node;
	}
	if (Array.isArray(node)) {
		return node.map(extractTextContent).join("");
	}
	if (isValidElement(node)) {
		// @ts-expect-error
		return extractTextContent(node.props.children);
	}
	return "";
};

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
	language: string;
}

const HighlightedPre = memo(
	async ({ children, className, language, ...props }: HighlightedPreProps) => {
		const { codeToTokens, bundledLanguages } = await import("shiki");
		const code = extractTextContent(children);

		if (!(language in bundledLanguages)) {
			return (
				<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
					<code className="whitespace-pre-wrap">{children}</code>
				</pre>
			);
		}

		const { tokens } = await codeToTokens(code, {
			lang: language as keyof typeof bundledLanguages,
			themes: {
				light: "github-dark",
				dark: "github-dark",
			},
		});

		return (
			<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
				<code className="whitespace-pre-wrap">
					{tokens.map((line, lineIndex) => (
						<span
							key={`line-${
								// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
								lineIndex
							}`}
						>
							{line.map((token, tokenIndex) => {
								const style =
									typeof token.htmlStyle === "string"
										? undefined
										: token.htmlStyle;

								return (
									<span
										key={`token-${
											// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
											tokenIndex
										}`}
										style={style}
									>
										{token.content}
									</span>
								);
							})}
							{lineIndex !== tokens.length - 1 && "\n"}
						</span>
					))}
				</code>
			</pre>
		);
	},
);

HighlightedPre.displayName = "HighlightedPre";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
	language: string;
}

const CodeBlock = ({
	children,
	language,
	className,
	...props
}: CodeBlockProps) => {
	return (
		<Suspense
			fallback={
				<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
					<code className="whitespace-pre-wrap">{children}</code>
				</pre>
			}
		>
			<HighlightedPre language={language} {...props}>
				{children}
			</HighlightedPre>
		</Suspense>
	);
};

CodeBlock.displayName = "CodeBlock";

const components: Partial<Components> = {
	h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1 className="mt-2 scroll-m-20 text-4xl font-bold" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2
			className="mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
			{...props}
		>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3
			className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight"
			{...props}
		>
			{children}
		</h3>
	),
	h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h4
			className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
			{...props}
		>
			{children}
		</h4>
	),
	h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h5
			className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
			{...props}
		>
			{children}
		</h5>
	),
	h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h6
			className="mt-4 scroll-m-20 text-base font-semibold tracking-tight"
			{...props}
		>
			{children}
		</h6>
	),
	p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p className="leading-6 [&:not(:first-child)]:mt-4" {...props}>
			{children}
		</p>
	),
	strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<span className="font-semibold" {...props}>
			{children}
		</span>
	),
	a: ({
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
		<a
			className="font-medium underline underline-offset-4"
			target="_blank"
			rel="noreferrer"
			{...props}
		>
			{children}
		</a>
	),
	ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className="my-4 ml-6 list-decimal" {...props}>
			{children}
		</ol>
	),
	ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className="my-4 ml-6 list-disc" {...props}>
			{children}
		</ul>
	),
	li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
		<li className="mt-2" {...props}>
			{children}
		</li>
	),
	blockquote: ({
		children,
		...props
	}: React.HTMLAttributes<HTMLQuoteElement>) => (
		<blockquote className="mt-4 border-l-2 pl-6 italic" {...props}>
			{children}
		</blockquote>
	),
	hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
		<hr className="my-4 md:my-8" {...props} />
	),
	table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-y-auto">
			<table
				className="relative w-full overflow-hidden border-none text-sm"
				{...props}
			>
				{children}
			</table>
		</div>
	),
	tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr className="last:border-b-none m-0 border-b" {...props}>
			{children}
		</tr>
	),
	th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<th
			className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
			{...props}
		>
			{children}
		</th>
	),
	td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<td
			className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
			{...props}
		>
			{children}
		</td>
	),
	img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// biome-ignore lint/a11y/useAltText: alt is not required
		<img className="rounded-md" alt={alt} {...props} />
	),
	code: ({ children, node, className, ...props }) => {
		const match = /language-(\w+)/.exec(className || "");
		if (match) {
			return (
				<CodeBlock language={match[1]} className={className} {...props}>
					{children}
				</CodeBlock>
			);
		}
		return (
			<code
				className={cn(
					"rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
					className,
				)}
				{...props}
			>
				{children}
			</code>
		);
	},
	pre: ({ children }) => <>{children}</>,
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
	if (!markdown) {
		return [];
	}
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
	content: string;
}

const MemoizedMarkdownBlock = memo(
	({ content }: MarkdownBlockProps) => {
		return (
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) {
			return false;
		}
		return true;
	},
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
	content: string;
	id: string;
}

export const MarkdownContent = memo(({ content, id }: MarkdownContentProps) => {
	const blocks = useMemo(
		() => parseMarkdownIntoBlocks(content || ""),
		[content],
	);

	return blocks.map((block, index) => (
		<MemoizedMarkdownBlock
			content={block}
			key={`${id}-block_${
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				index
			}`}
		/>
	));
});

MarkdownContent.displayName = "MarkdownContent";
