//Variables :
const initial = document.querySelector(".active"),
    pageInitial = document.querySelector("#initial"),
    pageRegister = document.querySelector(".register"),
    pageShopCart = document.querySelector(".shopCartPage"),
    pageLogin = document.querySelector("#login"),
    pagePay = document.querySelector(".creditCard"),
    register = document.querySelector("#register"),
    formReg = document.querySelector("#formReg"),
    nameReg = document.querySelector("#nameReg"),
    lastNameReg = document.querySelector("#lastNameReg"),
    emailReg = document.querySelector("#emailReg"),
    userReg = document.querySelector("#userReg"),
    passReg = document.querySelector("#passReg"),
    passCReg = document.querySelector("#passCReg"),
    btnReg = document.querySelector("#btnReg"),
    userLog = document.querySelector("#userLog"),
    passLog = document.querySelector("#passLog"),
    checkbox = document.querySelector("#remember"),
    btnLogin = document.querySelector("#btnLogin"),
    loginUser = document.querySelector(".loginUser"),
    dropdown = document.querySelector("#dropdownOnOff"),
    userProfile = document.querySelector("#userProfile"),
    showCart = document.querySelector("#showCart"),
    logOut = document.querySelector("#logOut"),
    userMenu = document.querySelector("#userMenu"),
    formLogin = document.querySelector(".formLogin"),
    search = document.querySelector("#search"),
    parfums = document.getElementById("parfums"),
    shopCartBuy = document.getElementById("shopCartBuy"),
    totalBuy = document.getElementById("totalBuy"),
    brandCheckboxes = document.querySelectorAll('input[name="brand"]'),
    btnPay = document.getElementById("btnPay"),
    paid = document.getElementById("paid"),
    creditCard = document.getElementById("credit-card");

let usersArr = JSON.parse(localStorage.getItem("users")) || [],
    products = [],
    currentUser =
        localStorage.getItem("login") ||
        sessionStorage.getItem("login") ||
        "",
    loginTF = false,
    myShopCart = [],
    total = 0;


//Functions

//Carga en el array products los productos guardados en el archivo json.
async function loadProducts() {
    const response = await fetch("./product/product.json");
    const productos = await response.json();
    localStorage.setItem("productos", JSON.stringify(productos));
    products = JSON.parse(localStorage.getItem("productos"));
    showProducts(products);
}
//Guarda el array products en el localStorage.
function saveLSProd(array) {
    localStorage.setItem("productos", JSON.stringify(array));
}

//Funciones de navegación en una sola página (index.html)

//Página principal
const showHTMLInitial = () => {
    pageRegister.classList.add("inactive");
    pageLogin.classList.add("inactive");
    pageShopCart.classList.add("inactive");
    pagePay.classList.add("inactive");
    showProducts(products);
    pageInitial.classList.remove("inactive");
};
//Página de logueo
const showHTMLLogin = () => {
    pageInitial.classList.add("inactive");
    pageRegister.classList.add("inactive");
    pageShopCart.classList.add("inactive");
    pagePay.classList.add("inactive");
    pageLogin.classList.remove("inactive");
};
//Página de registro
const showHTMLRegister = () => {
    pageInitial.classList.add("inactive");
    pageLogin.classList.add("inactive");
    pageShopCart.classList.add("inactive");
    pagePay.classList.add("inactive");
    pageRegister.classList.remove("inactive");
};
//Página carrito.
const showHTMLShopCart = () => {
    pageInitial.classList.add("inactive");
    pageLogin.classList.add("inactive");
    pageRegister.classList.add("inactive");
    pagePay.classList.add("inactive");
    pageShopCart.classList.remove("inactive");
}
//Página de Pago
const showHTMLPay = () => {
    pageInitial.classList.add("inactive");
    pageLogin.classList.add("inactive");
    pageRegister.classList.add("inactive");
    pageShopCart.classList.add("inactive");
    pagePay.classList.remove("inactive");
}

//Funciones de registro.

//Clase Usuario
class User {
    constructor(name, lastName, email, user, password) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.user = user;
        this.password = password;
        this.shopCart = [];
    }
}
//Valida el usuario a registrar
function validateUserReg(obj, passConfir) {
    const { name, lastName, email, user, password } = obj;
    if (usersArr.find((users) => users.user === user)) {
        Swal.fire({
            icon: "error",
            title: "El usuario ya existe!",
            text: "Elija otro usuario, por favor.",
        });
        return false;
    }
    if (password != passConfir) {
        Swal.fire({
            icon: "error",
            title: "Contraseña incorrecta!",
            text: "La contraseña y la confirmación son diferentes.",
        });
        return false;
    } else {
        return true;
    }
}
//Guarda usuario en el array de usuarios.
function registerUser(array, newUser) {
    array.push(newUser);
}
//Guarda el array usuarios en el localStorage.
function saveLS(array) {
    localStorage.setItem("users", JSON.stringify(array));
}

