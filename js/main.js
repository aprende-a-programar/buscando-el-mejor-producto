// --- COSAS QUE ME GUSTARIA MEJORAR --- //

/* - NO ENTRA A LOS CATCHS NO SÉ PQ */
/* - CAPAZ QUE HAY ALGUNA MANERA DE JUNTAR LOS QUE TIENEN MAS VENTAS Y LOS DE MENOR PRECIO PERO NO SÉ */

// ------------------------------------- //

// --- A way to simplify the selectors to avoid writing them every time i need it --- //
function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
// ------------------------------------- //

const browserForm = $('.search-form'); /* Form selector */
const buttonForm = $('.find-product');
const inputBrowser = $('.browser-input');
const productInformation = $('.product__information');
const productImageLink = $('.product__image');
const productImage = $('.product__image img');
const productTitle = $('.product__title');
const productPrice = $('.product__price');
const productInstallments = $('.product__installments');
const productDescriptionParagraph = $('.product__description-paragraph');
const loader = $('.bx-spin');

let userQuery; /* What the user types in the input */

inputBrowser.addEventListener('input', (e) => {
	userQuery = e.target.value.toLowerCase().trim();
	console.log(userQuery);
});

buttonForm.addEventListener('click', (e) => {
	e.preventDefault();
	if (userQuery !== undefined && userQuery !== '') {
		showResults();
	}
	inputBrowser.value = '';
});

let description; /* Description of the product */
let title; /* Title of the product */
let link; /* Link of the product */
let image; /* Image of the product */
let price; /* Price of the product */
let installmentsAmount; /* Installments of the product  */
let prices = []; /* All the product's prices founded */
let bestPrice; /* The best price of the product's prices founded */
let results; /* Products results with the user query */
let resultsTitle = []; /* Array with the result's titles */
let coincidences = []; /* Product's title coincidences with the user query */
let bestProductByPrice; /* The cheapest product */

// Function that interacts with the API
async function showResults() {
	await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${userQuery}`)
		.then((response) => response.json())
		.then((json) => {
			loader.style.display = 'block';
			productInformation.style.display = 'none';
			// bestSelledProducts = [];
			// sellsQuantity = [];
			prices = [];
			resultsTitle = [];
			coincidences = [];
			results = json.results;
			for (let r = 0; r < results.length; r++) {
				resultsTitle.push(results[r].title.toLowerCase());
				if (resultsTitle[r].includes(userQuery)) {
					coincidences.push(results[r]);
					prices.push(results[r].price);
				}
			}
		})
		.catch((error) => console.error(error));

	if (coincidences.length === 0) {
		alert('No se han encontrado resultados');
		loader.style.display = 'none';
		productInformation.style.display = 'none';
		return false;
	} else {
		// getTheMostSelledProduct();
		getTheCheapestProduct();
		await fetch(`https://api.mercadolibre.com/items/${bestProductByPrice.id}/description`)
			.then((response) => response.json())
			.then((json) => {
				description = json.plain_text;
				description !== '' ? (description = json.plain_text) : (description = 'El vendedor no colocó ninguna descripción');
				drawTheBestProduct();
			})
			.catch((error) => console.error(error));
	}
}

function getTheCheapestProduct() {
	prices.sort((a, b) => {
		return a - b;
	});
	for (let i = 0; i < coincidences.length; i++) {
		bestPrice = coincidences[i].price;
		if (bestPrice === prices[0]) {
			bestProductByPrice = coincidences[i];
			title = bestProductByPrice.title;
			link = bestProductByPrice.permalink;
			image = bestProductByPrice.thumbnail;
			price = bestProductByPrice.price;
		}
	}
}

function drawTheBestProduct() {
	loader.style.display = 'none';
	productInformation.style.display = 'block';
	productImageLink.href = `${link}`;
	productImage.src = `${image}`;
	productTitle.innerText = `${title}`;
	if (price) productPrice.innerText = `$${price}`; /* Puse la condición porque busque un articulo que no tenia precio y tiraba precio $null */
	if (bestProductByPrice.installments) {
		installmentsAmount = `En ${bestProductByPrice.installments.quantity} cuotas de $${bestProductByPrice.installments.amount}`;
		productInstallments.innerText = `${installmentsAmount}`;
	}
	productDescriptionParagraph.innerText = `${description}`;
	userQuery = '';
}

// Se eligió el mejor producto dependiendo si era el más barato

/* Dark Mode */
const buttonSwitch = $('.dark-mode__switch-button');

buttonSwitch.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	buttonSwitch.classList.toggle('active');

	// Save the mode in the localStorage
	if(document.body.classList.contains('dark')){
		localStorage.setItem('dark-mode', 'true');
	} else {
		localStorage.setItem('dark-mode', 'false');
	}
});

// Get the actual mode in the localStorage
if(localStorage.getItem('dark-mode') === 'true'){
	document.body.classList.add('dark');
	buttonSwitch.classList.add('active');
} else {
	document.body.classList.remove('dark');
	buttonSwitch.classList.remove('active');
}
/* --------- */
// let sellsQuantity = [];
// let bestSelledProducts = [];
// function getTheMostSelledProduct() {
// 	if (coincidences.length > 2) {
// 		for (let i = 0; i < coincidences.length; i++) {
// 			if (coincidences[i].sold_quantity > 100) sellsQuantity.push(coincidences[i].sold_quantity);
// 		}
// 		sellsQuantity.sort((a, b) => {
// 			return b - a;
// 		});
// 		console.log(sellsQuantity , 'sellsQuantity');
// 	}
// }