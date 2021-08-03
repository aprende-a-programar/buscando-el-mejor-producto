function dibujarElMejorProducto(product) {
  const PRODUCT_CONTAINER = ".product";
  const PRODUCT_TITLE = ".product__title";
  const PRODUCT_PRICE = ".product__price-amount";
  const PRODUCT_INSTALLMENTS = ".product_inst";
  const PRODUCT_DESCRIPTION = ".product__desc-text";
  const PRODUCT_IMG = ".product__img";

  const productEl = document.querySelector(PRODUCT_CONTAINER);
  const titleEl = document.querySelector(PRODUCT_TITLE);
  const priceEl = document.querySelector(PRODUCT_PRICE);
  const instEl = document.querySelector(PRODUCT_INSTALLMENTS);
  const descEl = document.querySelector(PRODUCT_DESCRIPTION);
  const imgEl = document.querySelector(PRODUCT_IMG);

  productEl.addEventListener("click", () => {
    window.open(product.permalink);
  });

  productEl.classList.add("show");
  titleEl.textContent = product.title;
  priceEl.textContent = product.price;
  if (product.installments) {
    instEl.textContent = `en ${product.installments.quantity} cuotas de ${product.installments.amount}`;
  }
  descEl.textContent = product._description;
  imgEl.src = product.thumbnail;
}

async function populateProductDesc(product) {
  const id = product.id;
  const desc = await fetch(
    `https://api.mercadolibre.com/items/${id}/description`
  ).then((res) => res.json());
  product._description = desc.plain_text;
  return product;
}

function elegirElMejorProducto(listaDeProductos) {
  const losNuevos = listaDeProductos.filter((p) => {
    const esNuevo = p.condition == "new";
    const aceptaMP = p.accepts_mercadopago;
    const envioGratis = p.shipping.free_shipping;
    const buenaReputacion =
      p.seller.seller_reputation.transactions.ratings.positive > 0.98;
    return esNuevo && aceptaMP && envioGratis && buenaReputacion;
  });

  const sorted = losNuevos.sort((a, b) => a.price - b.price);

  return sorted[0];
}

function buscarProductos(palabraABuscar) {
  const url =
    "https://api.mercadolibre.com/sites/MLA/search?q=" +
    palabraABuscar +
    "&sort=price_desc";
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.results);
}

function escucharForm() {
  const formEl = document.querySelector(".search-form");
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = e.target.query.value;
    const results = await buscarProductos(query);
    const bestProduct = elegirElMejorProducto(results);
    const bestProductPopulated = await populateProductDesc(bestProduct);
    dibujarElMejorProducto(bestProductPopulated);
  });
}

// inicia todo e invoca al resto de las funciones
async function main() {
  escucharForm();
}

main();
