import "./styles.css";
import axios from "axios";
import $ from "jquery";

window.onload = function () {
  var script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
  googleTranslateElementInit();
  document.querySelector("#loading").style.visibility = "hidden";
  $("#body").fadeIn(500);
};

var url_string = window.location.href;
var url = new URL(url_string);
var ID = url.searchParams.get("id"); // || 2;
console.log(url_string, ID);

$("#shareBtn").click(function () {
  $("div.alert-div").fadeIn(300).delay(2000).fadeOut(400);
});

document.querySelector("#shareBtn").addEventListener("click", function () {
  copyToClipboard(url_string || "OK");
});

if (ID !== null) {
  //mostra pagina!!
  getRequest();
} else {
  //form per pagina
  createFormPage();
  makeRequest();
}

//form pagina
function createFormPage() {
  var div = document.querySelector("#center");
  var sites = [
    "Title",
    "Cover Image",
    "Spotify",
    "Deezer",
    "Itunes",
    "Youtube",
    "Amazon",
    "Instagram",
    "Facebook"
  ];

  var types = ["track", "artist"];
  var form = document.createElement("form");
  form.setAttribute("id", "foo");
  for (const e of sites) {
    var siteDiv = document.createElement("div");
    var label = document.createElement("label");
    label.textContent = e + " ";
    form.appendChild(label);
    var input = document.createElement("input");
    input.setAttribute("id", e);
    input.setAttribute("name", e);
    input.setAttribute("type", "text");
    input.setAttribute("value", " ");
    input.required = true;
    form.appendChild(input);
    form.innerHTML += "<br>";
    //form.appendChild(siteDiv);
    //div.appendChild(form);
  }
  for (const x of types) {
    var label = document.createElement("label");
    label.innerHTML = x;
    form.appendChild(label);
    var inpt = document.createElement("input");
    inpt.setAttribute("id", x);
    inpt.setAttribute("name", "Type");
    inpt.setAttribute("type", "radio");
    inpt.setAttribute("value", x);
    if (x === "track") inpt.setAttribute("checked", true);
    form.appendChild(inpt);
    form.innerHTML += "<br>";
  }
  var button = document.createElement("input");
  button.setAttribute("type", "submit");
  button.setAttribute("value", "Conferma");
  form.appendChild(button);
  var urlSpan = document.createElement("span");
  urlSpan.id = "urlResult";
  div.appendChild(form);
  div.appendChild(urlSpan);
}

//Nav
document.getElementById("openNav").addEventListener("click", function () {
  openNav();
});
document.getElementById("closeNav").addEventListener("click", function () {
  closeNav();
});

