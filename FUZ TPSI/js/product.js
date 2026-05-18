const container = document.getElementById("productsContainer");

document.getElementById("storeTitle").textContent =
localStorage.getItem("shopName") || "TechStore";

document.getElementById("storeCategory").textContent =
localStorage.getItem("shopCategory") || "Tecnologia";

fetch("data/prodotti.csv")
.then(response => {

    if(!response.ok){
        throw new Error("Errore caricamento CSV");
    }

    return response.text();
})
.then(data => {

    const rows = data.split("\n").slice(1);

    rows.forEach(row => {

        const columns = row.split(",");

        const card = document.createElement("div");
        card.classList.add("product-card");

        const image = document.createElement("img");
        image.src = `assets/${columns[4]}`;

        const content = document.createElement("div");
        content.classList.add("product-content");

        const title = document.createElement("h3");
        title.textContent = columns[1];

        const desc = document.createElement("p");
        desc.textContent = columns[2];

        const price = document.createElement("p");
        price.classList.add("price");
        price.textContent = `€${columns[3]}`;

        const button = document.createElement("button");
        button.textContent = "Dettagli prodotto";

        button.addEventListener("click", () => {
            window.location.href = `prodotto.html?id=${columns[0]}`;
        });

        content.append(title, desc, price, button);

        card.append(image, content);

        container.appendChild(card);

    });

})
.catch(error => {

    showToast(error.message);

});
