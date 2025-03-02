import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
	RefObject<T | null>,
	boolean,
	() => void,
] {
	const containerRef = useRef<T>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
	const isUserScrolling = useRef(false);
	const isGrowing = useRef(false);

	const getViewport = useCallback((element: HTMLElement | null) => {
		return element?.closest("[data-radix-scroll-area-viewport]") as HTMLElement;
	}, []);

	const isAtBottom = useCallback((viewport: HTMLElement) => {
		const { scrollTop, scrollHeight, clientHeight } = viewport;
		return Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
	}, []);

	const updateScrollState = useCallback(
		(viewport: HTMLElement) => {
			const { scrollHeight, clientHeight } = viewport;
			const hasScrollableContent = scrollHeight > clientHeight;
			const atBottom = isAtBottom(viewport);

			setShowScrollButton(hasScrollableContent && !atBottom);

			if (!isUserScrolling.current) {
				setShouldAutoScroll(atBottom);
			}
		},
		[isAtBottom],
	);

	useEffect(() => {
		const container = containerRef.current;
		const viewport = getViewport(container);

		if (!container || !viewport) {
			return;
		}

		updateScrollState(viewport);

		const handleScroll = () => {
			if (!isUserScrolling.current) {
				updateScrollState(viewport);
			}
		};

		const handleTouchStart = () => {
			isUserScrolling.current = true;
		};

		const handleTouchEnd = () => {
			isUserScrolling.current = false;
			updateScrollState(viewport);
		};

		let growthTimeout: number;
		const observer = new MutationObserver(() => {
			isGrowing.current = true;
			window.clearTimeout(growthTimeout);

			if (shouldAutoScroll && !isUserScrolling.current) {
				viewport.scrollTo({
					top: viewport.scrollHeight,
					behavior: "instant",
				});
			}
			updateScrollState(viewport);

			growthTimeout = window.setTimeout(() => {
				isGrowing.current = false;
			}, 100);
		});

		viewport.addEventListener("scroll", handleScroll, { passive: true });
		viewport.addEventListener("touchstart", handleTouchStart);
		viewport.addEventListener("touchend", handleTouchEnd);

		observer.observe(container, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});

		return () => {
			window.clearTimeout(growthTimeout);
			observer.disconnect();
			viewport.removeEventListener("scroll", handleScroll);
			viewport.removeEventListener("touchstart", handleTouchStart);
			viewport.removeEventListener("touchend", handleTouchEnd);
		};
	}, [getViewport, updateScrollState, shouldAutoScroll]);

	const scrollToBottom = () => {
		const viewport = getViewport(containerRef.current);
		if (!viewport) {
			return;
		}

		setShouldAutoScroll(true);
		viewport.scrollTo({
			top: viewport.scrollHeight,
			behavior: isGrowing.current ? "instant" : "smooth",
		});
	};

	return [containerRef, showScrollButton, scrollToBottom];
}
