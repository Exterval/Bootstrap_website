(function () {
            const options = Array.from(document.querySelectorAll('.booking-style-option'));
            const confirmBtn = document.getElementById('confirm-booking-style');
            const hint = document.getElementById('booking-style-hint');
            const details = document.getElementById('booking-details');
            const selectedLabel = document.getElementById('selected-style-label');

            if (!options.length || !confirmBtn) return;

            const styleLabels = {
                'full-day': 'Full-day booking',
                'normal': 'Normal booking',
                'immediate': 'Immediate booking'
            };

            let selectedStyle = null;

            function setSelected(nextStyle) {
                selectedStyle = nextStyle;
                for (const option of options) {
                    const isSelected = option.dataset.bookingStyle === nextStyle;
                    option.classList.toggle('is-selected', isSelected);
                    option.setAttribute('aria-pressed', String(isSelected));
                }

                confirmBtn.disabled = !selectedStyle;
                if (hint) hint.textContent = selectedStyle ? 'Press confirm.' : 'Select one option to enable Confirm.';
            }

            for (const option of options) {
                option.addEventListener('click', () => setSelected(option.dataset.bookingStyle));
            }

            confirmBtn.addEventListener('click', () => {
                if (!selectedStyle) return;

                if (selectedLabel) selectedLabel.textContent = styleLabels[selectedStyle] || selectedStyle;
                if (details) {
                    details.classList.remove('d-none');
                    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        })();