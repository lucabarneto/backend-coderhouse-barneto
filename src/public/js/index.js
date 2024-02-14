//Instancio el socket del lado del cliente
const socket = io();

//DOM
const d = document,
  $chat = d.getElementById("online-chat"),
  $auth = d.getElementById("auth"),
  $typing = d.getElementById("user-typing"),
  $chatSubmit = d.getElementById("chat-submit"),
  $authSubmit = d.getElementById("auth-submit"),
  $formChat = d.getElementById("form-chat"),
  $formAuth = d.getElementById("form-auth"),
  $connections = d.createElement("div"),
  $list = document.getElementById("pr-list");

//::RealTimeProducts View::
//Agrego producto

//Prevengo que se recargue la página y guardo los values de los inputs en un objeto
d.getElementById("add-pr-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    title: d.getElementById("pr-title").value,
    description: d.getElementById("pr-description").value,
    price: Number(d.getElementById("pr-price").value),
    category: d.getElementById("pr-category").value,
    stock: Number(d.getElementById("pr-stock").value),
    code: Number(d.getElementById("pr-code").value),
    thumbnails: [],
  };

  console.log(data);

  socket.emit("addProduct", data);
});

//Pinto el nuevo producto en la lista
socket.on("updatedAddProducts", (data) => {
  $list.innerHTML = "";
  console.log(data);
  data.map((pr) => {
    $list.innerHTML += `
      <li>
        <div> ${pr.title} </div>
        <div> $${pr.price} - categoría: ${pr.category}
        <div> ${pr.pid} </div>
      </li>
    `;
  });
});

//Elimino producto

//Prevengo que se recargue la página y guardo los values del input en un objeto
d.getElementById("del-pr-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const $data = Number(d.getElementById("pr-pid").value);

  console.log($data);

  socket.emit("delProduct", $data);
});

//Pinto la lista sin el producto eliminado
socket.on("updatedDelProducts", (data) => {
  $list.innerHTML = "";
  console.log(data);
  data.map((pr) => {
    $list.innerHTML += `
      <li>
        <div> ${pr.title} </div>
        <div> $${pr.price} - categoría: ${pr.category}
        <div> ${pr.pid} </div>
      </li>
    `;
  });
});
