const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

fetch("data/prodotti.csv")
.then(response => response.text())
.then(data => {

    const rows = data.split("\n").slice(1);

    const product = rows.find(row => row.split(",")[0] === productId);

    if(!product){
        showToast("Prodotto non trovato");
        return;
    }

    const columns = product.split(",");

    const container = document.getElementById("productDetail");

    const image = document.createElement("img");
    image.src = `assets/${columns[4]}`;

    const info = document.createElement("div");

    const brand = document.createElement("h3");
    brand.textContent = columns[5];

    const title = document.createElement("h1");
    title.textContent = columns[1];

    const desc = document.createElement("p");
    desc.textContent = columns[6];

    const price = document.createElement("h2");
    price.textContent = `€${columns[3]}`;

    const button = document.createElement("button");
    button.textContent = "Aggiungi al carrello";

    button.addEventListener("click", () => {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({
            id: columns[0],
            name: columns[1],
            price: columns[3],
            description: columns[2]
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        showToast("Prodotto aggiunto al carrello");

    });

    info.append(brand, title, desc, price, button);

    container.append(image, info);

});
