"use strict";

import "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";

console.log(
  "%cDon't paste anything here!",
  "color:red; font-family: monospace; font-size:24px"
);

$(document).ready(function () {
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
