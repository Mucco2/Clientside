document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBALE VARIABLER ---
    let orderNumber = 1;
    let dailyRevenue = 0.00;
    let currentOrder = [];
    let currentStep = 1; // Ny variabel til at spore det aktive trin
    const totalSteps = 4; // Det totale antal trin

    // --- HTML-ELEMENTER ---
    // Samme som før, men vi fjerner event listeners herfra til sidst
    const orderNumberDisplay = document.getElementById('order-number');
    const dailyRevenueDisplay = document.getElementById('daily-revenue');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const completeOrderBtn = document.getElementById('complete-order');
    const cancelOrderBtn = document.getElementById('cancel-order');
    const receiptModal = document.getElementById('receipt-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const receiptDetails = document.getElementById('receipt-details');
    
    // --- FUNKTIONER ---

    // Funktion til at skifte hvilket trin, der vises
    function showStep(stepNumber) {
        // 1. Find alle trin og fjern 'active-step' klassen
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active-step');
        });

        // 2. Find det korrekte nye trin og tilføj 'active-step' klassen
        const newActiveStep = document.getElementById(`step-${stepNumber}`);
        if (newActiveStep) {
            newActiveStep.classList.add('active-step');
            currentStep = stepNumber; // Opdater vores globale step-variabel
        }
    }

    // Funktion til at gå til næste trin
    function goToNextStep() {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
    
    // Funktion til at gå til forrige trin
    function goToPrevStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    // Funktion til at nulstille alt til en ny bestilling, inklusiv trin
    function resetForNewCustomer() {
        currentOrder = [];
        updateCartDisplay();
        showStep(1); // Gå altid tilbage til første trin
    }

    // Funktioner til at håndtere kurv, køb og annullering (de er næsten de samme som før)
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let totalPrice = 0;
        currentOrder.forEach((item, index) => {
            totalPrice += item.price;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} - ${item.price.toFixed(2)} kr.</span>
                <button class="remove-item" data-index="${index}">Fjern</button>
            `;
            cartItemsList.appendChild(listItem);
        });
        totalPriceDisplay.textContent = totalPrice.toFixed(2);
    }

    function addItemToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        currentOrder.push({
            name: menuItem.dataset.name,
            price: parseFloat(menuItem.dataset.price)
        });
        updateCartDisplay();
    }
    
    function removeItemFromCart(event) {
        if (event.target.classList.contains('remove-item')) {
            const itemIndex = parseInt(event.target.dataset.index, 10);
            currentOrder.splice(itemIndex, 1);
            updateCartDisplay();
        }
    }

    function completeOrder() {
        if (currentOrder.length === 0) {
            alert("Du kan ikke gennemføre en tom bestilling.");
            return;
        }
        const orderTotal = currentOrder.reduce((sum, item) => sum + item.price, 0);
        dailyRevenue += orderTotal;
        dailyRevenueDisplay.textContent = dailyRevenue.toFixed(2);

        let receiptHTML = '<ul>';
        currentOrder.forEach(item => {
            receiptHTML += `<li>${item.name}: ${item.price.toFixed(2)} kr.</li>`;
        });
        receiptHTML += `</ul><p><strong>Total Beløb: ${orderTotal.toFixed(2)} kr.</strong></p>`;
        receiptDetails.innerHTML = receiptHTML;
        
        receiptModal.style.display = 'flex';
        orderNumber++;
        orderNumberDisplay.textContent = orderNumber;
        resetForNewCustomer();
    }
    
    function cancelOrder() {
        resetForNewCustomer();
    }

    // --- EVENT LISTENERS (HÅNDTERING AF KLIK) ---

    // Lyt efter klik på alle "Tilføj" knapper
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addItemToCart);
    });

    // Lyt efter klik inde i kurven for "Fjern" knapper
    cartItemsList.addEventListener('click', removeItemFromCart);

    // Lyt efter klik på navigationsknapperne i trin-guiden
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', goToNextStep);
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', goToPrevStep);
    });

    // Lyt efter klik på de overordnede knapper
    completeOrderBtn.addEventListener('click', completeOrder);
    cancelOrderBtn.addEventListener('click', cancelOrder);
    closeModalBtn.addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });
});