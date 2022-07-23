const url = "http://localhost:3000/api/products";
let httpReq;

function loadProducts() {
    try {
        if (httpReq.readyState === XMLHttpRequest.DONE) {
            if (httpReq.status === 200) {
                const products = JSON.parse(httpReq.response);
                const sizeProducts = products.length

                const sect = document.querySelector('#items');

                for (let i = 0; i < sizeProducts; i++) {

                    const a = document.createElement('a');
                    a.href = "./product.html?id=" + products[i]._id

                    const article = document.createElement('article');

                    const productImg = document.createElement('img');
                    productImg.src = products[i].imageUrl;
                    productImg.alt = products[i].altTxt;

                    const productTitle = document.createElement('h3');
                    productTitle.textContent = products[i].name;
                    productTitle.className = 'productName';

                    const productDescription = document.createElement('p')
                    productDescription.textContent = products[i].description;
                    productDescription.className = 'productDescription';

                    article.appendChild(productImg);
                    article.appendChild(productTitle);
                    article.appendChild(productDescription);
                    a.appendChild(article);
                    sect.appendChild(a);
                }
            } else {
                console.log("Error: " + httpReq.statusText);
            }
        }
    } catch (e) {
        console.log(e.description)
    }
}

function getProducts() {
    httpReq = new XMLHttpRequest();
    httpReq.onreadystatechange = loadProducts;
    httpReq.open("GET", url, true);
    httpReq.send();
}

document.addEventListener('DOMContentLoaded', function() {
    getProducts()
}, false);