/*global chrome*/

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   switch (message.action) {
//     case 'popupOpen': {
//       console.log('popup is open...');
//       chrome.storage.local.get(['user'], function(response) {
//         if (!response.user) {
//           chrome.identity.getProfileUserInfo(function(result) {
//             validateEmail(result.email);
//             chrome.storage.local.set({
//               resumeCount: 0,
//               mailCount: 0,
//               smsCount: 0
//             });
//           });
//         }
//       });
//       break;
//     }
//     default: {
//       console.log('no popup');
//     }
//   }
// });

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(async function(msg) {
    console.log('Received: ' + msg);
    if (msg === 'Requesting crawling') {
      let user = '';
      chrome.storage.local.get(['user'], async function(response) {
        if (!response.user) {
          chrome.identity.getProfileUserInfo(async function(result) {
            await chrome.storage.local.set({
              resumeCount: 0,
              mailCount: 0,
              smsCount: 0
            });
            user = await validateEmail(result.email);
            console.log('user', user);
          });
        } else {
          user = response.user;
          console.log('user is already logged in.');
        }
        getURL(_getValue);
        getHTML(_getValue);
        getHistory();
        crawlCandidate();

        await chrome.storage.local.get(null, function(response) {
          sleep(5);
          port.postMessage({
            user: response.user,
            url: response.url,
            html: response.html,
            history: response.history,
            resumeCount: response.resumeCount,
            candidate: response.candidate
          });
        });
      });
    } else if (msg === 'Requesting reset')
      chrome.storage.local.set({
        resumeCount: 0,
        mailCount: 0,
        smsCount: 0
      });
  });
});

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

async function _getValue(param, value) {
  console.log({ [param]: value });
  await chrome.storage.local.set({ [param]: value });
}

const getURL = async callback => {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async ([currentTab]) => {
      await callback('url', currentTab.url);
    }
  );
};

const getHTML = async callback => {
  await chrome.tabs.executeScript(
    null,
    { code: 'var html = document.documentElement.outerHTML; html' },
    async function(html) {
      await callback('html', html[0]);
    }
  );
};

function getHistory() {
  chrome.storage.local.get(null, async function(response) {
    const api = 'http://128.199.203.161:8500/extension/view_history';
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Origin': '*'
    };
    const user = response.user;
    const url = response.url;
    const input = {
      user_id: user.user_id,
      user_name: user.user_name,
      url
    };
    console.log('history inputs: ', input);
    const data = await fetch(api, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(input)
    });
    const json = await data.json();
    chrome.storage.local.set({ history: json }, function() {
      console.log('history', json);
    });
  });
}

const crawlCandidate = async () => {
  chrome.storage.local.get(null, async function(response) {
    chrome.storage.local.set({ resumeCount: response.resumeCount + 1 });
    const api = 'http://128.199.203.161:8500/extension/parsing';
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Origin': '*'
    };
    const input = {
      user_id: response.user.user_id,
      user_name: response.user.user_name,
      url: response.url,
      html: response.html
    };
    console.log('crawl inputs: ', input);
    const data = await fetch(api, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(input)
    });
    const json = await data.json();
    chrome.storage.local.set({ candidate: json });
    console.log(json);
    return json;
  });
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
