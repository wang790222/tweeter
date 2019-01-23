/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function renderTweets(tweets) {
  // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (var tweetData of tweets) {
      let $tweet = createTweetElement(tweetData);
      //console.log($tweet);
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
        <p>${contentObj.text}</p>
        <footer>
          <p>${timestampTrans(createdAt)} ago</p>
        </footer>`;

  return $tweet.append(article);
}

function timestampTrans (timestamp) {

  let createdTime = timestamp / 1000;
  let nowTime = Math.floor(Date.now()) / 1000;

  let timeDiff = nowTime - createdTime;

  if (timeDiff > 31536000) { // secs one year
    return (Math.floor(timeDiff / 31536000)) + " years";
  }

  if (timeDiff > 2592000) { // secs one month
    return (Math.floor(timeDiff / 2592000)) + " months";
  }

  if (timeDiff > 86400) { // secs one day
    return (Math.floor(timeDiff / 86400)) + " days";
  }

  if (timeDiff > 3600) { // secs one hour
    return (Math.floor(timeDiff / 3600)) + " hours";
  }

  if (timeDiff > 60) { // secs one min
    return (Math.floor(timeDiff / 60)) + " mins";
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
    }).complete(function () {

    });
}

$( document ).ready(function() {
  loadTweets();
});

