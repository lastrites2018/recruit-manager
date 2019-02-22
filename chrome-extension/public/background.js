/*global chrome*/
const tabInfo = { url: null, html: null, candidate: {} };

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.action) {
    case "popupOpen": {
      init();
      console.log(tabInfo);
      break;
    }
    default: {
      console.log("no popup");
    }
  }
});

async function init() {
  await getURL();
  await getHTML();
}

function getURL() {
  return chrome.tabs.query({ currentWindow: true, active: true }, function(
    tabs
  ) {
    tabInfo.url = tabs[0].url;
  });
}
function getHTML() {
  return chrome.tabs.executeScript(
    null,
    { code: "var html = document.documentElement.outerHTML; html" },
    function(html) {
      tabInfo.html = html;
      parse();
    }
  );
}

function parse() {
  if (tabInfo.url && tabInfo.url.includes("saramin")) {
    runQuery("saramin");
  } else if (tabInfo.url && tabInfo.url.includes("jobkorea")) {
    runQuery("jobkorea");
  }
}

function runQuery(website) {
  const query = {
    saramin:
      "var mail = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > ul > li.mail > span').innerHTML; var cell = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > ul > li.phone > span > a').innerHTML; var candidate = { mail: mail, cell: cell }; candidate",
    jobkorea:
      "var mail = document.querySelector('body > div.resume-view-page > div.resume-view-wrapper > div > div.base.profile > div.container > div > div.info-detail > div:nth-child(1) > div.value').innerHTML; var cell = document.querySelector('body > div.resume-view-page > div.resume-view-wrapper > div > div.base.profile > div.container > div > div.info-detail > div:nth-child(1) > div.value').innerHTML; var candidate = { mail: mail, cell: cell }; candidate"
  };

  for (let props in query) {
    if (props === website) {
      const code = query[props];
      return chrome.tabs.executeScript(
        null,
        {
          code: code
        },
        function(candidate) {
          tabInfo.candidate = candidate;
          sendRequest();
        }
      );
    } else {
      console.log("wrong website!");
    }
  }
}

function sendRequest() {
  const api = "http://128.199.203.161:8500/extension/parsing";
  const input = { user_id: "rmrm", url: tabInfo.url, html: tabInfo.html[0] };
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
  };
  fetch(api, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(input)
  })
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
    .catch(error => console.log(error));
}
