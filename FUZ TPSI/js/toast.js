function showToast(message){

    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.classList.add("toast");

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);

}
