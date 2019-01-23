
$(document).ready(function () {
  $(".new-tweet form").submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/tweets",
      data: $("textarea").serialize()
    }).success(function () {

    }).complete(function () {
      $("textarea").val("");
    });


    console.log($("textarea").serialize());
  });
});