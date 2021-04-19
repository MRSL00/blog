$(document).ready(function () {
  $("#pass_recovery").click(function (e) {
    e.preventDefault();
    let info = {
      email: $("input[name=passrecover]").val(),
      password: $("input[name=emailPass]").val(),
    };
    $.ajax({
      type: "POST",
      url: "/password_recovery",
      data: info,
      success: function (response) {},
      error: function (err) {},
    });
  });
});
