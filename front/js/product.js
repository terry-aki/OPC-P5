const url = "http://localhost:3000/api/products/";
let httpReq;
let product;

function loadProduct() {
    try {
        if (httpReq.readyState === XMLHttpRequest.DONE) {
            if (httpReq.status === 200) {
                product = JSON.parse(httpReq.response);

                const imgClass = document.querySelector('.item__img');
                const img = document.createElement('img');
                img.src = product.imageUrl;
                img.alt = product.altTxt
                imgClass.appendChild(img);

                const title = document.querySelector('#title');
                title.textContent = product.name;

                const price = document.querySelector('#price');
                price.textContent = product.price;

                const description = document.querySelector('#description');
                description.textContent = product.description;

                const selectColor = document.querySelector('#colors');
                const sizeColors = product.colors.length;
                for (let i = 0; i < sizeColors; i++) {
                    const option = document.createElement("option");
                    option.text = product.colors[i];
                    selectColor.add(option);
                }
            } else {
                console.log("Error: " + httpReq.statusText);
            }
        }
    } catch (e) {
        console.log(e.description)
    }
}

function getProduct(productId) {
    httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = loadProduct;
    httpReq.open("GET", url + productId, true);
    httpReq.send();
}

document.addEventListener('DOMContentLoaded', function() {
    const parsedUrl = new URL(window.location.href);
    const productID = parsedUrl.searchParams.get('id');
    getProduct(productID)
}, false);

const addToCart = document.querySelector('#addToCart');
addToCart.addEventListener('click', event => {
    const color = document.querySelector('#colors');
    const quantity = document.querySelector('#quantity');

    let cartProduct = {};
    cartProduct._id = product._id;
    cartProduct.color  = color.value;

    const jsonCartProducts = localStorage.getItem('cartProducts')
    let cartProducts = JSON.parse(jsonCartProducts)

    if (cartProducts !== null) {
        localStorage.removeItem('cartProducts');

        const found = (element) => element._id === product._id && element.color === color.value;
        const foundIndex = cartProducts.findIndex(found);
        if (foundIndex > -1) {
            cartProduct.quantity = parseInt(quantity.value) + cartProducts[foundIndex].quantity;
            cartProducts.splice(foundIndex, 1);
        } else {
            cartProduct.quantity = parseInt(quantity.value);
        }

    } else {
        cartProducts = []
        cartProduct.quantity = parseInt(quantity.value);
    }


    cartProducts.push(cartProduct);

    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
});