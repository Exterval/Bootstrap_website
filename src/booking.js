(function () {
            const options = Array.from(document.querySelectorAll('.booking-style-option'));
            const confirmBtn = document.getElementById('confirm-booking-style');
            const hint = document.getElementById('booking-style-hint');
            const details = document.getElementById('booking-details');
            const selectedLabel = document.getElementById('selected-style-label');

            const bookingForm = document.getElementById('booking-form');
            const addItemBtn = document.getElementById('add-item');
            const itemRows = document.getElementById('item-rows');

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

            function getItemRowCount() {
                if (!itemRows) return 0;
                return itemRows.querySelectorAll('[data-item-row]').length;
            }

            function addItemRow() {
                if (!itemRows) return;

                const nextIndex = getItemRowCount();
                const nextNumber = nextIndex + 1;

                const row = document.createElement('div');
                row.className = 'col-12';
                row.setAttribute('data-item-row', '');

                row.innerHTML = `
                    <div class="row g-3">
                        <div class="col-12 col-md-6">
                            <label class="form-label fw-semibold" for="itemName_${nextNumber}">Item Name <span class="text-danger">*</span></label>
                            <input id="itemName_${nextNumber}" name="items[${nextIndex}][name]" type="text" class="form-control" placeholder="e.g., Sofa, Desktop" required>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label fw-semibold" for="itemType_${nextNumber}">Item Type <span class="text-danger">*</span></label>
                            <select id="itemType_${nextNumber}" name="items[${nextIndex}][type]" class="form-select" required>
                                <option value="" selected disabled>Choose...</option>
                                <option>Furniture</option>
                                <option>Appliances</option>
                                <option>Boxes</option>
                                <option>Electronics</option>
                                <option>Documents</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label fw-semibold" for="itemQty_${nextNumber}">Item Quantity <span class="text-danger">*</span></label>
                            <input id="itemQty_${nextNumber}" name="items[${nextIndex}][quantity]" type="number" class="form-control" placeholder="e.g., 3" min="1" inputmode="numeric" required>
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="form-label fw-semibold" for="itemWeight_${nextNumber}">Est. Weight <span class="text-danger">*</span></label>
                            <input id="itemWeight_${nextNumber}" name="items[${nextIndex}][weight]" type="text" class="form-control" placeholder="e.g., Heavy (2 People)" required>
                        </div>
                    </div>
                `.trim();

                itemRows.appendChild(row);
                const focusEl = row.querySelector(`#itemName_${nextNumber}`);
                if (focusEl) focusEl.focus();
            }

            if (addItemBtn) {
                addItemBtn.addEventListener('click', addItemRow);
            }

            if (bookingForm) {
                bookingForm.addEventListener('submit', (event) => {
                    if (!bookingForm.checkValidity()) {
                        event.preventDefault();
                        bookingForm.reportValidity();
                        return;
                    }
                    // No backend wiring here; prevent accidental page reload.
                    event.preventDefault();
                });
            }
        })();