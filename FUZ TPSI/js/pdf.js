function generatePDF(cart){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 30;

    doc.setFontSize(22);
    doc.text("Riepilogo Ordine", 20, 20);

    cart.forEach((product, index) => {

        if(y > 260){
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(16);
        doc.text(product.name, 20, y);

        doc.setFontSize(12);
        doc.text(`Prezzo: €${product.price}`, 20, y + 10);

        y += 30;

    });

    const total = cart.reduce((sum, item) => {
        return sum + Number(item.price);
    }, 0);

    doc.setFontSize(18);
    doc.text(`Totale: €${total}`, 20, y + 10);

    doc.save("ordine.pdf");

}
