const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const addCart = document.getElementById("add-to-cart-btn")
const cartModel = document.getElementById("cart-model")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModelBtn = document.getElementById("close-model-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const menu2 = document.getElementById("menu2")

let cart = [];

//abrir carrinho
cartBtn.addEventListener("click", function () {
    updateCartModel();
    cartModel.style.display = "flex"

})

//fechando carrinho
cartModel.addEventListener("click", function (event) {
    if (event.target === cartModel) {
        cartModel.style.display = "none"
    }
})

closeModelBtn.addEventListener("click", function () {
    cartModel.style.display = "none"
})

menu.addEventListener("click", function (event) {
    

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

    }
    //console.log(event.target)
})

menu2.addEventListener("click", function (event) {
    

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

    }
    //console.log(event.target)
})
//função para adcionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModel()
}

function updateCartModel() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
       


            <button class="remove-cart-btn" data-name="${item.name}">
                Remover
            </button>

        </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;
}

// remover item do carrinho

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModel();
            return;
        }

        cart.splice(index, 1);
        updateCartModel();
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
// finalizando pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops. Sorveteria Fechada no Momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function () { } // Callback after click
        }).showToast();

        return;
    }


    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviando para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}
            |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const fone = "5581996269603"

    window.open(`https://wa.me/${fone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModel();

})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 19;
    //true = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-700");
    spanItem.classList.add("bg-green-700")
} else {
    spanItem.classList.remove("bg-green-700")
    spanItem.classList.add("bg-red-700")

}
