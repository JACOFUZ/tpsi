const form = document.getElementById("configForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const shopName = document.getElementById("shopName").value;
    const shopCategory = document.getElementById("shopCategory").value;

    localStorage.setItem("shopName", shopName);
    localStorage.setItem("shopCategory", shopCategory);

    window.location.href = "index.html";

});