//Funciones de inicio de sesión.

//Validar usuario.
function validateUser(user, pass) {
    for (const item of usersArr) {
        if (item.user === user && item.password === pass) {
            return user;
        }
    }
    return null;
}
//Logear usuario.
function loginOn() {
    loginTF = true;
    loginUser.textContent = `${currentUser}`;
    loginUser.classList.add("dropdown-toggle");
    dropdown.classList.remove("inactive");
    showHTMLInitial();
}
//Busca si está recordada en localStorage o sessionStorage.
function checkLog() {
    if (currentUser != "") loginOn();
}
//Iniciar sesión con usuario y pass.
function loginOk() {
    currentUser = validateUser(userLog.value, passLog.value);
    if (currentUser) {
        checkbox.checked
            ? localStorage.setItem("login", userLog.value)
            : sessionStorage.setItem("login", userLog.value);
        loginOn();
    } else {
        Swal.fire({
            icon: "error",
            title: "Nombre de usuario o contraseña incorrecto.",
            text: "Intente nuevamente, por favor.",
        });
    }
}
//Cerrar sesión.
function logOutUser() {
    loginTF = false;
    loginUser.textContent = "Iniciar sesión";
    loginUser.classList.remove("dropdown-toggle");
    dropdown.classList.add("inactive");
    localStorage.removeItem("login") || sessionStorage.removeItem("login");
    currentUser = "";
    showHTMLInitial();
}

//Funciones para manipular productos

//Filtrado
function searchFilter() {
    const valorBusqueda = search.value.toLowerCase();
    const selectedBrands = Array.from(brandCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value) || products;
    filteredProducts = [];
    if (selectedBrands.length === 0) {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter((product) => {
            return (selectedBrands.includes(product.brand))
        });
    }
    filteredProducts = filteredProducts.filter(producto => producto.product.toLowerCase().includes(valorBusqueda));
    showProducts(filteredProducts);
}
//Función para mostrar productos.
function showProducts(arrProducts) {
    parfums.innerHTML = "";
    arrProducts.sort((stockA, stockB) => stockB.stock - stockA.stock);
    let html;
    for (const item of arrProducts) {
        const { id, brand, product, image, price, stock } = item;
        html = `<div class="boxProduc">
                    <h3>${brand}</h3>
                    <img src=${image} alt=${product}>
                    <p>${product}</p>
                    <p>$ ${stock === 0 ? "Sin Stock" : price}</p>
                    <a class="buy" id="${id}" href="#">Comprar</a>
                </div>`;
        parfums.innerHTML += html;
    }
    const buyBtn = document.querySelectorAll("a.buy");
    buyBtn.forEach((buyProduct) => {
        buyProduct.addEventListener("click", (e) => {
            e.preventDefault();
            const productId = e.target.id;
            console.log(productId);
            loginTF ? addShopCart(productId) : showHTMLLogin();
        });
    });
}
//Función para mostrar los productos del carrito
function showMyShopCart(arrProductsShopCart) {
    parfums.innerHTML = '';
    shopCartBuy.innerHTML = '';
    totalBuy.innerHTML = '';
    total = 0;
    let html;
    for (const item of arrProductsShopCart) {
        const { id, brand, product, image, price, stock } = item;
        html = `<div class="shopCartBox">
                <h3>${brand}</h3>
                <img src=${image} alt=${product}>
                <p>${product}</p>
                <div class="quantity">
                    <p>Cantidad: ${stock} </p>
                    <button class="removePrd" id="${id}"> X </button>
                </div>
                <div class="pricePrd">
                    <p>Precio unidad</p>
                    <p>${price}</p>
                    <p>subtotal</p>
                    <p>${price * stock}</p>
                </div>
            </div>`;
        shopCartBuy.innerHTML += html;
        total += price * stock;
    }

    const removeBtn = document.querySelectorAll("button.removePrd");
    removeBtn.forEach((removeProduct) => {
        removeProduct.addEventListener("click", (e) => {
            const productId = e.target.id;
            console.log(productId);
            removeShopCart(productId);
        });
    });
    if(shopCartBuy.innerHTML === "") {
        shopCartBuy.innerHTML = "<h3 class='tituloSecundario'>No tiene productos cargados en su carrito.</h3>"
        btnPay.classList.add("inactive");
    } else {
        btnPay.classList.remove("inactive");
        totalBuy.innerHTML = `<h3>Total: $${total}</h3>`;
    }
    
}
//Función para agregar al carrito.
function addShopCart(id) {
    let buyPrd = products.find((parfum) => parfum.id === id);
    let exists = usersArr
        .find((users) => users.user === currentUser)
        .shopCart.some((el) => el.id === id);
    if (!exists && buyPrd.stock != 0) {
        usersArr
            .find((users) => users.user === currentUser)
            .shopCart.push({ ...buyPrd });
        usersArr
            .find((users) => users.user === currentUser)
            .shopCart.find((el) => el.id === id).stock = 1;
        buyPrd.stock--;
        myShopCart = usersArr
            .find((users) => users.user === currentUser)
            .shopCart;
        saveLSProd(products);
        saveLS(usersArr);
        Swal.fire({
            position: "center",
            icon: "success",
            title: `${buyPrd.product} de ${buyPrd.brand} se agregó correctamente al carrito!!`,
            showConfirmButton: false,
            timer: 3000,
        });
    } else if (exists && buyPrd.stock != 0) {
        usersArr
            .find((users) => users.user === currentUser)
            .shopCart.find((el) => el.id === id).stock++;
        buyPrd.stock--;
        myShopCart = usersArr
            .find((users) => users.user === currentUser)
            .shopCart;
        saveLSProd(products);
        saveLS(usersArr);
        Swal.fire({
            position: "center",
            icon: "success",
            title: `${buyPrd.product} de ${buyPrd.brand} se agregó correctamente al carrito!!`,
            showConfirmButton: false,
            timer: 3000,
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Sin Stock",
            text: `Lo sentimos. ${buyPrd.product} está sin stock.`,
        });
    }
}
//Función para quitar del carrito.
function removeShopCart(id) {
    let removeStock = usersArr.find(users => users.user === currentUser).shopCart.find(item => item.id === id);
    console.log(removeStock.stock);
    if (removeStock.stock - 1 != 0) {
        removeStock.stock--;
        products.find(el => el.id === id).stock++;
        myShopCart = [];
        saveLSProd(products);
        saveLS(usersArr);        
        myShopCart = usersArr
        .find((users) => users.user === currentUser)
        .shopCart;
        showHTMLShopCart();
        showMyShopCart(myShopCart)
    } else {
        let objRemove = usersArr.find(users => users.user === currentUser).shopCart.findIndex(el => el.id === id);
        usersArr.find(users => users.user === currentUser).shopCart.splice(objRemove, 1);
        products.find(el => el.id === id).stock++;
        myShopCart = [];
        saveLSProd(products);
        saveLS(usersArr);
        myShopCart = usersArr
        .find((users) => users.user === currentUser)
        .shopCart;
        showHTMLShopCart();
        showMyShopCart(myShopCart)
    }
}
//Si tengo productos en localStorage los carga en el array, sino los trae del .json.
function loadProductsArray() {
    if (JSON.parse(localStorage.getItem("productos"))) {
        products = JSON.parse(localStorage.getItem("productos"));
        showProducts(products);
    } else {
        loadProducts();
    }
}

