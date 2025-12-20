(function() {
    // retrieve booking data from localStorage
    const bookingDataString = localStorage.getItem('bookingData');
    
    if (!bookingDataString) {
        console.warn('No booking data found');
        return;
    }
    
    try {
        const bookingData = JSON.parse(bookingDataString);

        const bookingStyleElement = document.getElementById('checkout-booking-style');
        if (bookingStyleElement && bookingData.bookingStyleLabel) {
            bookingStyleElement.textContent = bookingData.bookingStyleLabel;
            
            if (bookingData.bookingStyle === 'full-day') {
                bookingStyleElement.className = 'text-primary';
            } else if (bookingData.bookingStyle === 'normal') {
                bookingStyleElement.className = 'text-danger';
            } else if (bookingData.bookingStyle === 'immediate') {
                bookingStyleElement.style.color = '#FEB21A';
            }
        }
        
        const fullNameElement = document.getElementById('checkout-fullname');
        if (fullNameElement && bookingData.firstName && bookingData.lastName) {
            fullNameElement.textContent = `${bookingData.firstName} ${bookingData.lastName}`;
        }
        
        const contactElement = document.getElementById('checkout-contact');
        if (contactElement && bookingData.contactNumber) {
            contactElement.textContent = `+63${bookingData.contactNumber}`;
        }
        
        const pickupElement = document.getElementById('checkout-pickup');
        if (pickupElement && bookingData.pickupAddress) {
            pickupElement.textContent = bookingData.pickupAddress;
        }
        
        const deliveryElement = document.getElementById('checkout-delivery');
        if (deliveryElement && bookingData.deliveryAddress) {
            deliveryElement.textContent = bookingData.deliveryAddress;
        }
        
        const timeElement = document.getElementById('checkout-time');
        if (timeElement && bookingData.pickupDateTime) {
            const dateTime = new Date(bookingData.pickupDateTime);
            const options = { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            };
            timeElement.textContent = dateTime.toLocaleString('en-US', options);
        }

        const itemsContainer = document.getElementById('checkout-items-container');
        if (itemsContainer && bookingData.items && bookingData.items.length > 0) {
            itemsContainer.innerHTML = '';
            
            bookingData.items.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'row border-bottom border-black';
                itemRow.innerHTML = `
                    <div class="col text-center p-2">
                        <span>${item.name}</span>
                    </div>
                    <div class="col text-center p-2">
                        <span>${item.type}</span>
                    </div>
                    <div class="col text-center p-2">
                        <span>${item.quantity}</span>
                    </div>
                    <div class="col text-center p-2">
                        <span>${item.weight}</span>
                    </div>
                `;
                itemsContainer.appendChild(itemRow);
            });
        }
        
    } catch (error) {
        console.error('Error parsing booking data:', error);
    }
})();