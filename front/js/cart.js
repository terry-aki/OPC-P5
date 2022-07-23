const url = "http://localhost:3000/api/products/";
let totalQuantity = 0;
let totalPrice = 0;

function getTotal() {
    if (totalQuantity < 0) {
        totalQuantity = 0;
    }
    if (totalPrice < 0) {
        totalPrice = 0;
    }

    const tQuantity = document.querySelector('#totalQuantity');
    tQuantity.textContent = String(totalQuantity);

    const tPrice = document.querySelector('#totalPrice');
    tPrice.textContent = String(totalPrice);
}

function deleteCartProduct(product, productColor, productQuantity) {
    const article = document.querySelector("article[data-id="+CSS.escape(product._id)+"]");
    article.remove();

    const jsonCartProducts = localStorage.getItem('cartProducts')
    let cartProducts = JSON.parse(jsonCartProducts)

    localStorage.removeItem('cartProducts');

    const found = (element) => element._id === product._id && element.color === productColor;
    const foundIndex = cartProducts.findIndex(found);

    totalQuantity -= productQuantity
    totalPrice -= cartProducts[foundIndex].quantity * parseInt(product.price);

    cartProducts.splice(foundIndex, 1);
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

    if (totalQuantity === 0) {
        const cartOrder = document.querySelector("div[class=cart__order]");
        cartOrder.remove();
    }

    getTotal()
}

function changeQuantity(product, productColor, quantity) {
    const jsonCartProducts = localStorage.getItem('cartProducts')
    let cartProducts = JSON.parse(jsonCartProducts)

    let cartProduct = {};
    cartProduct._id = product._id;
    cartProduct.color  = productColor;
    cartProduct.quantity = parseInt(quantity);

    localStorage.removeItem('cartProducts');

    const found = (element) => element._id === product._id && element.color === productColor;
    const foundIndex = cartProducts.findIndex(found);

    totalQuantity -= cartProducts[foundIndex].quantity;
    totalQuantity += cartProduct.quantity;

    totalPrice -= cartProducts[foundIndex].quantity * parseInt(product.price);
    totalPrice += cartProduct.quantity * parseInt(product.price);

    cartProducts.splice(foundIndex, 1);
    cartProducts.push(cartProduct);

    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

    getTotal()
}

function pushCartItem(cartProduct, cartProductColor, cartProductQuantity) {
    totalQuantity += cartProductQuantity;
    totalPrice += parseInt(cartProduct.price) * cartProductQuantity;

    getTotal()

    const sect = document.querySelector('#cart__items');

    const article = document.createElement('article');
    article.className = 'cart__item'
    article.setAttribute('data-id', cartProduct._id)
    article.setAttribute('data-color', cartProductColor)

    const divImg = document.createElement('div');
    divImg.className = 'cart__item__img';

    const img = document.createElement('img');
    img.src = cartProduct.imageUrl;
    img.alt = cartProduct.altTxt;

    const divContent = document.createElement('div');
    divImg.className = 'cart__item__content';

    const divContentDescription = document.createElement('div');
    divContentDescription.className = 'cart__item__content__description';

    const title = document.createElement('h2');
    title.textContent = cartProduct.name;

    const color = document.createElement('p');
    color.textContent = cartProductColor;

    const price = document.createElement('p');
    price.textContent = cartProduct.price + " €";

    const divContentSettings = document.createElement('div');
    divContentSettings.className = 'cart__item__content__settings';

    const divContentSettingsQuantity = document.createElement('div');
    divContentSettingsQuantity.className = 'cart__item__content__settings__quantity';

    const quantity = document.createElement('p');
    quantity.textContent = "Qté : ";

    const quantityNumber = document.createElement('input');
    quantityNumber.type = "number";
    quantityNumber.className = 'itemQuantity'
    quantityNumber.name = "itemQuantity";
    quantityNumber.min = "1";
    quantityNumber.max = "100";
    quantityNumber.value = cartProductQuantity;

    quantityNumber.addEventListener('change', event => {
        changeQuantity(cartProduct, cartProductColor, quantityNumber.value)
    });

    const divContentSettingsDelete = document.createElement('div');
    divContentSettingsDelete.className = 'cart__item__content__settings__delete';

    divContentSettingsDelete.addEventListener('click', event => {
        deleteCartProduct(cartProduct, cartProductColor, cartProductQuantity);
    })

    const deleteItem = document.createElement('p');
    deleteItem.textContent = "Supprimer";
    deleteItem.className = 'deleteItem'

    divImg.appendChild(img);
    divContentDescription.appendChild(title);
    divContentDescription.appendChild(color);
    divContentDescription.appendChild(price);
    divContent.appendChild(divContentDescription)
    divContentSettingsQuantity.appendChild(quantity);
    divContentSettingsQuantity.appendChild(quantityNumber);
    divContentSettings.appendChild(divContentSettingsQuantity)
    divContentSettingsDelete.appendChild(deleteItem)
    divContentSettings.appendChild(divContentSettingsDelete)
    divContent.appendChild(divContentSettings)
    article.appendChild(divImg);
    article.appendChild(divContent);
    sect.appendChild(article);
}

