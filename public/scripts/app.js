/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

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
  console.log(createdTime);
  console.log(nowTime);

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

renderTweets(data);
