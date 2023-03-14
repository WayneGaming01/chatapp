"use strict";

import "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";

console.log(
  "%cDon't paste anything here!",
  "color:red; font-family: monospace; font-size:24px"
);

$(document).ready(function () {
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
  
  $("#nav-toggler").each(function (_, navToggler) {
    var target = $(navToggler).data("target");
    $(navToggler).on("click", function () {
      $(target).animate({
        height: "toggle",
      });
    });
  });

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
});
