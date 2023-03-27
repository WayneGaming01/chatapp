"use strict";
import "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";
import Toast from "/library/js/Toast.js";
const swup = new Swup();

console.log(
  "%cDon't paste anything here!",
  "color:red; font-family: monospace; font-size:24px"
);

const init = () => {
  function getFileExtension(filename) {
    // get file extension
    const extension = filename.substring(
      filename.lastIndexOf(".") + 1,
      filename.length
    );
    return extension;
  }

  if (document.querySelector("#server-avatar")) {
    const server_avatar = document.getElementById("server-avatar");
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const allowedExtension_jpg = "jpg";
    const allowedExtension_jpeg = "jpeg";
    const allowedExtension_png = "png";
    const allowedExtension_gif = "gif";

    server_avatar.addEventListener("change", function () {
      let hasInvalidFiles = false;
      for (var i = 0; i < this.files.length; i++) {
        const file = this.files[i];

        if (!allowedExtensions.find(extension => extension === getFileExtension(server_avatar.value))) {
          hasInvalidFiles = true;
          server_avatar.value = "";

          new Toast({
            text: "The file you have uploaded is not allowed!",
            position: "bottom-center",
            canClose: false,
            showProgress: false,
          });
        }
      }
    });
  }
  if (document.querySelector(".signup_modal-overlay")) {
    var openmodal = document.querySelectorAll(".signup_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        signup_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".signup_modal-overlay") &&
    document.querySelector(".signup_modal-close")
  ) {
    const overlay = document.querySelector(".signup_modal-overlay");
    overlay.addEventListener("click", signup_toggleModal);

    var closemodal = document.querySelectorAll(".signup_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", signup_toggleModal);
    }
  }

  function signup_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".signup_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("signup_modal-active");
  }

  if (document.querySelector(".login_modal-overlay")) {
    var openmodal = document.querySelectorAll(".login_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        login_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".login_modal-overlay") &&
    document.querySelector(".login_modal-close")
  ) {
    const overlay = document.querySelector(".login_modal-overlay");
    overlay.addEventListener("click", login_toggleModal);

    var closemodal = document.querySelectorAll(".login_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", login_toggleModal);
    }
  }

  function login_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".login_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("login_modal-active");
  }

  //addaserver modal
  if (document.querySelector(".joinaserver_modal-overlay")) {
    var openmodal = document.querySelectorAll(".joinaserver_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        joinaserver_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".joinaserver_modal-overlay") &&
    document.querySelector(".joinaserver_modal-close")
  ) {
    const overlay = document.querySelector(".joinaserver_modal-overlay");
    overlay.addEventListener("click", joinaserver_toggleModal);

    var closemodal = document.querySelectorAll(".joinaserver_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", joinaserver_toggleModal);
    }
  }

  function joinaserver_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".joinaserver_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("joinaserver_modal-active");
  }

  //createserver modal
  if (document.querySelector(".createserver_modal-overlay")) {
    var openmodal = document.querySelectorAll(".createserver_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        createserver_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".createserver_modal-overlay") &&
    document.querySelector(".createserver_modal-close")
  ) {
    const overlay = document.querySelector(".createserver_modal-overlay");
    overlay.addEventListener("click", createserver_toggleModal);

    var closemodal = document.querySelectorAll(".createserver_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", createserver_toggleModal);
    }
  }

  function createserver_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".createserver_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("createserver_modal-active");
  }

  //addserver modal
  if (document.querySelector(".addserver_modal-overlay")) {
    var openmodal = document.querySelectorAll(".addserver_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        addserver_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".addserver_modal-overlay") &&
    document.querySelector(".addserver_modal-close")
  ) {
    const overlay = document.querySelector(".addserver_modal-overlay");
    overlay.addEventListener("click", addserver_toggleModal);

    var closemodal = document.querySelectorAll(".addserver_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", addserver_toggleModal);
    }
  }

  function addserver_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".addserver_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("addserver_modal-active");
  }

  //profile modal
  if (document.querySelector(".profile_modal-overlay")) {
    var openmodal = document.querySelectorAll(".profile_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        profile_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".profile_modal-overlay") &&
    document.querySelector(".profile_modal-close")
  ) {
    const overlay = document.querySelector(".profile_modal-overlay");
    overlay.addEventListener("click", profile_toggleModal);

    var closemodal = document.querySelectorAll(".profile_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", profile_toggleModal);
    }
  }

  function profile_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".profile_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("profile_modal-active");
  }

  $(document).ready(function () {
    if (document.querySelector("#join-a-serverform")) {
      $("#join-a-serverform").submit(async function (e) {
        e.preventDefault();

        const invite_link = $("#invite-link").val();

        try {
          const res = await fetch("/api/join/server", {
            method: "POST",
            body: JSON.stringify({
              invite_link: invite_link,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          console.log(data);
          if (data.errors) {
            if (data.errors.invite_link) {
              new Toast({
                text: data.errors.invite_link,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }
          }
          if (data.server) {
            new Toast({
              text: "Joining the server...",
              position: "bottom-center",
              canClose: false,
              showProgress: false,
            });
            $("#invite-link").val("");
            $("#invite-link").prop("disabled", true);
            $("#join-a-server").prop("disabled", true);
            setTimeout(() => {
              $("body").removeClass("joinaserver_modal-active");
              location.assign("/app");
            }, 1000);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (document.querySelector("#create-serverform")) {
      $("#create-serverform").submit(async function (e) {
        e.preventDefault();

        const server_avatar = $("#server-avatar").val();
        const server_name = $("#server-name").val();
        const server_bio = $("#server-bio").val();

        try {
          const res = await fetch("/api/add/server", {
            method: "POST",
            body: JSON.stringify({
              server_avatar: server_avatar,
              server_name: server_name,
              server_bio: server_bio,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          console.log(data);
          if (data.errors) {
            if (data.errors.server_name) {
              new Toast({
                text: data.errors.server_name,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }

            if (data.errors.server_avatar) {
              new Toast({
                text: data.errors.server_avatar,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }
          }
          if (data.server) {
            new Toast({
              text: "Creating the server...",
              position: "bottom-center",
              canClose: false,
              showProgress: false,
            });
            $("#server-name").val("");
            $("#server-bio").val("");
            $("#server-name").prop("disabled", true);
            $("#server-bio").prop("disabled", true);
            $("#create-server").prop("disabled", true);
            $("body").removeClass("createserver_modal-active");
            setTimeout(() => {
              location.assign("/app");
            }, 1000);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (document.querySelector("#gotoServers")) {
      function gotoServers() {
        location.assign("/servers");
      }
    }

    if (document.querySelector("#signupform")) {
      $("#signupform").submit(async function (e) {
        e.preventDefault();

        const username = $("#signup-username").val();
        const email = $("#signup-email").val();
        const password = $("#signup-password").val();
        const cpassword = $("#signup-cpassword").val();

        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({
              username: username,
              email: email,
              password: password,
              cpassword: cpassword,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          console.log(data);
          if (data.errors) {
            if (data.errors.username) {
              new Toast({
                text: data.errors.username,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }

            if (data.errors.email) {
              new Toast({
                text: data.errors.email,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
              });
            }

            if (data.errors.password) {
              new Toast({
                text: data.errors.password,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
              });
            }
          }
          if (data.user) {
            new Toast({
              text: "Signing up...",
              position: "bottom-center",
              canClose: false,
              showProgress: false,
            });
            $("#signup-username").val("");
            $("#signup-email").val("");
            $("#signup-password").val("");
            $("#signup-cpassword").val("");
            $("#signup-username").prop("disabled", true);
            $("#signup-email").prop("disabled", true);
            $("#signup-password").prop("disabled", true);
            $("#signup-cpassword").prop("disabled", true);
            $("#signup").prop("disabled", true);
            setTimeout(() => {
              new Toast({
                text: "Done! Check your email.",
                position: "bottom-center",
                canClose: false,
                showProgress: false,
              });
              $("#username").prop("disabled", false);
              $("#email").prop("disabled", false);
              $("#password").prop("disabled", false);
              $("#cpassword").prop("disabled", false);
              $("#signup").prop("disabled", false);
            }, 5000);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (document.querySelector("#loginform")) {
      $("#loginform").submit(async function (e) {
        e.preventDefault();

        const email = $("#login-email").val();
        const password = $("#login-password").val();

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          console.log(data);
          if (data.errors) {
            if (data.errors.email) {
              new Toast({
                text: data.errors.email,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                setFontSize: "12px",
              });
            }

            if (data.errors.password) {
              new Toast({
                text: data.errors.password,
                position: "bottom-center",
                canClose: false,
                showProgress: false,
                setFontSize: "12px",
              });
            }
          }
          if (data.user) {
            new Toast({
              text: "Logging in...",
              position: "bottom-center",
              canClose: false,
              showProgress: false,
            });
            $("#login-email").val("");
            $("#login-password").val("");
            $("#login-email").prop("disabled", true);
            $("#login-password").prop("disabled", true);
            $("#login").prop("disabled", true);
            setTimeout(() => {
              location.assign("/app");
            }, 1000);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  });

  if (document.querySelector("#nav-toggler")) {
    $("#nav-toggler").on("click", function () {
      if (!$("#nav-toggler").hasClass("active")) {
        $(".nav-toggler").addClass("active");
        $(".nav-toggler").html('<i class="fa-solid fa-xmark"></i>');
      } else {
        $(".nav-toggler").removeClass("active");
        $(".nav-toggler").html(
          '<i class="transition ease-in fa-solid fa-bars"></i>'
        );
      }
    });
  }

  if (document.querySelector("#nav-toggler")) {
    $("#nav-toggler").each(function (_, navToggler) {
      var target = $(navToggler).data("target");
      $(navToggler).on("click", function () {
        $(target).animate({
          height: "toggle",
        });
      });
    });
  }

  if (!localStorage.getItem("dark")) {
    if ($("html").hasClass("dark")) {
      localStorage.setItem("dark", "true");
    } else {
      localStorage.setItem("dark", "false");
    }
  }

  if (localStorage.getItem("dark") == "false") {
    $("html").removeClass("dark");
    $("#dark-mode").html('<i class="fa-solid fa-moon"></i>');
  } else {
    $("html").addClass("dark");
    $("#dark-mode").html('<i class="fa-solid fa-sun"></i>');
  }

  if (document.querySelector("#dark-mode")) {
    $("#dark-mode").on("click", function () {
      if ($("html").hasClass("dark")) {
        $("html").removeClass("dark");
        localStorage.setItem("dark", "false");
        $("#dark-mode").html('<i class="fa-solid fa-moon"></i>');
      } else {
        $("html").addClass("dark");
        localStorage.setItem("dark", "true");
        $("#dark-mode").html('<i class="fa-solid fa-sun"></i>');
      }
    });
  }
};

if (document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", () => init());
}

swup.on("contentReplaced", init);
