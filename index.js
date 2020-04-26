const RSSParser = require("rss-parser");  //npm olarak import etme  nodejs import etme biçimi
const showModal = require("./modal.js");
window.$ = window.jQuery = require('jquery');
var modal = document.getElementById("pop-up");

// Note: some RSS feeds can't be loaded in the browser due to CORS security.
// To get around this, you can use a proxy.
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

var data = {}
var parser = new RSSParser({
  headers: { 'User-Agent': 'something different' },
  timeout: 5000,
});


var urls = new Array();

function validateForm() {

  var rssSource;

  console.log("sa");

  var input = document.forms["addnewFeedForm"]["urlField"].value;
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
    '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i');

  var inputResult = pattern.test(input);

  if (inputResult == false || urls.includes(input)) {
    alert("Hatalı url veya daha önce girilmiş bir url");

    event.preventDefault();
    document.forms["addnewFeedForm"]["urlField"].value = '';

  } else {
    document.forms["addnewFeedForm"]["urlField"].value = '';
    event.preventDefault();
    urls.push(input);

    var iconUrl = input.split(/([^\/]*\/){3}/);
    iconUrl = input.includes('http') ? iconUrl[1] : iconUrl[1];
    var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${iconUrl}`; //backticking string interpolation

    parser.parseURL(input, function (err, feed) {
      if (err) throw err;
      console.log("burasıparser");
      console.log(feed);

      var sourceName = feed.title;
      var sourceIcon = favicon;
      var sourceLink = feed.link;

      var news = feed.items.map(i => {
        return {
          title: i.title,
          link: i.link,
          pubDate: i.pubDate,
          content: i.content,
        }
      })

      console.log("cısık");

      rssSource = {
        name: sourceName,
        icon: sourceIcon,
        feeds: news,
        link: sourceLink,
        feedcount: Object.keys(feed.items).length
      }


      console.log(rssSource);
      var img = new Image();
      img.src = rssSource.icon;

      var headerFeed = document.createElement('div');
      headerFeed.style.display = 'inline';
      var countFeed = document.createElement('div');
      countFeed.style.display = 'inline';

      var subscriptionElement = document.createElement('div');

      img.classList.add('image');
      countFeed.classList.add('countfeed');
      headerFeed.classList.add('headerfeed');

      subscriptionElement.classList.add('sub-element');
      subscriptionElement.appendChild(img);
      subscriptionElement.appendChild(headerFeed);
      subscriptionElement.appendChild(countFeed);


      headerFeed.textContent = rssSource.name;
      countFeed.textContent = rssSource.feedcount;

      var subsContainer = document.querySelector('#subsTab');
      subsContainer.appendChild(subscriptionElement);

      subscriptionElement.addEventListener("click", function () {

        createMiddleDOM(rssSource)

        var nodes = subsContainer.children;

        var i;
        for (i = 0; i < nodes.length; i++) {
          nodes[i].style.backgroundColor = "#F2F4F6";
          console.log(nodes);
          console.log("siliyorum");
        }

        subscriptionElement.style.background = '#E6E7E8';
      });

      modal.style.display = "none";

    })
  }
}

function createMiddleDOM(rssSource) {

  console.log("simdirsssourcegelecek");
  console.log(rssSource);

  const container = document.querySelector('#middle');
  container.innerHTML = '';

  var subcontainer = document.createElement('div');
  subcontainer.classList.add('container-subcontainer');

  var searchdiv = document.createElement('div');
  searchdiv.classList.add('container-searchdiv');

  var searchinputBox = document.createElement('INPUT');
  searchinputBox.setAttribute("type", "text");
  searchinputBox.setAttribute("placeholder", "Search");
  searchinputBox.classList.add("search-input");

  searchdiv.innerHTML = '<i class="fas fa-search"></i>';

  searchdiv.appendChild(searchinputBox);

  var hidediv = document.createElement('div');
  hidediv.classList.add('container-hidediv');
  
  var hideButton = document.createElement("BUTTON");
  hideButton.textContent="<";
  hideButton.classList.add("hidebtn");
  hidediv.appendChild(hideButton);

  var itemsCount = document.createElement('p');
  itemsCount.textContent = `${rssSource.feedcount} items`;
  hidediv.appendChild(itemsCount);


  container.appendChild(searchdiv);
  container.appendChild(subcontainer);
  container.appendChild(hidediv);



  hideButton.addEventListener('click',function(){
    hideLeftBar(hideButton);
  });



  rssSource.feeds.forEach(function (item) {

    var imgmiddle = new Image();
    imgmiddle.src = rssSource.icon;
    imgmiddle.classList.add('imagemiddle');

    var newdate = item.pubDate.slice(0, 17);


    var sourceName = document.createElement('div');
    // var link = document.createElement('div');
    var imgfeed = document.createElement('div');
    imgfeed.appendChild(imgmiddle);
    var date = document.createElement('div');
    var context = document.createElement('div');
    var feedContainer = document.createElement('div');
    feedContainer.style.color = 'black';
    feedContainer.classList.add('feed-container');

    var feedHeader = document.createElement('div');
    feedHeader.classList.add('feed-header');

    feedHeader.appendChild(imgfeed);
    imgfeed.classList.add('imgfeed-middle');
    feedHeader.appendChild(sourceName);
    sourceName.classList.add('sourceName-middle');
    feedHeader.appendChild(date);
    date.classList.add('date-middle');
    feedContainer.appendChild(feedHeader);

    feedContainer.appendChild(context);
    context.classList.add('context-middle');

    sourceName.textContent = rssSource.name;
    context.textContent = item.title;
    date.textContent = newdate;
    // link.textContent = item.link;

    subcontainer.appendChild(feedContainer);


    searchinputBox.addEventListener('keyup',function(){
      searchMiddle(searchinputBox , subcontainer);
    });
    

    feedContainer.addEventListener("click", function () {

      rightSideNews(item , rssSource);
      

       var nods = subcontainer.children;

       console.log(subcontainer);
       console.log("nods");
       console.log(nods);

       var j;
       for (j = 0; j < nods.length; j++) {
         nods[j].style.backgroundColor = "#ffffff";
       }

      feedContainer.style.background = '#ebe6e6';
    });

  })
}


function rightSideNews(item,rssSource) {

  var rightside = document.getElementById('rightside');

  rightside.innerHTML ='';

  // console.log(item.link);

  var linkdetails = item.link
 
  var newsHeader = document.createElement('div');
  var newsDetails = document.createElement('div');
  
  newsHeader.classList.add("news-header");
  newsDetails.classList.add("news-details");


  var imageRight = new Image();
  imageRight.src = rssSource.icon;
  imageRight.classList.add('image-right');


  var sourceLabel = document.createElement('div');
  sourceLabel.textContent=`${rssSource.name}`;
  sourceLabel.classList.add('right-source-label');
  sourceLabel.appendChild(imageRight);
  newsHeader.appendChild(sourceLabel);
  var viewOriginal = document.createElement('div');
  viewOriginal.title='View Original Page';
  viewOriginal.innerHTML = '<i class="fas fa-globe"></i>';
  viewOriginal.classList.add('view-original');
  newsHeader.appendChild(viewOriginal);
  var markasUnread = document.createElement('div');
  markasUnread.title='Mark as Undread';
  markasUnread.innerHTML = '<i class="far fa-circle"></i>';
  markasUnread.classList.add('markas-unread');
  newsHeader.appendChild(markasUnread);
  var markasFavourite = document.createElement('div');
  markasFavourite.title='Mark as Favourite';
  markasFavourite.innerHTML = '<i class="far fa-star"></i>';
  markasFavourite.classList.add('markas-favourite');
  newsHeader.appendChild(markasFavourite);
  var saveArticle = document.createElement('div');
  saveArticle.title='Save Article';
  saveArticle.innerHTML = '<i class="fas fa-bookmark"></i>';
  saveArticle.classList.add('save-article');
  newsHeader.appendChild(saveArticle);

  rightside.appendChild(newsHeader);
  rightside.appendChild(newsDetails);


  newsDetails.innerHTML = `<h2>${item.title}</h2>${item.content}`;


  // var jqNewsDetails = $(".news-details");

  viewOriginal.addEventListener('click',function(){
    showOriginal(item , newsDetails , rightside);
  })




}

function hideLeftBar(hideButton) {

    $('#leftside').hide();
    $('#rightside').removeClass('col-6');
    $('#rightside').addClass('col-8');

  console.log("deneme");
  hideButton.textContent = ">";

  hideButton.addEventListener('click',function(){
    showLeftBar(hideButton );
  })
}


function showLeftBar(hideButton ){

  $('#leftside').show();
  $('#rightside').removeClass('col-8');
  $('#rightside').addClass('col-6');
  hideButton.textContent = "<";

  hideButton.addEventListener('click',function(){
    hideLeftBar(hideButton);
  })

}


function searchMiddle(searchinputBox , subcontainer) {
  // Declare variables
  var  filter, i, txtValue;
  filter = searchinputBox.value.toUpperCase();
  fdContainer = subcontainer.getElementsByClassName('feed-container');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < fdContainer.length; i++) {
    var div = fdContainer[i].getElementsByClassName("context-middle")[0];
    txtValue = div.textContent || div.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      fdContainer[i].style.display = "";
    } else {
      fdContainer[i].style.display = "none";
    }
  }
}



function showOriginal(item , newsDetails ){

  window.event.preventDefault();

  // newsDetails.innerHTML ='';

  // var detailsWebView = document.createElement('webview');
  // detailsWebView.src=`${item.link}`;
  // detailsWebView.classList.add('foo');
  // var indicatorWv = document.createElement('div');
  // indicatorWv.classList.add('indicator');
  // detailsWebView.appendChild(indicatorWv);
  // newsDetails.appendChild(detailsWebView);


  //   // Event handlers for loading events.
  //     // Use these to handle loading screens, transitions, etc
  // onload = () => {
  // const webview = document.getElementsByClassName('foo')
  // const indicator = document.querySelector('.indicator')
  // const loadstart = () => {
  // indicator.innerText = 'loading...'
  // }
  // const loadstop = () => {
  // indicator.innerText = ''
  // }

  // webview.addEventListener('did-start-loading', loadstart)
  // webview.addEventListener('did-stop-loading', loadstop)
    
  // console.log('gelecek');
  // }


  // console.log('geliyor');
  // $(".external-iframe").load(`${item.link}`, function (statusTxt, jqXHR) {
  //   if (statusTxt == "success") {
  //      alert("New content loaded succssfully!");
  //      window.event.preventDefault();
  //    }
  //    if (statusTxt == "error") {
  //      alert("Error: " + jqXHR.status + " " + jqXHR.statusText);
  //    }
  //  });


  

  // $("#rightside").load(linkdetails);

  fetch(`${item.link}` /*, options */)
  .then((response) => response.text())
  .then((html) => {
      newsDetails.innerHTML = html;
  })
  .catch((error) => {
      console.warn(error);
  });
 }



module.exports = validateForm;
