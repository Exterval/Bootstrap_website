// Booking System Manager
const BookingSystem = {
    // DOM Elements
    elements: {
        bookingForm: null,
        itemRows: null,
        addItemBtn: null,
        confirmBookingBtn: null,
        bookingStyleModal: null,
        bookingStyleModalEl: null,
        selectedLabel: null,
        changeStyleBtn: null,
        confirmBtn: null,
        hint: null,
        details: null,
        options: []
    },

    // Constants
    BODY_OPEN_CLASS: 'pqrs-booking-style-open',
    FALLBACK_BACKDROP_CLASS: 'pqrs-booking-style-fallback-backdrop',
    
    styleLabels: {
        'full-day': 'Full-day Booking',
        'normal': 'Normal Booking',
        'immediate': 'Immediate Booking'
    },

    // State
    selectedStyle: null,

    // Initialize the booking system
    init: function() {
        this.cacheDOMElements();
        
        if (!this.elements.options.length || !this.elements.confirmBtn) {
            console.warn('Required booking elements not found');
            return;
        }

        this.initializeBookingStyleModal();
        this.initializeItemManagement();
        this.initializeFormValidation();
        this.attachEventListeners();
        this.showBookingStyleModal();
    },

    // Cache all DOM elements
    cacheDOMElements: function() {
        this.elements.bookingForm = document.getElementById('booking-form');
        this.elements.itemRows = document.getElementById('item-rows');
        this.elements.addItemBtn = document.getElementById('add-item');
        this.elements.confirmBookingBtn = document.getElementById('confirm-booking');
        this.elements.bookingStyleModalEl = document.getElementById('booking-style-modal');
        this.elements.selectedLabel = document.getElementById('selected-style-label');
        this.elements.changeStyleBtn = document.getElementById('change-booking-style');
        this.elements.confirmBtn = document.getElementById('confirm-booking-style');
        this.elements.hint = document.getElementById('booking-style-hint');
        this.elements.details = document.getElementById('booking-details');
        this.elements.options = Array.from(document.querySelectorAll('.booking-style-option'));

        if (this.elements.bookingStyleModalEl && window.bootstrap && window.bootstrap.Modal) {
            this.elements.bookingStyleModal = new window.bootstrap.Modal(
                this.elements.bookingStyleModalEl, 
                { backdrop: 'static', keyboard: false }
            );
        }
    },

    // Modal management functions
    setBodyOpen: function(isOpen) {
        document.body.classList.toggle(this.BODY_OPEN_CLASS, isOpen);
    },

    ensureFallbackBackdrop: function() {
        if (document.querySelector(`.${this.FALLBACK_BACKDROP_CLASS}`)) return;

        const backdrop = document.createElement('div');
        backdrop.className = `modal-backdrop fade show ${this.FALLBACK_BACKDROP_CLASS}`;
        document.body.appendChild(backdrop);
    },

    removeFallbackBackdrop: function() {
        const backdrop = document.querySelector(`.${this.FALLBACK_BACKDROP_CLASS}`);
        if (backdrop) backdrop.remove();
    },

    // Booking style selection
    setSelectedStyle: function(style) {
        this.selectedStyle = style;
        
        this.elements.options.forEach(option => {
            const isSelected = option.dataset.bookingStyle === style;
            option.classList.toggle('is-selected', isSelected);
            option.setAttribute('aria-pressed', String(isSelected));
        });

        this.elements.confirmBtn.disabled = !this.selectedStyle;
        
        if (this.elements.hint) {
            this.elements.hint.textContent = this.selectedStyle 
                ? 'Press confirm.' 
                : 'Select one option to enable Confirm.';
        }
    },

    confirmBookingStyle: function() {
        if (!this.selectedStyle) return;

        if (this.elements.selectedLabel) {
            this.elements.selectedLabel.textContent = this.styleLabels[this.selectedStyle] || this.selectedStyle;
            this.elements.selectedLabel.className = 'booking-' + this.selectedStyle;
        }

        if (this.elements.details) {
            this.elements.details.classList.remove('d-none');
            this.elements.details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        this.hideBookingStyleModal();
    },

    showBookingStyleModal: function() {
        if (this.elements.bookingStyleModal) {
            window.setTimeout(() => this.elements.bookingStyleModal.show(), 0);
        } else if (this.elements.bookingStyleModalEl) {
            this.elements.bookingStyleModalEl.classList.add('show');
            this.elements.bookingStyleModalEl.style.display = 'block';
            this.elements.bookingStyleModalEl.removeAttribute('aria-hidden');
            this.ensureFallbackBackdrop();
            this.setBodyOpen(true);
        }
    },

    hideBookingStyleModal: function() {
        if (this.elements.bookingStyleModal) {
            this.elements.bookingStyleModal.hide();
        } else if (this.elements.bookingStyleModalEl) {
            this.elements.bookingStyleModalEl.classList.remove('show');
            this.elements.bookingStyleModalEl.style.display = 'none';
            this.elements.bookingStyleModalEl.setAttribute('aria-hidden', 'true');
            this.removeFallbackBackdrop();
            this.setBodyOpen(false);
        }
    },

    // Item management
    getItemRowCount: function() {
        if (!this.elements.itemRows) return 0;
        return this.elements.itemRows.querySelectorAll('[data-item-row]').length;
    },

    createItemRow: function() {
        if (!this.elements.itemRows) return;

        const nextIndex = this.getItemRowCount();
        const nextNumber = nextIndex + 1;

        const row = document.createElement('div');
        row.className = 'col-12';
        row.setAttribute('data-item-row', '');

        row.innerHTML = `
            <div class="item-row-container">
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
                <button type="button" class="remove-item-btn" data-remove-item aria-label="Remove this item">
                    <i class="bi bi-trash"></i> Remove Item
                </button>
            </div>
        `;

        this.elements.itemRows.appendChild(row);
        this.updateRemoveButtons();
        
        const focusEl = row.querySelector(`#itemName_${nextNumber}`);
        if (focusEl) focusEl.focus();
    },

    updateRemoveButtons: function() {
        if (!this.elements.itemRows) return;

        const allItemRows = this.elements.itemRows.querySelectorAll('[data-item-row]');
        const count = allItemRows.length;
        
        allItemRows.forEach(row => {
            const removeBtn = row.querySelector('[data-remove-item]');
            if (removeBtn) {
                removeBtn.style.display = count > 1 ? 'inline-flex' : 'none';
            }
        });
    },

    removeItemRow: function(button) {
        const row = button.closest('[data-item-row]');
        if (!row || !this.elements.itemRows) return;
        
        const allItemRows = this.elements.itemRows.querySelectorAll('[data-item-row]');
        if (allItemRows.length <= 1) return;
        
        row.remove();
        this.updateRemoveButtons();
        this.updateConfirmButton();
    },

    // Form validation
    validateForm: function() {
        if (!this.elements.bookingForm) return false;
        
        const requiredInputs = this.elements.bookingForm.querySelectorAll('[required]');
        
        for (const input of requiredInputs) {
            if (input.type === 'select-one') {
                if (!input.value || input.value === '') return false;
            } else if (input.type === 'number') {
                const minValue = input.min ? parseFloat(input.min) : 0;
                if (!input.value || parseFloat(input.value) < minValue) return false;
            } else {
                if (!input.value || input.value.trim() === '') return false;
            }
        }
        
        return true;
    },

    updateConfirmButton: function() {
        if (!this.elements.confirmBookingBtn) return;
        
        const isValid = this.validateForm();
        this.elements.confirmBookingBtn.disabled = !isValid;
    },

    // Collect all form data
    collectFormData: function() {
        const bookingData = {
            bookingStyle: this.selectedStyle,
            bookingStyleLabel: this.styleLabels[this.selectedStyle] || this.selectedStyle,
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            contactNumber: document.getElementById('contactNumber')?.value || '',
            pickupAddress: document.getElementById('pickupAddress')?.value || '',
            deliveryAddress: document.getElementById('deliveryAddress')?.value || '',
            pickupDateTime: document.getElementById('pickupDateTime')?.value || '',
            items: []
        };

        if (this.elements.itemRows) {
            const itemRowElements = this.elements.itemRows.querySelectorAll('[data-item-row]');
            
            itemRowElements.forEach(row => {
                const itemName = row.querySelector('input[name*="[name]"]')?.value || '';
                const itemType = row.querySelector('select[name*="[type]"]')?.value || '';
                const itemQty = row.querySelector('input[name*="[quantity]"]')?.value || '';
                const itemWeight = row.querySelector('input[name*="[weight]"]')?.value || '';
                
                if (itemName && itemType && itemQty && itemWeight) {
                    bookingData.items.push({
                        name: itemName,
                        type: itemType,
                        quantity: itemQty,
                        weight: itemWeight
                    });
                }
            });
        }

        return bookingData;
    },

    // Save booking data to localStorage
    saveBookingData: function(bookingData) {
        try {
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            return true;
        } catch (error) {
            console.error('Error saving booking data:', error);
            return false;
        }
    },

    // Handle confirm booking button click
    handleConfirmBooking: function() {
        if (!this.elements.bookingForm) return;

        if (this.elements.bookingForm.checkValidity() && this.validateForm()) {
            const bookingData = this.collectFormData();
            
            if (this.saveBookingData(bookingData)) {
                window.location.href = 'checkout.html';
            } else {
                alert('Error saving booking data. Please try again.');
            }
        } else {
            this.elements.bookingForm.reportValidity();
        }
    },

    // Initialize booking style modal
    initializeBookingStyleModal: function() {
        if (this.elements.bookingStyleModalEl && window.bootstrap) {
            this.elements.bookingStyleModalEl.addEventListener('show.bs.modal', () => this.setBodyOpen(true));
            this.elements.bookingStyleModalEl.addEventListener('hidden.bs.modal', () => this.setBodyOpen(false));
        }
    },

    // Initialize item management
    initializeItemManagement: function() {
        if (this.elements.itemRows) {
            this.elements.itemRows.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('[data-remove-item]');
                if (removeBtn) {
                    this.removeItemRow(removeBtn);
                }
            });
        }
    },

    // Initialize form validation
    initializeFormValidation: function() {
        if (this.elements.bookingForm) {
            this.elements.bookingForm.addEventListener('input', () => this.updateConfirmButton());
            this.elements.bookingForm.addEventListener('change', () => this.updateConfirmButton());
            
            this.elements.bookingForm.addEventListener('submit', (event) => {
                event.preventDefault();
                if (!this.elements.bookingForm.checkValidity()) {
                    this.elements.bookingForm.reportValidity();
                }
            });
        }
    },

    // Attach all event listeners
    attachEventListeners: function() {
        // Booking style selection
        this.elements.options.forEach(option => {
            option.addEventListener('click', () => {
                this.setSelectedStyle(option.dataset.bookingStyle);
            });
        });

        // Confirm booking style button
        if (this.elements.confirmBtn) {
            this.elements.confirmBtn.addEventListener('click', () => {
                this.confirmBookingStyle();
            });
        }

        // Change booking style button
        if (this.elements.changeStyleBtn) {
            this.elements.changeStyleBtn.addEventListener('click', () => {
                if (this.elements.bookingStyleModal) {
                    this.elements.bookingStyleModal.show();
                } else if (this.elements.bookingStyleModalEl) {
                    this.elements.bookingStyleModalEl.classList.add('show');
                    this.elements.bookingStyleModalEl.style.display = 'block';
                    this.elements.bookingStyleModalEl.removeAttribute('aria-hidden');
                    this.ensureFallbackBackdrop();
                    this.setBodyOpen(true);
                }
            });
        }

        // Add item button
        if (this.elements.addItemBtn) {
            this.elements.addItemBtn.addEventListener('click', () => {
                this.createItemRow();
                setTimeout(() => this.updateConfirmButton(), 0);
            });
        }

        // Confirm booking button
        if (this.elements.confirmBookingBtn) {
            this.elements.confirmBookingBtn.addEventListener('click', () => {
                this.handleConfirmBooking();
            });
        }
    }
};

// Initialize booking system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BookingSystem.init());
} else {
    BookingSystem.init();
}
