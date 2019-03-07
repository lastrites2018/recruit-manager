/*global chrome*/
const tabInfo = { url: null, html: null, candidate: {} };

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.action) {
    case 'popupOpen': {
      init();
      break;
    }
    default: {
      console.log('no popup');
    }
  }
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log('Received: ' + msg);
    if (msg === 'Requesting user email address') {
      chrome.storage.local.get(['user'], function(result) {
        port.postMessage(result);
      });
    }
  });
});

async function init() {
  await getUser();
  await getURL();
  await getHTML();
  await printStorage();
}

function getUser() {
  chrome.storage.local.get(null, function(result) {
    try {
      if (result && result.user && result.user.check === true) {
        console.log('user is already logged in');
        chrome.storage.local.set({ resumeCount: result.resumeCount + 1 });
        return result.user.user_email;
      } else {
        console.log('user is not logged in. calling user check');
        return chrome.identity.getProfileUserInfo(function(userInfo) {
          validateEmail(userInfo.email);
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function getURL() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    ([currentTab]) => {
      tabInfo.url = currentTab.url;
    }
  );
}
function getHTML() {
  chrome.tabs.executeScript(
    null,
    { code: 'var html = document.documentElement.outerHTML; html' },
    function(html) {
      tabInfo.html = html;
    }
  );
  parse();
}

function parse() {
  if (tabInfo.url && tabInfo.url.includes('saramin')) {
    runQuery('saramin');
  } else if (tabInfo.url && tabInfo.url.includes('jobkorea')) {
    runQuery('jobkorea');
  } else if (tabInfo.url && tabInfo.url.includes('linkedin')) {
    sendRequest();
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
      console.log('wrong website!');
    }
  }
}

function sendRequest() {
  chrome.storage.local.get(['user'], function(result) {
    const user = result.user;
    const api = 'http://128.199.203.161:8500/extension/parsing';
    console.log("before sending request, let's check tabInfo", tabInfo);
    const input = {
      user_id: user.user_id,
      url: tabInfo.url,
      html: tabInfo.html[0]
    };
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Origin': '*'
    };
    fetch(api, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(input)
    })
      .then(response => response.json())
      // TODO: need to press twice to refresh candidate email / mobile
      .then(responseJson =>
        chrome.storage.local.set({ candidate: responseJson })
      )
      .catch(error => console.log(error));
  });
}

function validateEmail(email) {
  const api = 'http://128.199.203.161:8500/extension/login';
  const input = { email: email };
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Origin': '*'
  };
  fetch(api, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(input)
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.result.check === true) {
        chrome.storage.local.set({ user: responseJson.result });
      } else {
        console.log('Unauthorized user!');
      }
    })
    .catch(error => console.log(error));
}

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function printStorage() {
  // chrome.storage.local.get(null, function(items) {
  //   for (let key in items) {
  //     console.log(key, items[key]);
  //   }
  // });
  chrome.storage.local.get(['candidate'], function(response) {
    console.log(response.candidate);
  });
}
