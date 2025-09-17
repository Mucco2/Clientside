// Denne linje sikrer, at alt vores JavaScript-kode først kører,
// når hele HTML-dokumentet er blevet indlæst færdigt af browseren.
// 'DOMContentLoaded' er en "event" (begivenhed), som browseren sender, når HTML er klar.
// Hvorfor? Fordi hvis koden kører, før HTML-elementerne (som knapper og tekstfelter)
// eksisterer, vil JavaScript give en fejl, fordi den ikke kan finde dem.
document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBALE VARIABLER ---
    // Holder styr på, hvilket ordrenummer vi er nået til. Starter på 1.
    // 'let' bruges, fordi værdien af disse variable vil ændre s
    let orderNumber = 1;
    
    // Holder styr på den samlede omsætning for hele dagen. Starter på 0.00.
    // 'let' bruges, fordi værdien af disse variable vil ændre sig.
    let dailyRevenue = 0.00;
    
    // Et tomt "array" (en liste), som skal indeholde alle varerne i den nuværende bestilling.
    // Hver vare vil blive tilføjet som et objekt, f.eks. { name: 'Kaffe', price: 25 }.
    let currentOrder = [];
    
    // Denne variabel sporer, hvilket "trin" i bestillingsprocessen brugeren er på (f.eks. trin 1: drikkevarer, trin 2: mad).
    let currentStep = 1; 
    
    // En konstant variabel, der definerer det totale antal trin i processen.
    // 'const' bruges, fordi denne værdi aldrig ændrer sig. Det gør koden nemmere at vedligeholde.
    const totalSteps = 4;

    // --- HTML-ELEMENTER ---
    // Her henter vi fat i de HTML-elementer fra vores webside, som vi skal bruge i vores JavaScript.
    // Vi gemmer dem i konstanter, så vi har nem og hurtig adgang til dem senere.

    // Finder det HTML-element, hvor ordrenummeret skal vises.
    const orderNumberDisplay = document.getElementById('order-number');
    
    // Finder det element, hvor dagens samlede omsætning skal vises.
    const dailyRevenueDisplay = document.getElementById('daily-revenue');
    
    // Finder listen (<ul>), hvor varerne i kurven skal indsættes.
    const cartItemsList = document.getElementById('cart-items');
    
    // Finder det element, hvor den samlede pris for den nuværende ordre skal stå.
    const totalPriceDisplay = document.getElementById('total-price');
    
    // Finder knappen til at gennemføre bestillingen.
    const completeOrderBtn = document.getElementById('complete-order');
    
    // Finder knappen til at annullere bestillingen.
    const cancelOrderBtn = document.getElementById('cancel-order');
    
    // Finder "modalen" (pop-up vinduet) til kvitteringen, som er skjult fra start.
    const receiptModal = document.getElementById('receipt-modal');
    
    // Finder lukkeknappen (krydset) inde i kvitterings-modalen.
    // 'querySelector' er mere fleksibel og kan finde elementer baseret på klasser, id'er, tags osv.
    const closeModalBtn = document.querySelector('.close-button');
    
    // Finder det element inde i modalen, hvor selve kvitteringsdetaljerne skal skrives.
    const receiptDetails = document.getElementById('receipt-details');
    
    // --- FUNKTIONER ---
    // Funktioner er genanvendelige blokke af kode, der udfører en bestemt opgave.

    // Funktion til at skifte, hvilket trin i bestillingen der er synligt.
    // 'stepNumber' er det trin-nummer, vi ønsker at vise (f.eks. 1, 2, 3 og 4).
    function showStep(stepNumber) {
        // 1. Først finder vi ALLE elementer med klassen 'step' og skjuler dem.
        // 'querySelectorAll' returnerer en liste over alle matchende elementer.
        // '.forEach' løber igennem hvert element i listen.
        document.querySelectorAll('.step').forEach(step => {
            // For hvert trin-element fjerner vi CSS-klassen 'active-step'.
            // Denne klasse er det, der gør trinnet synligt i vores CSS.
            step.classList.remove('active-step');
        });

        // 2. Dernæst finder vi det specifikke trin, vi VIL vise.
        // Vi bygger id'et dynamisk, 'step-1', 'step-2', 'step-3' og 'step-4'.
        const newActiveStep = document.getElementById(`step-${stepNumber}`);
        
        // Vi tjekker, om elementet rent faktisk blev fundet, for at undgå fejl.
        if (newActiveStep) {
            // Hvis det findes, tilføjer vi 'active-step' klassen for at gøre det synligt.
            newActiveStep.classList.add('active-step');
            
            // Vi opdaterer vores globale 'currentStep' variabel, så programmet altid ved,
            // hvilket trin der er aktivt.
            currentStep = stepNumber;
        }
    }

    // Funktion til at gå til NÆSTE trin.
    function goToNextStep() {
        // Vi tjekker, om det nuværende trin er mindre end det totale antal trin.
        // Hvorfor? For at sikre, at vi ikke prøver at gå til et trin, der ikke eksisterer (f.eks. trin 5 ud af 4).
        if (currentStep < totalSteps) {
            // Vi kalder 'showStep' funktionen med det nuværende trinnummer plus én.
            showStep(currentStep + 1);
        }
    }
    
    // Funktion til at gå til FORRIGE trin.
    function goToPrevStep() {
        // Vi tjekker, om det nuværende trin er større end 1.
        // Hvorfor? For at forhindre at gå til trin 0 eller et negativt trin.
        if (currentStep > 1) {
            // Vi kalder 'showStep' funktionen med det nuværende trinnummer minus én.
            showStep(currentStep - 1);
        }
    }

    // Funktion til at nulstille systemet til en ny kunde.
    function resetForNewCustomer() {
        // Tømmer kurven ved at sætte 'currentOrder' arrayet tilbage til at være tomt.
        currentOrder = [];
        
        // Kalder funktionen, der opdaterer visningen af kurven, så den nu vises som tom.
        updateCartDisplay();
        
        // Sørger for, at bestillingsprocessen altid starter forfra ved trin 1 for den nye kunde.
        showStep(1);
    }

    // Funktion til at opdatere, hvad der vises i indkøbskurven på skærmen.
    function updateCartDisplay() {
        // Tømmer først hele den nuværende liste i HTML'en, så vi ikke tilføjer de samme varer igen og igen.
        cartItemsList.innerHTML = '';
        
        // Nulstiller den samlede pris til 0, før vi genberegner den.
        let totalPrice = 0;
        
        // Vi bruger '.forEach' til at løbe igennem hver 'item' i vores 'currentOrder' array.
        // 'index' er varens position i arrayet (0, 1, 2, 3, og 4).
        currentOrder.forEach((item, index) => {
            // Lægger prisen for den aktuelle vare til den samlede pris.
            totalPrice += item.price;
            
            // Opretter et nyt '<li>' (list item) HTML-element i hukommelsen.
            const listItem = document.createElement('li');
            
            // Definerer HTML-indholdet for vores nye listeelement.
            // Vi indsætter varens navn og pris. '.toFixed(2)' sikrer, at prisen altid har to decimaler (f.eks. 25.00).
            // Vi laver også en "Fjern"-knap med et 'data-index' attribut, som holder styr på varens position i arrayet.
            listItem.innerHTML = `
                <span>${item.name} - ${item.price.toFixed(2)} kr.</span>
                <button class="remove-item" data-index="${index}">Fjern</button>
            `;
            
            // Tilføjer det nyoprettede listeelement til kurv-listen (<ul>) på hjemmesiden.
            cartItemsList.appendChild(listItem);
        });
        
        // Opdaterer det HTML-element, der viser den samlede pris, med den beregnede total.
        totalPriceDisplay.textContent = totalPrice.toFixed(2);
    }

    // Funktion, der kører, når man klikker på en "Tilføj"-knap ved en vare.
    // 'event' objektet indeholder information om klikket, f.eks. hvilket element der blev klikket på.
    function addItemToCart(event) {
        // 'event.target' er det præcise element, der blev klikket på (i dette tilfælde 'add-to-cart' knappen).
        // '.closest('.menu-item')' finder det nærmeste overordnede element, der har klassen 'menu-item'.
        // Dette er smart, fordi varens data (navn og pris) er gemt på dette overordnede element.
        const menuItem = event.target.closest('.menu-item');
        
        // Vi tilføjer en ny vare (et objekt) til vores 'currentOrder' array.
        // Dataen hentes fra 'data-name' og 'data-price' attributterne på 'menu-item' elementet.
        // 'parseFloat' omdanner pris-teksten (som er en "string") til et tal, så vi kan regne med den.
        currentOrder.push({
            name: menuItem.dataset.name,
            price: parseFloat(menuItem.dataset.price)
        });
        
        // Kalder 'updateCartDisplay' for at opdatere kurven på skærmen med den nye vare.
        updateCartDisplay();
    }
    
    // Funktion der kører, når man klikker et sted inde i kurv-listen (til at fjerne varer).
    function removeItemFromCart(event) {
        // Vi tjekker, om det element, der blev klikket på, rent faktisk har klassen 'remove-item'.
        // Hvorfor? Fordi vi kun vil gøre noget, hvis der blev klikket på en "Fjern"-knap,
        // og ikke bare et tilfældigt sted i kurven.
        if (event.target.classList.contains('remove-item')) {
            // Vi henter index-værdien fra knappens 'data-index' attribut.
            // 'parseInt' omdanner teksten til et heltal. '10' betyder, at det er i titalssystemet.
            const itemIndex = parseInt(event.target.dataset.index, 10);
            
            // '.splice(itemIndex, 1)' er en array-metode, der fjerner elementer.
            // Den starter ved 'itemIndex' og fjerner '1' element.
            currentOrder.splice(itemIndex, 1);
            
            // Opdaterer kurven på skærmen for at vise, at varen er blevet fjernet.
            updateCartDisplay();
        }
    }

    // Funktion til at afslutte og gennemføre bestillingen.
    function completeOrder() {
        // Tjekker først, om kurven er tom.
        if (currentOrder.length === 0) {
            // Hvis den er tom, vises en advarsel, og funktionen stopper.
            alert("Du kan ikke gennemføre en tom bestilling.");
            return; // 'return' stopper eksekveringen af resten af funktionen.
        }
        
        // Beregner den samlede pris for ordren.
        // '.reduce' er en smart array-metode, der "reducerer" et array til en enkelt værdi.
        // Her lægger den prisen på hver 'item' sammen og returnerer en samlet sum.
        const orderTotal = currentOrder.reduce((sum, item) => sum + item.price, 0);
        
        // Lægger den netop gennemførte ordres total til dagens samlede omsætning.
        dailyRevenue += orderTotal;
        
        // Opdaterer visningen af dagens omsætning på skærmen.
        dailyRevenueDisplay.textContent = dailyRevenue.toFixed(2);

        // Bygger HTML-strengen til kvitteringen.
        let receiptHTML = '<ul>'; // Starter med en liste.
        currentOrder.forEach(item => {
            // Tilføjer hver vare som et listeelement.
            receiptHTML += `<li>${item.name}: ${item.price.toFixed(2)} kr.</li>`;
        });
        // Afslutter listen og tilføjer et afsnit med det samlede beløb.
        receiptHTML += `</ul><p><strong>Total Beløb: ${orderTotal.toFixed(2)} kr.</strong></p>`;
        
        // Indsætter den færdigbyggede HTML ind i kvitterings-elementet i modalen.
        receiptDetails.innerHTML = receiptHTML;
        
        // Dette viser pop-up vinduet med kvitteringen.
        receiptModal.style.display = 'flex';
        
        // Tæller ordrenummeret én op, så den næste kunde får det næste nummer i rækken.
        orderNumber++;
        
        // Opdaterer visningen af ordrenummeret på skærmen.
        orderNumberDisplay.textContent = orderNumber;
        
        // Nulstiller systemet, så det er klar til en ny kunde.
        resetForNewCustomer();
    }
    
    // Funktion til at annullere en bestilling.
    function cancelOrder() {
        // Denne funktion kalder simpelthen bare 'resetForNewCustomer' for at rydde alt
        // og starte forfra, uden at gennemføre købet.
        resetForNewCustomer();
    }

    // --- EVENT LISTENERS (HÅNDTERING AF KLIK) ---
    // Her forbinder vi vores funktioner til brugerens handlinger (f.eks. klik).
    // 'addEventListener' lytter efter en bestemt begivenhed på et element og kører en funktion, når den sker.

    // Finder ALLE knapper med klassen 'add-to-cart'.
    document.querySelectorAll('.add-to-cart').forEach(button => {
        // Tilføjer en 'click' event listener til HVER af disse knapper.
        // Når en knap klikkes, kaldes 'addItemToCart' funktionen.
        button.addEventListener('click', addItemToCart);
    });

    // Tilføjer en enkelt 'click' listener til HELE kurv-listen.
    // Dette kaldes "Event Delegation". I stedet for at sætte en listener på hver "Fjern"-knap,
    // lytter vi på forældreelementet. Det er mere effektivt, især for knapper, der tilføjes og fjernes dynamisk.
    // 'removeItemFromCart' funktionen tjekker så selv, om det var en "Fjern"-knap, der blev klikket på.
    cartItemsList.addEventListener('click', removeItemFromCart);

    // Finder alle 'Næste'-knapper og forbinder dem til 'goToNextStep' funktionen.
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', goToNextStep);
    });
    
    // Finder alle 'Forrige'-knapper og forbinder dem til 'goToPrevStep' funktionen.
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', goToPrevStep);
    });

    // Lytter efter klik på den store "Gennemfør bestilling"-knap.
    completeOrderBtn.addEventListener('click', completeOrder);
    
    // Lytter efter klik på "Annuller bestilling"-knappen.
    cancelOrderBtn.addEventListener('click', cancelOrder);
    
    // Lytter efter klik på lukkeknappen i kvitterings-modalen.
    closeModalBtn.addEventListener('click', () => {
        // Når der klikkes, køres denne simple "arrow function", som sætter
        // modalens display tilbage til 'none' og dermed skjuler den.
        receiptModal.style.display = 'none';
    });
});