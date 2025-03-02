import { Button } from "@/components/ui/button";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Calendar, CloudSun, Info } from "lucide-react";
import type React from "react";

export function WelcomeMessage({
	handleInputChange,
	handleSubmitMessage,
}: {
	handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSubmitMessage: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center h-full py-4 sm:py-8 px-2 sm:px-4">
			<Card className="w-full max-w-[95%] sm:max-w-md mx-auto">
				<CardHeader className="px-4 sm:px-6">
					<CardTitle className="text-lg sm:text-xl text-center">
						Welcome to AI Chat Agent
					</CardTitle>
					<CardDescription className="text-center pt-2 text-sm">
						This is an interactive AI assistant that can help you with various
						tasks.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 px-4 sm:px-6">
					<p className="text-sm text-muted-foreground text-center">
						Try asking about:
					</p>
					<div className="grid gap-2">
						<Button
							variant="outline"
							className="justify-start text-left text-xs sm:text-sm break-words"
							onClick={() => {
								const event = {
									target: {
										value: "What's the weather like in New York today?",
									},
								} as React.ChangeEvent<HTMLTextAreaElement>;
								handleInputChange(event);
								handleSubmitMessage();
							}}
						>
							<CloudSun className="w-4 h-4 mr-2 flex-shrink-0" />
							<span className="line-clamp-2">
								"What's the weather like in New York today?"
							</span>
						</Button>
						<Button
							variant="outline"
							className="justify-start text-left text-xs sm:text-sm break-words"
							onClick={() => {
								const event = {
									target: { value: "Schedule a meeting for tomorrow at 3pm" },
								} as React.ChangeEvent<HTMLTextAreaElement>;
								handleInputChange(event);
								handleSubmitMessage();
							}}
						>
							<Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
							<span className="line-clamp-2">
								"Schedule a meeting for tomorrow at 3pm"
							</span>
						</Button>
						<Button
							variant="outline"
							className="justify-start text-left text-xs sm:text-sm break-words"
							onClick={() => {
								const event = {
									target: { value: "Tell me about this demo" },
								} as React.ChangeEvent<HTMLTextAreaElement>;
								handleInputChange(event);
								handleSubmitMessage();
							}}
						>
							<Info className="w-4 h-4 mr-2 flex-shrink-0" />
							<span className="line-clamp-2">"Tell me about this demo"</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
