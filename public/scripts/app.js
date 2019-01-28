/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 $(document).ready(function() {

  showNav();

  loadTweets();

  $(".new-tweet textarea").on("keyup", function() {
    $("#noTextError").hide();
    $(this).next().find(".counter").text(140 - $(this).val().length);
    if ($(this).val().length > 140) {
      $(this).next().find(".counter").addClass("red");
    } else {
      $("#tooLongError").hide();
      $(this).next().find(".counter").removeClass("red");
    }
  });

  $(".new-tweet form").submit(function (event) {

    event.preventDefault();

    if ($("#tweetText").val() === "") {
      //alert("Invalid Tweet. You Should Input Something!");
      $("#noTextError").show();
    } else if($("#tweetText").val().length > 140) {
      //alert("Invalid Tweet. The Tweet Is Too Long");
      $("#tooLongError").show();
    } else {
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: $("#tweetText").serialize()
      }).success(function () {
        $("#tweetText").val("");
        $("#tweetText").next().find(".counter").text(140);
        $.ajax({
          type: "GET",
          url: "/tweets",
          dataType: "json",
        }).success(function (data) {
          $('#tweets-container').empty();
          loadTweets();
        });
      });
    }
  });

  $("#compose").on("click", function() {
    $(".new-tweet").fadeToggle();
    $("#tweetText").focus();
  });
});

function renderTweets(tweets) {
  for (var tweetData of tweets.reverse()) {
    let $tweet = createTweetElement(tweetData, tweets.indexOf(tweetData));
    $('#tweets-container').append($tweet);
  }
}

function createTweetElement(tweetData, index) {

  let $tweet = $('<article>').addClass('tweet');

  let userObj = tweetData.user;
  let contentObj = tweetData.content;
  let createdAt = tweetData.created_at;
  let text = contentObj.text;
  let likes = (contentObj.likes) ? (contentObj.likes) : 0;

  let article = `
        <header>
          <img class="profile" src="${userObj.avatars.small}">
          <h2 id="user_name">${userObj.name}</h2>
          <p>${userObj.handle}</p>
        </header>
        <p>${escape(text)}</p>
        <footer>
          <p>${timestampTrans(createdAt)} ago</p>
          <p id="timestamp" style="display:none;">${createdAt}</>
          <p id="likeNum">${likes}</p>
          <i class="far fa-heart" id="heart${index}" style="cursor: pointer;"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-flag"></i>
        </footer>`;

  return $tweet.append(article);
}

function escape(str) {

  let betterStr = str;

  if (str.length >= 46 && !str.includes(" ")){
    betterStr = `${str.substring(0, str.length / 2 | 0)} ${str.substring(str.length / 2 | 0 + 1, str.length)}`;
  }

  let p = document.createElement("p");

  for (let letter of betterStr) {
    if (letter === "\n" || letter === "\r\n") {
      p.appendChild(document.createElement("br"));
    } else {
      p.appendChild(document.createTextNode(letter));
    }
  }
  return p.innerHTML;
}

function timestampTrans(timestamp) {

  let createdTime = timestamp;
  let nowTime = Date.now();

  let timeDiff =  Math.floor((nowTime - createdTime) / 1000 );

  if (timeDiff > 31536000) { // secs one year
    return (Math.floor(timeDiff / 31536000)) > 1 ?
           (Math.floor(timeDiff / 31536000)) + " years" : "1 year";
  }

  if (timeDiff > 2592000) { // secs one month
    return (Math.floor(timeDiff / 2592000)) > 1 ?
           (Math.floor(timeDiff / 2592000)) + " months" : "1 month";
  }

  if (timeDiff > 86400) { // secs one day
    return (Math.floor(timeDiff / 86400))  > 1 ?
           (Math.floor(timeDiff / 86400)) + " days" : "1 day";
  }

  if (timeDiff > 3600) { // secs one hour
    return (Math.floor(timeDiff / 3600)) > 1 ?
           (Math.floor(timeDiff / 3600)) + " hours" : "1 hour";
  }

  if (timeDiff > 60) { // secs one min
    return (Math.floor(timeDiff / 60)) > 1 ?
           (Math.floor(timeDiff / 60)) + " mins" : "1 min";
  }

  return (timeDiff < 0) ? "0 sec" : timeDiff + " secs";
}

function loadTweets() {

  $.ajax({
      type: "GET",
      url: "/tweets",
      dataType: "json",
    }).success(function (data) {
      renderTweets(data);
      likeOrDislike();
  });
}

function likeOrDislike() {
  $("i.far.fa-heart").on("click", function(event) {

    let id = $(this).attr('id');
    let like = 0;
    let num = Number($(`#${id}`).parent().find("#likeNum").text());

    if ($(`#${id}`).attr("liked")) {
      num--;
      $(`#${id}`).removeAttr("liked");
      like = -1;
    } else {
      num++;
      $(`#${id}`).attr("liked", true);
      like = 1;
    }

    $(`#${id}`).parent().find("#likeNum").text(num);

    let username = $(`#${id}`).parent().parent().find("#user_name").html();
    let timestamp = $(`#${id}`).parent().find("#timestamp").text();
    $.ajax({
      type: "POST",
      url: "/tweets/like/?_method=PUT",
      data: {like: like, username: username, timestamp: timestamp}
    });
  });
}


function showNav() {

  let userId = Cookies.get('user_id');
  let userHandle = Cookies.get("user_handle");

  let nav = `<a href="/"><img class="logo" src="/images/bird.png"></a>
              <span class="header">Tweeter</span>`;

  if(userId) {
    nav += `<p>@${userHandle}</p>
            <button><a href="/user/logout">Logout</a></button>`;
  } else {
    nav += `<button><a href="/user/login">Login</a></button>
            <button><a href="/user/register">Register</a></button>`;
  }

  nav += `<button id="compose" type="button">Compose</button>`;
  $("#nav-bar").append(nav);
}
