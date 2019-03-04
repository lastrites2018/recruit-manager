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
  port.onMessage.addListener(async function(msg) {
    console.log('Received: ' + msg);
    if (msg === 'Requesting user email address') {
      chrome.storage.local.get(['user'], async function(result) {
        if (result && result.user) {
          await port.postMessage(result);
        } else {
          await getUser();
          await sleep(1000);
          chrome.storage.local.get(['user'], async function(result) {
            await port.postMessage(result);
          });
        }
      });
    }
  });
});

async function init() {
  await getUser();
  await getURL();
  await getHTML();
  console.log(tabInfo);
  // await printStorage();
  await countResume();
}

function getUser() {
  chrome.storage.local.get(['user'], async function(result) {
    try {
      if (result && result.user && result.user.check === true) {
        return result.user.user_email;
      } else {
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
  return chrome.tabs.query(
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
  return chrome.tabs.executeScript(
    null,
    { code: 'var html = document.documentElement.outerHTML; html' },
    function(html) {
      tabInfo.html = html;
      parse();
    }
  );
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
  const api = 'http://128.199.203.161:8500/extension/parsing';
  const input = { user_id: 'rmrm', url: tabInfo.url, html: tabInfo.html[0] };
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
    .then(responseJson => console.log(responseJson))
    .catch(error => console.log(error));
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
        chrome.storage.local.set({ user: responseJson.result }, function() {
          console.log(responseJson);
        });
      } else {
        console.log('Unauthorized user!');
      }
    })
    .catch(error => console.log(error));
}

function countResume() {
  // needs fix
  // shows 0 twice after logging out
  chrome.storage.local.get('user', function(result) {
    if (result.user && result.user.check === true) {
      chrome.storage.local.get('resumeCount', function(result) {
        chrome.storage.local.set({ resumeCount: result.resumeCount + 1 });
      });
    } else {
      console.log('Failed to increment resume count. Unauthorized user!');
    }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function printStorage() {
//   chrome.storage.local.get(null, function(items) {
//     for (let key in items) {
//       console.log(key, items[key]);
//     }
//   });
// }
