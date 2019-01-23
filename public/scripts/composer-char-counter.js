
$(document).ready(function() {

  $(".new-tweet textarea").on("keyup", function() {

    $(this).next().find(".counter").text(140 - this.value.length);
    if (this.value.length > 140) {
      $(this).next().find(".counter").addClass("red");
    } else {
      $(this).next().find(".counter").removeClass("red");
    }
  });
});