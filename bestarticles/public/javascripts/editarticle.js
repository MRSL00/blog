const $button = document.querySelector("#sidebar-toggle");
const $wrapper = document.querySelector("#wrapper");

$button.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.toggle("toggled");
});

$(document).ready(function () {
  
  // ############### change cover ###############
  function readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $(".cover").attr("src", e.target.result);
        $(".cover").hide();
        $(".cover").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#cover").change(function () {
    readURL(this);
  });
  // ############### editor setting ###############
  const options = {
    theme: "snow",
  };
  const editor = new Quill("#quillEditor", options);
  $(".ql-editor").html($("input[name=content]").val());
  // ############### edit article ###############
  $("#form").submit(function (e) {
    $("input[name=content]").val($(".ql-editor").html());
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", $("input[name=title]").val());
    formData.append("content", $("input[name=content]").val());
    formData.append("cover", $("input[type=file]")[0].files[0]);
    $.ajax({
      type: "PUT",
      url: `/article/edit/${$("#btn").attr("artid")}`,
      data: formData,
      enctype: "multipart/form-data",
      contentType: false,
      processData: false,
      success: function (response) {
        if (response) {
          $(location).attr(
            "href",
            `http://localhost:5000/article/edit/${$("#btn").attr("artid")}`
          );
        }
      },
      error: function (err) {
        if (err) {
          $(location).attr(
            "href",
            `http://localhost:5000/article/edit/${$("#btn").attr("artid")}`
          );
        }
      },
    });
  });
});
