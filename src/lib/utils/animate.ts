function easeInOutCubic(x: number): number {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const animateInOutCubic = (
	start: number,
	end: number,
	duration: number,
	onUpdate: (x: number) => void,
): Promise<void> => {
	return new Promise<void>((resolve) => {
		const startTime = performance.now();
		const range = end - start;

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const easedProgress = easeInOutCubic(progress);
			const currentValue = start + range * easedProgress;

			onUpdate(currentValue);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				resolve();
			}
		};

		requestAnimationFrame(animate);
	});
};
