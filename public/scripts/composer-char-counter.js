
$(document).ready(function() {

  $(".new-tweet textarea").on("keyup", function() {

    $(this).next().find(".counter").text(140 - $(this).val().length);
    if ($(this).val().length > 140) {
      $(this).next().find(".counter").addClass("red");
    } else {
      $(this).next().find(".counter").removeClass("red");
    }
  });
});