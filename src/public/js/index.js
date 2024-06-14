const d = document;

const $registerBtn = d.getElementById("register"),
  $githubBtn = d.getElementById("github"),
  $loginBtn = d.getElementById("login-btn"),
  $homebtn = d.getElementById("home-btn"),
  $userbtn = d.getElementById("user-btn"),
  $cartbtn = d.getElementById("cart-btn"),
  $quantity = d.getElementById("product-quantity"),
  $addProductBtn = d.getElementById("+"),
  $removeProductBtn = d.getElementById("-"),
  $addToCartBtn = d.getElementById("add-to-cart"),
  $counter = d.querySelector(".counter"),
  $addToCartForm = d.getElementById("add-to-cart-form"),
  $cartProductsInfo = d.querySelectorAll(".cart-purchase-info"),
  $cartTotalAmount = d.getElementById("cart-total-amount"),
  $totalAmount = d.getElementById("total-amount"),
  $clearCartBtn = d.getElementById("clear-cart-button"),
  $clearCartForm = d.getElementById("clear-cart-form"),
  $editQuantityBtn = d.querySelectorAll(".edit-quantity-button"),
  $editQuantityModal = d.getElementById("edit-quantity-modal"),
  $editQuantityCancel = d.getElementById("edit-quantity-cancel"),
  $editQuantityForm = d.getElementById("edit-quantity-form"),
  $purchaseForm = d.getElementById("purchase-form"),
  $changeRoleBtn = d.getElementById("change-role-button"),
  $controlBtn = d.getElementById("control-btn"),
  $addProductForm = d.getElementById("add-product-form"),
  $deleteProductBtn = d.querySelectorAll(".delete-product-button"),
  $editProductBtn = d.querySelectorAll(".edit-product-button");

const $editAvatarForm = d.getElementById("edit-avatar-form");
const $avatar = d.querySelector(".avatar");
const $editAvatarLabel = d.querySelector(".edit-avatar");
const $avatarContainer = d.getElementById(".avatar-container");

let quantity = 1;

let initialAmount = 0;

const handleQuantity = (quantity) => {
  if (quantity === 1) {
    $removeProductBtn.disabled = true;
  } else if (quantity === parseInt($quantity.dataset.stock)) {
    $addProductBtn.disabled = true;
  } else {
    $addProductBtn.disabled = false;
    $removeProductBtn.disabled = false;
  }
};

const handleTotalAmount = (amount) => {
  $cartProductsInfo.forEach((pr) => {
    amount += parseInt(pr.dataset.quantity) * parseInt(pr.dataset.price);
  });

  return amount;
};

if ($addToCartBtn) {
  $loginBtn
    ? ($addToCartBtn.disabled = true)
    : ($addToCartBtn.disabled = false);

  if ($controlBtn)
    $addToCartBtn.dataset.owner === $controlBtn.dataset.user
      ? ($addToCartBtn.disabled = true)
      : ($addToCartBtn.disabled = false);

  handleQuantity(quantity);
}

if ($cartTotalAmount) {
  let totalAmount = handleTotalAmount(initialAmount);
  $cartTotalAmount.innerHTML = `<strong>Total de la compra: $<span id="total-amount">${totalAmount}</span></strong>`;

  if ($cartProductsInfo.length === 0) {
    $purchaseForm.querySelector("button").disabled = true;
  }
}

d.addEventListener("click", async (e) => {
  if (e.target === $registerBtn) location.assign("/register");

  if (e.target === $githubBtn) location.assign("/api/sessions/github");

  if (e.target === $loginBtn) location.assign("/login");

  if (e.target === $homebtn || e.target.matches(`#home-btn *`))
    location.assign("/");

  if (e.target === $userbtn || e.target.matches(`#user-btn *`))
    location.assign("/profile");

  if (e.target === $cartbtn || e.target.matches(`#cart-btn *`))
    location.assign(`/cart/${$cartbtn.dataset.cart}`);

  if (e.target.matches(".product") || e.target.matches(`.product *`)) {
    let target = e.target.parentElement || e.target;

    location.assign(`/product/${target.dataset.id}`);
  }

  if (e.target === $addProductBtn) {
    quantity++;
    handleQuantity(quantity);
    $quantity.innerHTML = `<strong>${quantity}</strong>`;
  }

  if (e.target === $removeProductBtn) {
    quantity--;
    handleQuantity(quantity);
    $quantity.innerHTML = `<strong>${quantity}</strong>`;
  }

  $editQuantityBtn.forEach((btn) => {
    if (e.target === btn) {
      $editQuantityModal.showModal();

      $editQuantityForm.quantity.value = btn.dataset.quantity;
      $editQuantityForm.quantity.max = btn.dataset.stock;

      $editQuantityForm.dataset.product = btn.dataset.product;
    }
  });

  if (e.target === $editQuantityCancel) {
    $editQuantityModal.close();
  }

  if (e.target === $changeRoleBtn) {
    await fetch(`/api/sessions/premium/${$changeRoleBtn.dataset.id}`, {
      method: "put",
    });

    location.reload();
  }

  if (e.target === $controlBtn || e.target.matches(`#control-btn *`))
    location.assign("/control");

  $deleteProductBtn.forEach(async (btn) => {
    if (e.target === btn || e.target === btn.querySelector("i")) {
      console.log(e.target);
      console.log(btn.dataset.product);
      let res = await fetch(`/api/products/${btn.dataset.product}`, {
          method: "delete",
        }),
        json = await res.json();

      return json.status === "success"
        ? location.reload()
        : console.error(json.error);
    }
  });

  $editProductBtn.forEach(async (btn) => {
    if (e.target === btn || e.target.matches(`.edit-product-button *`)) {
      if (btn.querySelector("i").classList.contains("fa-pen-to-square")) {
        d.querySelector(".add-product").querySelector("h2").textContent =
          "Editar Producto";
        $addProductForm.name.value = btn.dataset.title;
        $addProductForm.price.value = btn.dataset.price;
        $addProductForm.code.value = btn.dataset.code;
        $addProductForm.stock.value = btn.dataset.stock;
        $addProductForm.category.value = btn.dataset.category;
        $addProductForm.submit.textContent = "Editar producto";

        $addProductForm.submit.dataset.product = btn.dataset.product;

        btn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      } else {
        d.querySelector(".add-product").querySelector("h2").textContent =
          "Agregar producto";
        $addProductForm.name.value = "";
        $addProductForm.price.value = "";
        $addProductForm.code.value = "";
        $addProductForm.stock.value = "";
        $addProductForm.category.value = "";
        $addProductForm.submit.textContent = "Agregar producto";

        $addProductForm.submit.removeAttribute("data-product");

        btn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
      }
    }
  });
});

