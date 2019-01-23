
$(document).ready(function () {

  var tweetContent = "";

  $(".new-tweet textarea").on("keyup", function() {

    tweetContent = $(this).val();

    $(this).next().find(".counter").text(140 - $(this).val().length);
    if ($(this).val().length > 140) {
      $(this).next().find(".counter").addClass("red");
    } else {
      $(this).next().find(".counter").removeClass("red");
    }
  });


  $(".new-tweet form").submit(function (event) {

    event.preventDefault();

    if (tweetContent === "") {
      alert("Invalid Tweet. You Should Input Something!");
    } else if(tweetContent.length > 140) {
      alert("Invalid Tweet. The Tweet Is Too Long");
    } else {
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: $("textarea").serialize()
      }).success(function () {

      }).complete(function () {
        $("#tweetText").val("");
        $("#tweetText").next().find(".counter").text(140);
      });
    }
  });
});