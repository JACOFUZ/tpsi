const cartItems = document.getElementById("cartItems");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart(){

    cartItems.innerHTML = "";

    let total = 0;

    if(cart.length === 0){

        showToast("Il carrello è vuoto");

    }

    cart.forEach((product, index) => {

        total += Number(product.price);

        const item = document.createElement("div");
        item.classList.add("cart-item");

        const title = document.createElement("h3");
        title.textContent = product.name;

        const desc = document.createElement("p");
        desc.textContent = product.description;

        const price = document.createElement("p");
        price.textContent = `€${product.price}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Rimuovi";

        removeBtn.addEventListener("click", () => {

            cart.splice(index,1);

            localStorage.setItem("cart", JSON.stringify(cart));

            renderCart();

        });

        item.append(title, desc, price, removeBtn);

        cartItems.appendChild(item);

    });

    document.getElementById("cartTotal").textContent =
    `Totale: €${total}`;

}

renderCart();

document.getElementById("clearCartBtn")
.addEventListener("click", () => {

    localStorage.removeItem("cart");

    location.reload();

    showToast("Carrello svuotato");

});

document.getElementById("downloadPdfBtn")
.addEventListener("click", () => {

    generatePDF(cart);

});

