// Esta función debería alterar el HTML
// para mostrar el restulado elegido en la pantalla
function dibujarElMejorProducto(results) {
  const contenedor = document.querySelector(".results");
  const template = document.querySelector("#product_template");
  contenedor.innerHTML = "";

  const titleEl = template.content.querySelector(".product_title");
  titleEl.textContent = results.title;

  const imagenEl = template.content.querySelector(".image");
  imagenEl.src = results.thumbnail;

  const precioEl = template.content.querySelector(".product_price");
  precioEl.textContent = "$" + results.price;

  //Calcula el número de cuota y me da un número entero
  const cuotaEl = template.content.querySelector(".product_condition-item");
  cuotaEl.textContent = Math.round(parseInt(results.price) / 6);

  const linkEl = template.content.getElementById("product");
  linkEl.href = results.permalink;

  const clone = document.importNode(template.content, true);
  contenedor.appendChild(clone);
}

function dibujarDescripcion(results) {
  const contenedor = document.querySelector(".results");
  const template = document.querySelector("#product_template");
  contenedor.innerHTML = "";
  const descriptionTitleEl = template.content.querySelector(
    ".product_description_title"
  );
  const descriptionEl = template.content.querySelector(
    ".product_description_text"
  );
  descriptionEl.textContent = results.plain_text;

  const clone = document.importNode(template.content, true);
  contenedor.appendChild(clone);
}

//Elige el producto más vendido
function elegirElMejorProducto(listaDeProductos) {
  let resultado = listaDeProductos.map((a) => a.sold_quantity);
  let maximo = resultado.reduce(function (a, b) {
    return Math.max(a, b);
  });
  return maximo;
}

function buscarProductos() {
  const formEl = document.querySelector(".search-form");
  formEl.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let palabraABuscar = evento.target.search.value;
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${palabraABuscar}`)
      .then((response) => response.json())
      .then((jsonData) => {
        const arrayDeProductos = jsonData.results;
        const masVendido = elegirElMejorProducto(arrayDeProductos);
        const resultado = arrayDeProductos.find(
          (item) => item.sold_quantity === masVendido
        );
        dibujarElMejorProducto(resultado);
        const id = resultado.id;

        fetch(`https://api.mercadolibre.com/items/${id}/description`)
          .then((response) => response.json())
          .then((json) => {
            dibujarDescripcion(json);
          });
      });
  });
}
function cambiarMode() {
  const body = document.querySelector(".container");
  const searchInput = document.querySelector(".search_input");
  const searchButton = document.querySelector(".search_button");
  const mainTitle = document.querySelector(".main_title");
  const product = document.querySelector(".results");
  let toggle = document.getElementById("toggle");

  toggle.addEventListener("click", (e) => {
    if (toggle.checked) {
      body.classList.add("dark");
      searchInput.classList.add("search_input_dark");
      searchButton.classList.add("search_button_dark");
      mainTitle.classList.add("main_title_dark");
      product.classList.add("product_dark");
    } else {
      body.classList.remove("dark");
      searchInput.classList.remove("search_input_dark");
      searchButton.classList.remove("search_button_dark");
      mainTitle.classList.remove("main_title_dark");
      product.classList.remove("product_dark");
    }
  });
}
// inicia todo e invoca al resto de las funciones
function main() {
  buscarProductos();
  cambiarMode();
}

main();
