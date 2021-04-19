const $button = document.querySelector("#sidebar-toggle");
const $wrapper = document.querySelector("#wrapper");

$button.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.toggle("toggled");
});

$(document).ready(function () {
 
  // #################### change profile ####################
  function readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").attr("src", e.target.result);
        $("#slideimg").attr("src", e.target.result);

        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageUpload").change(function () {
    readURL(this);
  });
  // ################# put req for update user info ####################
  $(".sub").click(function (e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("firstname", $("input[name=firstname]").val());
    formData.append("lastname", $("input[name=lastname]").val());
    formData.append("username", $("input[name=username]").val());
    formData.append("email", $("input[name=email]").val());
    formData.append("password", $("input[name=password]").val());
    formData.append("gender", $("select").children("option:selected").val());
    formData.append("mobile", $("input[name=mobile]").val());
    formData.append("newpassword", $("input[name=newpassword]").val());
    formData.append("avatar", $("input[type=file]")[0].files[0]);

    $.ajax({
      type: "PUT",
      url: "/profile/edit",
      data: formData,
      enctype: "multipart/form-data",
      contentType: false,
      processData: false,
      success: function (response) {
        if (response) {
          $(location).attr("href", "http://localhost:5000/profile/edit");
        }
      },
      error: function (err) {
        if (err) {
          $(location).attr("href", "http://localhost:5000/profile/edit");
        }
      },
    });
  });
});
