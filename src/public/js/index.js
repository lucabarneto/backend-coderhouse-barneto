//Instancio el socket del lado del cliente
const socket = io();

const d = document;

const $form = d.getElementById("test-form");

$form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data = {
    username: d.getElementById("username").value,
    message: d.getElementById("message").value,
  };

  console.log(data);
});

socket.on("Message", (data) => {
  console.log(data);
});
