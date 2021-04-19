const $button = document.querySelector("#sidebar-toggle");
const $wrapper = document.querySelector("#wrapper");

$button.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.toggle("toggled");
});

$(document).ready(function () {

  $(".delbtn").click(function () {
    const href = $(this).attr("id");
    
    $(".del").attr("data_url", href);

  });
  $("#close").click(function () {
    $(".del").removeAttr("data_url");
  });

  $("#delete").click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "delete",
      url: $(".del").attr("data_url"),
      success: function (response) {
        if (response) {
          alert("Article Deleted");
          $(location).attr("href", "http://localhost:5000/myarticles/1/2");
        }
      },
    });
  });
});
