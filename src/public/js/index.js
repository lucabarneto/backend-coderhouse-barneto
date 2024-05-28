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
  $changeRoleBtn = d.getElementById("change-role-button");

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
    let res = await fetch(
      `/api/sessions/premium/${$changeRoleBtn.dataset.id}`,
      {
        method: "put",
      }
    );

    location.reload();
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

      if (json.status === "error") {
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
});
