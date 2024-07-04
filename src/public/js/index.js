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
  $editProductBtn = d.querySelectorAll(".edit-product-button"),
  $editProductForm = d.getElementById("edit-product-form");

const $editAvatarForm = d.getElementById("edit-avatar-form");
const $avatar = d.querySelector(".avatar");
const $editAvatarLabel = d.querySelector(".edit-avatar");
const $avatarContainer = d.getElementById(".avatar-container");

const $updateUserRoleBtn = d.querySelectorAll(".update-user-role-button");
const $deleteUserBtn = d.querySelectorAll(".delete-user-button");

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
    await fetch(`/api/users/premium/${$changeRoleBtn.dataset.id}`, {
      method: "put",
    });

    location.reload();
  }

  $updateUserRoleBtn.forEach(async (btn) => {
    if (e.target === btn || e.target === btn.querySelector("i")) {
      await fetch(`api/users/premium/${btn.dataset.id}`, {
        method: "put",
        body: JSON.stringify({
          _id: btn.dataset.id,
          role: btn.dataset.role,
        }),
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
      });

      location.reload();
    }
  });

  $deleteUserBtn.forEach(async (btn) => {
    if (e.target === btn || e.target === btn.querySelector("i")) {
      await fetch(`/api/users/${btn.dataset.id}`, {
        method: "delete",
      });

      location.reload();
    }
  });

  if (e.target === $controlBtn || e.target.matches(`#control-btn *`))
    location.assign("/control");

  $deleteProductBtn.forEach(async (btn) => {
    if (e.target === btn || e.target === btn.querySelector("i")) {
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
      d.getElementById("edit-product-modal").showModal();

      console.log(btn.dataset.product);

      $editProductForm.dataset.product = btn.dataset.product;
      $editProductForm.title.value = btn.dataset.title;
      $editProductForm.description.value = btn.dataset.description;
      $editProductForm.price.value = btn.dataset.price;
      $editProductForm.code.value = btn.dataset.code;
      $editProductForm.stock.value = btn.dataset.stock;
      $editProductForm.category.value = btn.dataset.category;
    }
  });

  if (e.target === d.getElementById("edit-product-cancel"))
    d.getElementById("edit-product-modal").close();
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
    let formData = new FormData($addProductForm);
    await fetch(`/api/products`, {
      method: "post",
      body: formData,
    });

    location.reload();
  }
  if (e.target === $editProductForm) {
    let res = await fetch(`/api/products/${$editProductForm.dataset.product}`, {
        method: "put",
        body: JSON.stringify({
          title: $editProductForm.title.value,
          description: $editProductForm.description.value,
          price: parseInt($editProductForm.price.value),
          code: parseInt($editProductForm.code.value),
          stock: parseInt($editProductForm.stock.value),
          category: $editProductForm.category.value,
        }),
        headers: {
          "Content-type": "application/json; charset= utf-8",
        },
      }),
      json = await res.json();

    if (json.status === "success") {
      location.reload();
    } else {
      console.error(json.error);
    }
  }
});

$editAvatarForm.avatar.addEventListener("change", async (e) => {
  $editAvatarForm.submit();
});
