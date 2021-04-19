$(document).ready(function () {
  $("#delete").click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "delete",
      url: $("#ArtDelUrl").attr("href"),
      success: function (response) {
        if (response) {
          $(location).attr("href", "http://localhost:5000/allarticles/1/2");
          alert("Article Deleted");
        }
      },
      error: function (err) {
        if (err) {
          $(location).attr("href", "http://localhost:5000/allarticles/1/2");
          alert(err.massage);
        }
      },
    });
  });
});