checkLog();
loadProductsArray();

//Events.

//Filtrado por checkbox
brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        searchFilter();
    });
});
//Ir a inicio de sesión.
loginUser.addEventListener("click", (e) => {
    e.preventDefault();
    !loginTF && showHTMLLogin();
});
//Ir a registrar usuario.
register.addEventListener("click", (e) => {
    e.preventDefault();
    showHTMLRegister();
});
//Ir al inicio.
initial.addEventListener("click", (e) => {
    e.preventDefault();    
    showHTMLInitial();
});
//Ir al carrito
showCart.addEventListener("click", (e) => {
    e.preventDefault();
    showHTMLShopCart();
    myShopCart = usersArr
        .find((users) => users.user === currentUser)
        .shopCart;
    showMyShopCart(myShopCart);
});

//Guardar registro de usuario.
formReg.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
        !nameReg.value ||
        !lastNameReg.value ||
        !emailReg.value ||
        !userReg.value ||
        !passReg.value ||
        !passCReg.value
    ) {
        Swal.fire({
            icon: "error",
            title: "Todos los campos son requeridos!",
            text: "Complete todos los campos, por favor.",
        });
    } else {
        const newUser = new User(
            nameReg.value,
            lastNameReg.value,
            emailReg.value,
            userReg.value,
            passReg.value
        );
        if (validateUserReg(newUser, passCReg.value)) {
            registerUser(usersArr, newUser);
            saveLS(usersArr);
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Bienvenido a Perfumes de Nicho ${nameReg.value}!!`,
                showConfirmButton: false,
                timer: 3000,
            });
            formReg.reset();
            showHTMLLogin();
        }
    }
});

//Iniciar sesión.
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    loginOk();
});

//Cerrar sesión.
logOut.addEventListener("click", () => {
    logOutUser();
});

//Busqueda
search.addEventListener("keyup", searchFilter);

//Pagar
btnPay.addEventListener("click", (e) => {
    e.preventDefault();
    showHTMLPay();
})

//Realizar pago
paid.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Pago realizado con éxito!",
        showConfirmButton: false,
        timer: 3000,
    });
    creditCard.reset();
    usersArr.find(users => users.user === currentUser).shopCart = [];
    saveLS(usersArr);
    showHTMLInitial();
})