const $button = document.querySelector("#sidebar-toggle");
const $wrapper = document.querySelector("#wrapper");

$button.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.toggle("toggled");
});

$(document).ready(function () {
  $("#restpass").click(function (e) {
    e.preventDefault();

    let info = {
      userid: $("#restpass").attr("userId"),
    };

    $.ajax({
      type: "PUT",
      url: `/restpassword/${$("#restpass").attr("userId")}`,
      data: info,
      success: function (response) {
        alert("Password Changed");
        $(location).attr("href", "http://localhost:5000/allusers/1/2");
      },
      error: function (err) {
        alert("Invalid email or password");
        $(location).attr("href", "http://localhost:5000/allusers/1/2");
      },
    });
  });

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
      url: `/allusers/${$(".del").attr("data_url")}`,
      success: function (response) {
        if (response) {
          alert("User deleted");
          $(location).attr("href", "http://localhost:5000/allusers/1/2");
        }
      },
      error: function (err) {
        if (err) {
          alert(err);
          $(location).attr("href", "http://localhost:5000/allusers/1/2");
        }
      },
    });
  });
});
