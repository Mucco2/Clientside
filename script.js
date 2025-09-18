// Kør koden, når HTML-dokumentet er fuldt indlæst, for at undgå fejl.
document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBALE VARIABLER ---
    let orderNumber = 1;         // Holder styr på det aktuelle ordrenummer.
    let dailyRevenue = 0.00;     // Dagens samlede omsætning.
    let currentOrder = [];       // Liste (array) over varer i den nuværende bestilling.
    let currentStep = 1;         // Tracker det aktive trin i bestillingsprocessen.
    const totalSteps = 4;        // Konstant for det totale antal trin i bestillingen.

    // --- HTML-ELEMENTER ---
    // Hent referencer til nødvendige HTML-elementer.
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

    // Viser et specifikt trin i processen og skjuler de andre.
    function showStep(stepNumber) {
        // Skjul først alle trin.
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active-step');
        });

        // Find og vis det ønskede trin.
        const newActiveStep = document.getElementById(`step-${stepNumber}`);
        if (newActiveStep) {
            newActiveStep.classList.add('active-step');
            currentStep = stepNumber; // Opdater det aktive trin.
        }
    }

    // Går til næste trin i bestillingen, hvis muligt.
    function goToNextStep() {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }

    // Går til forrige trin i bestillingen, hvis muligt.
    function goToPrevStep() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    }

    // Nulstiller kurv og visning til en ny bestilling.
    function resetForNewCustomer() {
        currentOrder = [];
        updateCartDisplay();
        showStep(1);
    }

    // Opdaterer indkøbskurvens visning i HTML.
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Tøm den nuværende liste.
        let totalPrice = 0;

        // Gennemløb hver vare i 'currentOrder' og genopbyg listen.
        currentOrder.forEach((item, index) => {
            totalPrice += item.price;
            // Opret et listeelement (<li>) for varen.
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} - ${item.price.toFixed(2)} kr.</span>
                <button class="remove-item" data-index="${index}">Fjern</button>
            `;
            // Tilføj varen til listen i HTML.
            cartItemsList.appendChild(listItem);
        });

        // Opdater den samlede pris i HTML.
        totalPriceDisplay.textContent = totalPrice.toFixed(2);
    }

    // Tilføjer en vare til kurven baseret på den klikkede knap.
    function addItemToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        currentOrder.push({
            name: menuItem.dataset.name,
            price: parseFloat(menuItem.dataset.price)
        });
        updateCartDisplay();
    }

    // Fjerner en vare fra kurven, hvis der klikkes på en 'Fjern'-knap. 
    function removeItemFromCart(event) {
        if (event.target.classList.contains('remove-item')) {
            const itemIndex = parseInt(event.target.dataset.index, 10);
            currentOrder.splice(itemIndex, 1); // Fjerner 1 element ved 'itemIndex'.
            updateCartDisplay();
        }
    }

    // Gennemfører den nuværende bestilling.
    function completeOrder() {
        if (currentOrder.length === 0) {
            alert("Kurven er tom.");
            return; // Stop funktionen hvis ingen varer er valgt.
        }

        // Beregn ordretotal og opdater dagens omsætning.
        const orderTotal = currentOrder.reduce((sum, item) => sum + item.price, 0);
        dailyRevenue += orderTotal;
        dailyRevenueDisplay.textContent = dailyRevenue.toFixed(2);

        // Generer HTML til kvitteringen.
        let receiptHTML = '<ul>';
        currentOrder.forEach(item => {
            receiptHTML += `<li>${item.name}: ${item.price.toFixed(2)} kr.</li>`;
        });
        receiptHTML += `</ul><p><strong>Total: ${orderTotal.toFixed(2)} kr.</strong></p>`;
        
        // Vis kvitteringen i en modal.
        receiptDetails.innerHTML = receiptHTML;
        receiptModal.style.display = 'flex';

        // Gør klar til næste kunde.
        orderNumber++;
        orderNumberDisplay.textContent = orderNumber;
        resetForNewCustomer();
    }
    
    // Annullerer den nuværende bestilling.
    function cancelOrder() {
        resetForNewCustomer();
    }

    // --- EVENT LISTENERS ---
    // Forbinder funktioner til brugerhandlinger (klik).

    // Tilføj 'addItemToCart' til alle 'Tilføj'-knapper.
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addItemToCart);
    });

    // Lytter på hele kurven for klik på 'Fjern'-knapper (Event Delegation).
    cartItemsList.addEventListener('click', removeItemFromCart);

    // Tilføj 'goToNextStep' til alle 'Næste'-knapper.
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', goToNextStep);
    });
    
    // Tilføj 'goToPrevStep' til alle 'Forrige'-knapper.
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', goToPrevStep);
    });

    // Kør funktioner ved klik på 'Gennemfør' og 'Annuller'.
    completeOrderBtn.addEventListener('click', completeOrder);
    cancelOrderBtn.addEventListener('click', cancelOrder);
    
    // Luk kvitterings-modalen ved klik på lukkeknappen.
    closeModalBtn.addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });
});