function openNav() {
  document.getElementById("mySidenav").style.width = "270px";
  document.getElementById("main").style.marginLeft = "270px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function getLastRow() {
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/1mkxYj3x0XSdDxj2vEcoxON1GUQ4rthODi4_02yYtTYE/?key=AIzaSyDL6Ave9_iZ8U3xAnaujHUoo_qMeEFKkn4&includeGridData=true";
  axios
    .get(url)
    .then(function (response) {
      //console.log(response);
      var result = response.data.sheets[0].data[0].rowData.length - 1;
      console.log(result);
      createUrl(result);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getRequest() {
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/1mkxYj3x0XSdDxj2vEcoxON1GUQ4rthODi4_02yYtTYE/?key=AIzaSyDL6Ave9_iZ8U3xAnaujHUoo_qMeEFKkn4&includeGridData=true";
  axios
    .get(url)
    .then(function (response) {
      //console.log(response);
      var result = response.data.sheets[0].data[0].rowData;
      getData(result);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//Insert data
function makeRequest() {
  var request;

  // Bind to the submit event of our form
  $("#foo").submit(function (event) {
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // Abort any pending request
    if (request) {
      request.abort();
    }
    // setup some local variables
    var $form = $(this);

    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");

    // Serialize the data in the form
    var serializedData = $form.serialize();

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request to /form.php
    request = $.ajax({
      url:
        "https://script.google.com/macros/s/AKfycbzSZUTbA77Z8FRloT-S_LBmzm2XxUmpqVOA86U4J6xVIVpHgWW8gjuvUqcpJvSdi3sp/exec",
      type: "post",
      data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR) {
      // Log a message to the console
      console.log("Record inserito correttamente!");
      getLastRow();
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      // Log the error to the console
      console.error("The following error occurred: " + textStatus, errorThrown);
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
      // Reenable the inputs
      $inputs.prop("disabled", false);
    });
  });
}

function getData(data) {
  console.log(data);
  var row = data[ID].values;
  var array = [];
  for (const x of row) {
    array.push(x.effectiveValue.stringValue);
  }
  createPage(array);
}

function createPage(data) {
  if (data[0] !== " ") {
    document.title = data[0];
  }
  if (data[1] !== " ") {
    const favicon = document.getElementById("favicon");
    favicon.setAttribute("href", data[1]);
  }
  var type = data[data.length - 1];
  data.pop();
  var platforms = [
    {
      id: "Spotify",
      src:
        "https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png",
      width: "48px"
    },
    {
      id: "Deezer",
      src:
        "https://dwglogo.com/wp-content/uploads/2016/06/5-color-logo-of-deezer.png",
      width: "64px"
    },
    {
      id: "Itunes",
      src:
        "https://logos-download.com/wp-content/uploads/2016/06/iTunes_logo_icon.png",
      width: "48px"
    },
    {
      id: "Youtube",
      src:
        "https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png",
      width: "64px"
    },
    {
      id: "Amazon",
      src:
        "https://www.freepnglogos.com/uploads/amazon-png-logo-vector/amazon-icon-symbol-png-logo-21.png",
      width: "48px"
    } /*,
    {
      id: "Instagram",
      src: "https://www.freepnglogos.com/uploads/new-instagram-logo-png-1.png",
      width: "40px"
    },
    {
      id: "Facebook",
      src: "https://www.freepnglogos.com/uploads/facebook-logo-13.png",
      width: "48px"
    }*/
  ];
  console.log("OK");
  var div = document.createElement("div");
  div.setAttribute("id", "images");
  var title = document.createElement("h2");
  title.innerHTML = data[0];
  document.querySelector("#center").appendChild(title);
  var cover = document.createElement("img");
  cover.id = "coverImage";
  cover.src = data[1];
  document.querySelector("#center").appendChild(cover);
  document.querySelector("#center").appendChild(div);

  var social_ar = [data[data.length - 2], data[data.length - 1]];
  data.pop();
  data.pop();
  var social_div = document.createElement("div");
  social_div.id = "footerSocial";
  social_div.appendChild(createSocialDiv(social_ar));
  document.querySelector("#center").appendChild(social_div);

  if (type === "track") {
    console.log(data);
    trackPage(data, platforms);
  } else if (type === "artist") {
    console.log(data);
    artistPage(data, platforms);
  }
}

function createPlatformsLink(data, platforms) {
  data.shift();
  data.shift();
  for (const x of data) {
    if (isValidURL(x)) {
      createFigure(platforms[data.indexOf(x)]);
      document
        .getElementById(platforms[data.indexOf(x)].id)
        .addEventListener("click", function () {
          var a = document.createElement("a");
          a.href = x;
          a.click();
        });
    }
  }
}

function trackPage(data, platforms) {
  createPlatformsLink(data, platforms);
  if (isValidURL(data[0])) {
    var type = "track";
    var content_id = data[0].split(type + "/");
    createListenButton(content_id[content_id.length - 1], type);
  }
}

function artistPage(data, platforms) {
  createPlatformsLink(data, platforms);
  console.log(data[0]);
  if (isValidURL(data[0])) {
    var type = "artist";
    var content_id = data[0].split(type + "/");
    createFollowButton(content_id[content_id.length - 1]);
  }
}

function createFigure(Figure) {
  var figure = document.createElement("figure");
  figure.setAttribute("id", Figure.id);
  var img = document.createElement("img");
  img.setAttribute("src", Figure.src);
  img.setAttribute("alt", Figure.id);
  img.setAttribute("width", Figure.width);
  figure.appendChild(img);
  var caption = document.createElement("figcaption");
  caption.textContent = Figure.id;
  figure.appendChild(caption);
  var div = document.querySelector("#images");
  div.appendChild(figure);
}

function createListenButton(id, type) {
  var div = document.getElementById("images");
  var foot = document.createElement("div");
  foot.setAttribute("class", "listen");
  var iframe = document.createElement("iframe");
  iframe.setAttribute(
    "src",
    "https://open.spotify.com/embed/" + type + "/" + id
  );
  iframe.setAttribute("width", "250");
  iframe.setAttribute("height", "80");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("allow", "encrypted-media");
  foot.appendChild(iframe);
  div.appendChild(foot);
}

function createSocialDiv(social_ar) {
  var social_div = document.createElement("div");
  if (isValidURL(social_ar[0])) {
    var aInsta = document.createElement("a");
    aInsta.setAttribute("class", "btn btn-social-icon btn-instagram");
    aInsta.href = social_ar[0];
    aInsta.setAttribute("style", "background-color: transparent;");
    social_div.appendChild(aInsta);
    var spanInsta = document.createElement("span");
    spanInsta.setAttribute("class", "fa fa-instagram");
    spanInsta.id = "insta";
    aInsta.appendChild(spanInsta);
  }
  if (isValidURL(social_ar[1])) {
    var aFace = document.createElement("a");
    aFace.setAttribute("class", "btn btn-social-icon btn-facebook");
    aFace.href = social_ar[1];
    social_div.appendChild(aFace);
    var spanFace = document.createElement("span");
    spanFace.setAttribute("class", "fa fa-facebook");
    aFace.appendChild(spanFace);
  }
  social_div.id = "social";
  return social_div;
}

function isValidURL(str) {
  var a = document.createElement("a");
  a.href = str;
  return a.host && a.host !== window.location.host;
}

function createFollowButton(uri) {
  var div = document.getElementById("main");
  var foot = document.createElement("div");
  //foot.setAttribute("style", "display: inline-block;");
  foot.setAttribute("class", "follow");
  var iframe = document.createElement("iframe");
  iframe.setAttribute(
    "src",
    "https://open.spotify.com/follow/1/?uri=spotify:artist:" +
      uri +
      "&size=detail&theme=dark&show-count=0"
  );
  iframe.setAttribute("width", "200");
  iframe.setAttribute("height", "56");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("style", "border: none; overflow: hidden;");
  iframe.setAttribute("allowtransparency", "true");
  foot.appendChild(iframe);
  foot.style.minHeight = div.clientHeight;
  console.log(div.clientHeight, foot.style.minHeight);
  div.appendChild(foot);
}

function copyToClipboard(string) {
  navigator.clipboard.writeText(string);
}

function createUrl(id) {
  var url = window.location.href + "?id=" + id;
  document.getElementById("urlResult").innerHTML = url;
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "it" },
    "google_translate_element"
  );
}