d.addEventListener("mouseover", async (e) => {
  if (e.target === $avatar || e.target.matches(".avatar *")) {
    $editAvatarLabel.classList.toggle("display-none");
  }
});

d.addEventListener("submit", async (e) => {
  if (e.target === $addToCartForm) {
    try {
      e.preventDefault();

      let res = await fetch(
          `/api/carts/${$addToCartBtn.dataset.cart}/products/${$addToCartBtn.dataset.product}`,
          {
            method: "post",
            body: JSON.stringify({
              quantity: parseInt($quantity.textContent),
            }),
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          }
        ),
        json = await res.json();

      if (json.status === "update") {
        let res2 = await fetch(
            `/api/carts/${$addToCartBtn.dataset.cart}/products/${$addToCartBtn.dataset.product}`,
            {
              method: "put",
              body: JSON.stringify({
                quantity: parseInt($quantity.textContent),
                state: "add",
              }),
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
            }
          ),
          json2 = await res2.json();

        $cartbtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`;
      } else {
        $cartbtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`;
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (e.target === $clearCartForm) {
    e.preventDefault();

    let res = await fetch(`/api/carts/${$clearCartBtn.dataset.cart}`, {
        method: "delete",
      }),
      json = await res.json();

    location.reload();
  }

  if (e.target === $editQuantityForm) {
    e.preventDefault();

    if (parseInt($editQuantityForm.quantity.value) === 0) {
      let res = await fetch(
          `/api/carts/${$editQuantityForm.dataset.cart}/products/${$editQuantityForm.dataset.product}`,
          {
            method: "delete",
          }
        ),
        json = await res.json();

      location.reload();
    } else {
      let res = await fetch(
          `/api/carts/${$editQuantityForm.dataset.cart}/products/${$editQuantityForm.dataset.product}`,
          {
            method: "put",
            body: JSON.stringify({
              quantity: parseInt($editQuantityForm.quantity.value),
              state: "edit",
            }),
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          }
        ),
        json = await res.json();

      location.reload();
    }
  }

  if (e.target === $purchaseForm) {
    e.preventDefault();

    let res = await fetch(`/api/carts/${$purchaseForm.dataset.cart}/purchase`, {
        method: "post",
      }),
      json = await res.json();

    location.assign(`/ticket/${json.payload._id}`);
  }

  if (e.target === $addProductForm) {
    e.preventDefault();

    if ($addProductForm.submit.dataset.product) {
      let res = await fetch(
          `/api/products/${$addProductForm.submit.dataset.product}`,
          {
            method: "put",
            body: JSON.stringify({
              title: $addProductForm.name.value,
              price: parseInt($addProductForm.price.value),
              code: parseInt($addProductForm.code.value),
              stock: parseInt($addProductForm.stock.value),
              category: $addProductForm.category.value,
            }),
            headers: {
              "Content-type": "application/json; charset= utf-8",
            },
          }
        ),
        json = await res.json();

      if (json.status === "success") {
        location.reload();
      } else {
        console.error(json.error);
      }
    } else {
      let res = await fetch("/api/products", {
          method: "post",
          body: JSON.stringify({
            title: $addProductForm.name.value,
            description: "Aquí va la descripción del producto",
            price: parseInt($addProductForm.price.value),
            thumbnails: [],
            code: parseInt($addProductForm.code.value),
            stock: parseInt($addProductForm.stock.value),
            category: $addProductForm.category.value,
            owner:
              $addProductForm.owner.dataset.role === "premium"
                ? $addProductForm.owner.value
                : "admin",
          }),
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
        }),
        json = await res.json();

      if (json.status === "success") {
        location.reload();
      } else {
        console.error(json.error);
      }
    }
  }
});

$editAvatarForm.avatar.addEventListener("change", async (e) => {
  $editAvatarForm.submit();
});
