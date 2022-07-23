document.addEventListener('DOMContentLoaded', function() {
    const jsonCartProducts = localStorage.getItem('cartProducts');
    const cartProducts = JSON.parse(jsonCartProducts);

    if (cartProducts === null || cartProducts.length === 0) {
        window.location.href = "./index.html";
    }

    localStorage.removeItem('cartProducts');

    const parsedUrl = new URL(window.location.href);

    const orderId = document.querySelector('#orderId');
    orderId.textContent = parsedUrl.searchParams.get('id');

}, false);