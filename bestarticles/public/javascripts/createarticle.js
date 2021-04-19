const $button = document.querySelector("#sidebar-toggle");
const $wrapper = document.querySelector("#wrapper");

$button.addEventListener("click", (e) => {
  e.preventDefault();
  $wrapper.classList.toggle("toggled");
});

$(document).ready(function () {
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
  const options = {
    theme: "snow",
  };
  
  const editor = new Quill("#quillEditor", options);
  $("#form").submit(function (e) {
   if(!$(".ql-editor").text().replace(/ /g, "")){
    $("input[name=content]").val("");
   }else{
    $("input[name=content]").val($(".ql-editor").html());
   }
  });
});
