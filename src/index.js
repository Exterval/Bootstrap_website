(() => {
	const target = document.getElementById('hero-typing-text');
	if (!target) return;

	const phrases = [
		'Start booking now!',
		'Schedule your pickup today!'
	];

	const typingDelayMs = 70;
	const deletingDelayMs = 40;
	const pauseAfterTypedMs = 1100;
	const pauseAfterDeletedMs = 300;

	let phraseIndex = 0;
	let charIndex = 0;
	let isDeleting = false;

	function tick() {
		const current = phrases[phraseIndex];

		if (!isDeleting) {
			charIndex = Math.min(charIndex + 1, current.length);
			target.textContent = current.slice(0, charIndex);

			if (charIndex === current.length) {
				isDeleting = true;
				window.setTimeout(tick, pauseAfterTypedMs);
				return;
			}

			window.setTimeout(tick, typingDelayMs);
			return;
		}

		charIndex = Math.max(charIndex - 1, 0);
		target.textContent = current.slice(0, charIndex);

		if (charIndex === 0) {
			isDeleting = false;
			phraseIndex = (phraseIndex + 1) % phrases.length;
			window.setTimeout(tick, pauseAfterDeletedMs);
			return;
		}

		window.setTimeout(tick, deletingDelayMs);
	}

	// Start with empty text for the "typing" feel
	target.textContent = '';
	tick();
})();