function getProduct(productId, color, quantity) {
    const httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = function() {
        try {
            if (httpReq.readyState === XMLHttpRequest.DONE) {
                if (httpReq.status === 200) {
                    product = JSON.parse(httpReq.response);
                    pushCartItem(product, color, quantity);
                } else {
                    console.log("Error: " + httpReq.statusText);
                }
            }
        } catch (e) {
            console.log(e)
        }
    };
    httpReq.open("GET", url + productId, true);
    httpReq.send();
}

function getCartProducts(cartProducts) {
    const sizeCartProducts = cartProducts.length

    for (let i = 0; i < sizeCartProducts; i++) {
        getProduct(cartProducts[i]._id, cartProducts[i].color, cartProducts[i].quantity)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const jsonCartProducts = localStorage.getItem('cartProducts');
    const cartProducts = JSON.parse(jsonCartProducts);

    getTotal();

    if (cartProducts === null || cartProducts.length === 0) {
        const cartOrder = document.querySelector("div[class=cart__order]");
        cartOrder.remove();
    } else {
        getCartProducts(cartProducts);
    }

    const cartOrderForm = document.querySelector("form[class=cart__order__form]");
    cartOrderForm.onsubmit = function() {return false};

}, false);

function createOrderObject() {
    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName');
    const address = document.querySelector('#address');
    const city = document.querySelector('#city');
    const email = document.querySelector('#email');

    let orderObject = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products : []
    };

    const jsonCartProducts = localStorage.getItem('cartProducts');
    const cartProducts = JSON.parse(jsonCartProducts);

    const sizeCartProducts = cartProducts.length

    for (let i = 0; i < sizeCartProducts; i++) {
        orderObject.products.push(cartProducts[i]._id);
    }

    return JSON.stringify(orderObject);
}

function checkFormIsValid() {
    const numberRegex = /\d/;
    const mailRegex = new RegExp('@');

    const firstName = document.querySelector('#firstName');
    if (firstName.value === "") {
        const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
        firstNameErrorMsg.textContent = "Veuillez saisir un prénom."
        return false;
    } else if (numberRegex.test(firstName.value) === true) {
        const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
        firstNameErrorMsg.textContent = "Un prénom ne peut contenir de chiffre."
        return false;
    } else {
        const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
        firstNameErrorMsg.textContent = ""
    }

    const lastName = document.querySelector('#lastName');
    if (lastName.value === "") {
        const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
        lastNameErrorMsg.textContent = "Veuillez saisir un nom de famille."
        return false;
    } else if (numberRegex.test(lastName.value) === true) {
        const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
        lastNameErrorMsg.textContent = "Un nom de famille ne peut contenir de chiffre."
        return false;
    } else {
        const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
        lastNameErrorMsg.textContent = ""
    }

    const address = document.querySelector('#address');
    if (address.value === "") {
        const addressErrorMsg = document.querySelector('#addressErrorMsg');
        addressErrorMsg.textContent = "Veuillez saisir une adresse."
        return false;
    } else {
        const addressErrorMsg = document.querySelector('#addressErrorMsg');
        addressErrorMsg.textContent = ""
    }

    const city = document.querySelector('#city');
    if (city.value === "") {
        const cityErrorMsg = document.querySelector('#cityErrorMsg');
        cityErrorMsg.textContent = "Veuillez saisir une ville."
        return false;
    } else {
        const cityErrorMsg = document.querySelector('#cityErrorMsg');
        cityErrorMsg.textContent = ""
    }

    const email = document.querySelector('#email');
    if (mailRegex.test(email.value) === false) {
        const emailErrorMsg = document.querySelector('#emailErrorMsg');
        emailErrorMsg.textContent = "Veuillez saisir une adresse mail valide."
        return false;
    } else {
        const emailErrorMsg = document.querySelector('#emailErrorMsg');
        emailErrorMsg.textContent = ""
    }
    return true;
}

const submitForm = document.querySelector('#order');
submitForm.addEventListener('click', event => {
    if (checkFormIsValid() === true) {
        const httpReq = new XMLHttpRequest();
        httpReq.onreadystatechange = function() {
            try {
                if (httpReq.readyState === XMLHttpRequest.DONE) {
                    if (httpReq.status === 201) {
                        const order = JSON.parse(httpReq.response);
                        window.location.href = "./confirmation.html?id=" + order.orderId;
                    } else {
                        console.log("Error: " + httpReq.statusText);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        };
        httpReq.open("POST", url + "order", true);
        httpReq.setRequestHeader("Content-Type", "application/json");
        httpReq.send(createOrderObject());
    }
});