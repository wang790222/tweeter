/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 $(document).ready(function() {

  loadTweets();

  $(".new-tweet textarea").on("keyup", function() {

    $(this).next().find(".counter").text(140 - $(this).val().length);
    if ($(this).val().length > 140) {
      $(this).next().find(".counter").addClass("red");
    } else {
      $(this).next().find(".counter").removeClass("red");
    }
  });

  $(".new-tweet form").submit(function (event) {

    event.preventDefault();

    if ($("#tweetText").val() === "") {
      alert("Invalid Tweet. You Should Input Something!");
    } else if($("#tweetText").val().length > 140) {
      alert("Invalid Tweet. The Tweet Is Too Long");
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
});

function renderTweets(tweets) {
  // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (var tweetData of tweets.reverse()) {
      let $tweet = createTweetElement(tweetData);
      $('#tweets-container').append($tweet);
    }
}

function createTweetElement(tweetData) {

  let $tweet = $('<article>').addClass('tweet');

  let userObj = tweetData.user;
  let contentObj = tweetData.content;
  let createdAt = tweetData.created_at;

  let article = `
        <header>
          <img class="profile" src="${userObj.avatars.small}">
          <h2>${userObj.name}</h2>
          <p>${userObj.handle}</p>
        </header>
        <p>${escape(contentObj.text)}</p>
        <footer>
          <p>${timestampTrans(createdAt)} ago</p>
        </footer>`;

  return $tweet.append(article);
}

function escape(str) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  console.log(p.innerHTML);
  return p.innerHTML;
}

function timestampTrans(timestamp) {

  let createdTime =timestamp / 1000;
  let nowTime = Date.now() / 1000;

  let timeDiff =  Math.floor(nowTime - createdTime);

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

  return timeDiff + " secs";
}

function loadTweets() {

  $.ajax({
      type: "GET",
      url: "/tweets",
      dataType: "json",
    }).success(function (data) {
      renderTweets(data);
    });
}
