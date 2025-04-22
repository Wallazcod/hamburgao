const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal();
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Botao ao clicar em fechar no MODAL
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) 

        addToCart(name, price)
    }
})

// Função para adicionar no carrinho 
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name )

    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    }else{
    cart.push({
        name,
        price,
        quantity: 1,
    })
}

    updateCartModal()

}

//Atualiza o carrinho
function updateCartModal(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML =  `
        <div class="flex itemns=center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>


                <button class="cursor-pointer bg-red-600 text-white rounded px-1 py-0 remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>

        </div>
        `

        total += item.price * item.quantity

        cartItems.appendChild(cartItemElement)
    } )

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //Vai ler a quantidade de itens dentro do array(lista de itens) cart é o array e length lê
    cartCounter.innerHTML = cart.length;

}

//função para remover o item do carrinho
cartItems.addEventListener("click", function(event){
    //verificando se onde eu clicar vai ter o "remove-from-cart-btn" que foi colocado dentro da class no botao de remover
    if(event.target.classList.contains("remove-from-cart-btn")){

        // Aqui vai pegar o nome do item que foi removido atravez do data name definido
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    //O findIndex vai procurar dentro da lista um Item, ele não devolve nada quando encontra -1 na lista, por isso tem que ser diferente de -1
    //Sendo diferente de -1, vai entrar na lista e procurar o item correto 
    if(index !== -1){
        //cart[index] para ir direto para o item especifico que queremos, e não a lista toda
        const item = cart[index];

        //Se o item ter mais de 1, vai estar liberado para retirar uma unidade caso clicque no "Remover"
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return
        }

        //Caso o item da lista não for maior que 1, vai usar o SPLICE pega a posição da variavel index e exclui o item que esta solo
        cart.splice(index, 1)
        updateCartModal();
    }
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


//Finalizar pedido, tudo o que pode acontecer na hora de clicar no botão "Finalizar pedido"
checkoutBtn.addEventListener("click", function(){

    //Criando alerta de restaurante fechado "!" é como um "se não"
    const isOpen = checkRestauranteOpen();
    if(!isOpen){
        // alert("RESTAURANTE FECHADO NO MOMENTO!")
        // return

        Toastify({
            text: "Ops, Restaurante fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }
          }).showToast();

          return;
    }

    //Se finalizar o pedido, sem ter nada no carrinho, logo o programa não vai fazer nada
    if(cart.length ===0) return;

    //Se não ter nada escrito no campo do input, vou exibir um alerta
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11988686416"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart=[];
    updateCartModal();
    
})

//Verificar a hora e manipular o card hoorario
function checkRestauranteOpen (){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //true restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-600");
    spanItem.classList.remove("bg-green-600");
}