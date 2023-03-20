"use strict";
import "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";
import Toast from "/library/js/Toast.js";
const swup = new Swup();

console.log(
  "%cDon't paste anything here!",
  "color:red; font-family: monospace; font-size:24px"
);

const init = () => {
  //addaserver modal
  if (document.querySelector(".addaserver_modal-overlay")) {
    var openmodal = document.querySelectorAll(".addaserver_modal-open");
    for (var i = 0; i < openmodal.length; i++) {
      openmodal[i].addEventListener("click", function (event) {
        event.preventDefault();
        addaserver_toggleModal();
      });
    }
  }

  if (
    document.querySelector(".addaserver_modal-overlay") &&
    document.querySelector(".addaserver_modal-close")
  ) {
    const overlay = document.querySelector(".addaserver_modal-overlay");
    overlay.addEventListener("click", addaserver_toggleModal);

    var closemodal = document.querySelectorAll(".addaserver_modal-close");
    for (var i = 0; i < closemodal.length; i++) {
      closemodal[i].addEventListener("click", addaserver_toggleModal);
    }
  }

  function addaserver_toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".addaserver_modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("addaserver_modal-active");
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

        const invite_link = $("#invite-link").val();;

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
                position: "bottom-right",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }
          }
          if (data.server) {
            new Toast({
              text: "Joining the server...",
              position: "bottom-right",
              canClose: false,
              showProgress: false,
            });
            $("#invite-link").val("");
            $("#invite-link").prop("disabled", true);
            $("#join-a-server").prop("disabled", true);
            setTimeout(() => {
              $("body").removeClass("addaserver_modal-active");
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

        const server_name = $("#server-name").val();
        const server_bio = $("#server-bio").val();

        try {
          const res = await fetch("/api/add/server", {
            method: "POST",
            body: JSON.stringify({
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
                position: "bottom-right",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }
          }
          if (data.server) {
            new Toast({
              text: "Creating the server...",
              position: "bottom-right",
              canClose: false,
              showProgress: false,
            });
            $("#server-name").val("");
            $("#server-bio").val("");
            $("#server-name").prop("disabled", true);
            $("#server-bio").prop("disabled", true);
            $("#create-server").prop("disabled", true);
            setTimeout(() => {
              location.assign("/app");
            }, 5000);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }

    if (document.querySelector("#signupform")) {
      $("#signupform").submit(async function (e) {
        e.preventDefault();

        const username = $("#username").val();
        const email = $("#email").val();
        const password = $("#password").val();
        const cpassword = $("#cpassword").val();

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
                position: "bottom-right",
                canClose: false,
                showProgress: false,
                backgroundColor: "default",
              });
            }

            if (data.errors.email) {
              new Toast({
                text: data.errors.email,
                position: "bottom-right",
                canClose: false,
                showProgress: false,
              });
            }

            if (data.errors.password) {
              new Toast({
                text: data.errors.password,
                position: "bottom-right",
                canClose: false,
                showProgress: false,
              });
            }
          }
          if (data.user) {
            new Toast({
              text: "Signing up...",
              position: "bottom-right",
              canClose: false,
              showProgress: false,
            });
            $("#username").val("");
            $("#email").val("");
            $("#password").val("");
            $("#cpassword").val("");
            $("#username").prop("disabled", true);
            $("#email").prop("disabled", true);
            $("#password").prop("disabled", true);
            $("#cpassword").prop("disabled", true);
            $("#signup").prop("disabled", true);
            setTimeout(() => {
              new Toast({
                text: "Done! Check your email.",
                position: "bottom-right",
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

        const email = $("#email").val();
        const password = $("#password").val();

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
                position: "bottom-right",
                canClose: false,
                showProgress: false,
                setFontSize: "12px",
              });
            }

            if (data.errors.password) {
              new Toast({
                text: data.errors.password,
                position: "bottom-right",
                canClose: false,
                showProgress: false,
                setFontSize: "12px",
              });
            }
          }
          if (data.user) {
            new Toast({
              text: "Logging in...",
              position: "bottom-right",
              canClose: false,
              showProgress: false,
            });
            $("#email").val("");
            $("#password").val("");
            $("#email").prop("disabled", true);
            $("#password").prop("disabled", true);
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
