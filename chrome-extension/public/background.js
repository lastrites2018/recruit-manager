/*global chrome*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  switch (message.action) {
    case "popupOpen": {
      chrome.tabs.executeScript(
        null,
        { code: "var html = document.documentElement.outerHTML; html" },
        function(result) {
          console.log(result);
        }
      );
      chrome.tabs.executeScript(
        null,
        {
          code:
            "var name = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > p > em').innerHTML; var age = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > p > span > span:nth-child(1)').innerHTML; var education = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.dashboard > ul > li:nth-child(1) > p').innerHTML; var career = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.dashboard > ul > li:nth-child(2) > p').innerHTML.trim().replace(/ +/g, ''); var salary = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.dashboard > ul > li:nth-child(3) > p').innerHTML.trim(); var mail = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > ul > li.mail > span').innerHTML; var cell = document.querySelector('#resume_print_area > div > div.section_profile > div.personal_info.case1 > div.my_data > ul > li.phone > span > a').innerHTML; var candidate = { name: name, age: age, career: career, salary: salary, mail: mail, cell: cell }; candidate"
        },
        function(candidate) {
          console.log("candidate", candidate);
        }
      );
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
        tabs
      ) {
        var currentTab = tabs[0].url;
        console.log(currentTab);
      });
      break;
    }
    default: {
      console.log("default");
    }
  }
});
