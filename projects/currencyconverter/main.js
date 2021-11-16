var newNamespace = {};
// Create an array to hold all the elments in the button group
newNamespace.ArrayOfFromCurrency = [];
newNamespace.ArrayOfToCurrency = [];
// Initialize time
newNamespace.time = null;

// Function to create currency object
const createCurrency = (id, symbol, selected) => {
	return {
		id,
		symbol,
		selected
	}
}

// Find the selected element in the button group
function findSelected(list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].selected) {
			return list[i];
		}
	}
}

// Validate element id and add it to array
function addToCurrencyList(id, symbol, selected, list) {
	let element = document.getElementById(id);
	if (element && element.innerHTML != undefined) {
		list.push(createCurrency(id, symbol, selected));
	} else {
		console.log("Did not find element " + element);
	}
}

//Find all the icons of possible conversion and add them to an array
function populateCurrencyList() {
	addToCurrencyList("eurfigf", "EUR", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("usafigf", "USD", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("canfigf", "CAD", true, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("btcfigf", "BTC", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("ethfigf", "ETH", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("eurfigt", "EUR", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("usafigt", "USD", true, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("canfigt", "CAD", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("btcfigt", "BTC", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("ethfigt", "ETH", false, newNamespace.ArrayOfToCurrency);
}

// Once a button is selected change its appearance, reset the other buttons to be unselected
function changeToSelected(currency, list, displayId) {
	if (!currency.selected) {
		currency.selected = true;
		document.getElementById(currency.id).style.background = "rgb(10, 20, 110)";
		document.getElementById(displayId).innerHTML = `<h2>${currency.symbol}</h2>`;
		for (let i = 0; i < list.length; i++) {
			if (list[i].id != currency.id) {
				list[i].selected = false;
				document.getElementById(list[i].id).style.background = "#0071eb";
			}
		}
	}
}

// Bind elements that belong to the same group
function addListenerToArray(list, displayId, id1, id2, msgText) {
	for (let i = 0; i < list.length; i++) {
		document.getElementById(list[i].id).addEventListener("click", event => {
			changeToSelected(list[i], list, displayId);
			let element1 = document.getElementById(id1);
			let element2 = document.getElementById(id2);
			let rate = findRate();
			if (element1 && element2 && element1.value != 0) {
				let symbol = findSelected(newNamespace.ArrayOfToCurrency).symbol;
				element2.innerHTML = `<span>${OutputAsCurrency((element1.value * rate).toFixed(2), symbol)}</span>`;
			}
			var time = new Date(newNamespace.time * 1000);
			UpdateElement("updatetime", `The rate was updated at <em>${time}</em>`);
			UpdateElement("updaterate", `The rate is <em>${rate}</em>`);
			UpdateElement("otherinfo", `The rate is updated every hour.`);
		})
		document.getElementById(list[i].id).onmouseover = () => {
			HasFocus(list[i].id, "help-message", msgText);
		}
		document.getElementById(list[i].id).onmouseleave = () => {
			LostFocus(list[i].id, "help-message", msgText);
		}
	}
}

function addFocusEventToInput(id) {
	let element = document.getElementById(id);
	if (element) {
		element.onfocus = () => {
			HasFocus("from", "help-message", "Please Enter the amount of currency you have");
		}
		element.onblur = () => {
			LostFocus("from", "help-message");
		}
	}
}

// Function to add an event listener to specific elements
function addListenerToInput(id1, id2) {
	let element1 = document.getElementById(id1);
	let element2 = document.getElementById(id2);
	if (element1 && element2 && element1.value != undefined) {
		// Binds update information to the element "onchange" event
		element1.addEventListener("change", event => {
			let rate = findRate();
			let symbol = findSelected(newNamespace.ArrayOfToCurrency).symbol;
			element2.innerHTML = `<span>${OutputAsCurrency((element1.value * rate).toFixed(2), symbol)}</span>`;
			// Get the time when the conversion rate is updated
			var time = new Date(newNamespace.time * 1000);
			// Update time, rate and other information
			UpdateElement("updatetime", `The rate was updated at <em>${time}</em>`);
			UpdateElement("updaterate", `The rate is <em>${rate}</em>`);
			UpdateElement("otherinfo", `The rate is updated every hour.`);
		})
	}
}

// Function to update the "id", with a new value
function UpdateElement(id, newValue) {
	var elementOnForm = document.getElementById(id);
	if (elementOnForm && elementOnForm.innerHTML !== undefined) {
		elementOnForm.innerHTML = newValue;
	}
	else {
		console.log(`Could not field id '${id}' to update innerHTML\n${newValue}`);
	}
}

// Function that returns the conversion rate 
function findRate() {
	var rate = 1.0;
	var currencyFrom = findSelected(newNamespace.ArrayOfFromCurrency);
	var currencyTo = findSelected(newNamespace.ArrayOfToCurrency);

	if (currencyFrom.symbol && currencyTo.symbol) {
		fetchData();
	}

	// if 
	try {
		return fx(1).from(currencyFrom.symbol).to(currencyTo.symbol);
	} catch {
		setUpDefaultRate();
		return fx(1).from(currencyFrom.symbol).to(currencyTo.symbol);
	}
}

function fetchData() {
	// Fetch data through Open Exchange Rates API
	fetch('https://openexchangerates.org/api/latest.json?app_id=74c88ee76ec040979bc2b7841b5b5813')
		//Convert data to JSON format
		.then((resp) => resp.json())
		//Update rates in money.js to current rates
		.then((data) => {
			fx.rates = data.rates;
			fx.base = data.base;
			//Grap timestamp
			newNamespace.time = data.timestamp;
		})
		.catch((reason) => {
			console.log("Handle rejected promise (${reason}) here.");
		})
}

// Function to set up default rate for the library
function setUpDefaultRate() {
	fx.rates = {
		CAD: 1.26541,
		ETH: 0.00061,
		BTC: 0.000020207795,
		USD: 1,
		EUR: 0.839201
	};
	fx.base = 'USD';
}

function OutputAsCurrency(value, currency, locale) {
	// debugger;
	// If the caller didn't specify the currency, use a default of Canadian dollars
	if (!currency) {
		currency = "CAD";
	}
	// If the caller didn't specify the regional locale, use the web browser default locale
	if (!locale) {
		locale = GetPreferredRegion();
	}
	// Bug fix -- if they pass a string value, convert it to a number first
	if (typeof value == "string") {
		value = parseFloat(value);
	}

	var valueAsCurrency = "";
	var conversionRules = {
		style: "currency",
		currency: currency
	}

	if (value && value.toLocaleString() !== undefined) {
		valueAsCurrency = value.toLocaleString(locale, conversionRules);
	}
	return valueAsCurrency;
}

function GetPreferredRegion() {
	var regionalLanguage = "en-US";
	if (navigator.languages && navigator.languages.length) {
		regionalLanguage = navigator.languages[0];
	} else {
		regionalLanguage = navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
	}
	return regionalLanguage;
}
// Change the background and border of the selected element
window.onload = () => {
	populateCurrencyList();

	addListenerToArray(
		newNamespace.ArrayOfFromCurrency,
		"FromHidden", "from", "to",
		"Please choose the currency you HAVE");
	addListenerToArray(newNamespace.ArrayOfToCurrency,
		"ToHidden", "from", "to",
		"Please choose the currency you WANT");

	fetchData();
	setUpDefaultRate();

	addListenerToInput("from", "to");

	addFocusEventToInput("from");
}
