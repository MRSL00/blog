$(document).ready(function () {
  const img = $(".jumbotron").attr("id");

  $(".jumbotron").css({ "background-image": "url(" + img + ")" });
  $("body").click(function () {
    $(".alert").fadeOut("slow", function () {
      $(this).removeClass("d-block");
    });
  });
  // create comment
  $("#share").click(function (e) {
    e.preventDefault();

    let info = {
      comment: $("#comment").val(),
      article: $("#comment").attr("idArt"),
    };
    $.ajax({
      type: "POST",
      url: "/comment",
      data: info,
      success: function (response) {
        $(location).attr(
          "href",
          `http://localhost:5000/article/${$("#comment").attr("idArt")}`
        );
      },
      error: function (err) {
        if (err) {
          $(".alert").text("you can not share empty comment");

          $(".alert").addClass("d-block");
        }
      },
    });
  });
  //delete comment
  $("#delete").click(function (e) {
    e.preventDefault();
    const id = $(this).attr("commentId");
    $.ajax({
      type: "delete",
      url: `/comment/${id}`,
      success: function (response) {
        if (response) {
          alert("Comment Deleted");
          $(location).attr(
            "href",
            `http://localhost:5000/article/${$("#comment").attr("idArt")}`
          );
        }
      },
      error: function (err) {
        if (err) {
          alert(err.massage);
          $(location).attr(
            "href",
            `http://localhost:5000/article/${$("#comment").attr("idArt")}`
          );
        }
      },
    });
  });

  // !edit comment
  // show selected comment in modal
  $(".fa-pencil").click(function () {
    const id = $(this).attr("id");
    const commentId = $(this).attr("commentId");
    const find_comment = id.split(" ")[1];
    const comment_text = $(`p#${+find_comment}`).text();
    $("#edit_comment").attr("commentId", commentId);
    $("#edit_comment").val(comment_text.trim());
  });
  $(".close").click(function () {
    $("#edit_comment").removeAttr("commentId");
    $("#edit_comment").val("");
  });

  $("#editcommet").click(function (e) {
    e.preventDefault();
    const id = $("#edit_comment").attr("commentId");

    let info = {
      comment: $("#edit_comment").val(),
    };

    $.ajax({
      type: "PUT",
      url: `/comment/${id}`,
      data: info,
      success: function (response) {
        $(location).attr(
          "href",
          `http://localhost:5000/article/${$("#comment").attr("idArt")}`
        );
      },
      error: function (err) {
        if (err) {
          $(".al_modal").text("you can not share empty comment");

          $(".al_modal").addClass("d-block");
        }
      },
    });
  });
});
