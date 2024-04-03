//Instancio el socket del lado del cliente
const socket = io();

const d = document;

/*:::::Sección Chat:::::*/
const $chat = d.getElementById("online-chat"),
  $formChat = d.getElementById("form-chat"),
  $chatUsername = d.getElementById("input-chat-username"),
  $chatMessage = d.getElementById("input-chat-message"),
  $chatSubmit = d.getElementById("chat-submit");

$chat.innerHTML = "";

//Habilitar el submit
$formChat.addEventListener("keyup", () => {
  $chatSubmit.classList.add("disabled");

  if ($chatUsername.value !== "") {
    if ($chatMessage.value !== "") {
      $chatSubmit.classList.remove("disabled");
    } else {
      $chatSubmit.classList.add("disabled");
    }
  }
});

//Añadir mensaje al chat
$formChat.addEventListener("submit", async (e) => {
  e.preventDefault();
  $chatSubmit.classList.add("disabled");

  const newMessage = {
    user: $chatUsername.value,
    message: $chatMessage.value,
  };

  fetch("http://localhost:8080/api/chat/", {
    method: "POST",
    body: JSON.stringify(newMessage),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).catch((err) => {
    console.log(err);
  });

  d.getElementById("input-message").value = "";
});

socket.on("new message", (data) => {
  $chat.innerHTML += `
    <div><strong>${data.user}:</strong> ${data.message}</div>
    `;
});

/*:::::Login:::::*/
// const $loginForm = d.getElementById("login-form");

// $loginForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const userData = {
//     email: d.getElementById("login-form__email").value,
//     password: d.getElementById("login-form__password").value,
//   };

//   fetch("http://localhost:8080/api/sessions/login", {
//     method: "POST",
//     body: JSON.stringify(userData),
//     headers: {
//       "Content-Type": "application/json; charset=UTF-8",
//     },
//   });
// });
