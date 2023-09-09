
setTimeout(() => {
  chrome.runtime.sendMessage({ action: "getContentTabId" });
}, 1000);

let videoRecordingEnabled = false;
let intervalId;
const previewPageUrl = chrome.runtime.getURL("preview.html");

//attendance tracker variables

let studentDetails = new Map();
let studentsNameSet = new Set();
let ui_buttons;
let totalClassDuration = 1;
let goingToStop = 0;
let isAttendanceWorking = false;
let buttonClickInd = 0;
let startTime;
let flag = false; // make if false to block non-meraki classes
let meetingDuration;
var record;

// let newWindow1 = window.open(redirectUrl);

let meetingCode = window.location.pathname.substring(1);
let date = new Date();
let startMeetTime = new Date(date).toLocaleTimeString();
let dd = date.getDate();
let mm = date.toLocaleString("default", { month: "short" });
let yyyy = date.getFullYear();
date = dd + "-" + mm + "-" + yyyy;
let sortedtstudentsNameSet = [];
let studentsAttendedDuration = [];
let studentsJoiningTime = [];
let lastSeenAt = [];
let mapKeys = studentDetails.keys();

const redDot = document.createElement("span");
redDot.style.height = "15px";
redDot.style.width = "15px";
redDot.style.backgroundColor = "#f44336";
redDot.style.borderRadius = "50%";

const recSessionTxt = document.createElement("span");
recSessionTxt.innerHTML = "Record Session";
recSessionTxt.style.fontSize = "18px";

let recButtonsContainer = document.createElement("div");
recButtonsContainer.style.display = "flex";
recButtonsContainer.style.justifyContent = "space-around";
recButtonsContainer.style.alignItems = "center";
recButtonsContainer.style.textAlign = "center";
recButtonsContainer.style.gap = "2px";
recButtonsContainer.id = "recButtonsContainer";
recButtonsContainer.style.border = "none";
recButtonsContainer.style.backgroundColor = "#6d6d6d";
recButtonsContainer.style.color = "white";
recButtonsContainer.style.height = "1.8rem";
recButtonsContainer.style.width = "10rem";
recButtonsContainer.style.padding = "0.5rem";
recButtonsContainer.style.borderRadius = "5px";
recButtonsContainer.style.cursor = "pointer";
recButtonsContainer.appendChild(redDot);
recButtonsContainer.appendChild(recSessionTxt);
recButtonsContainer.style.marginLeft = "30px";


// create the stop button
let stopBtn = document.createElement("button");
stopBtn.id = "stopBtn";
stopBtn.innerHTML = "&#9632;";
stopBtn.style.border = "none";
stopBtn.style.backgroundColor = "white";
stopBtn.style.color = "white";
stopBtn.style.height = "1.5rem";
stopBtn.style.width = "1.8rem";
stopBtn.style.borderRadius = "50%";
stopBtn.style.cursor = "pointer";
stopBtn.style.color = "#6d6d6d";

// Adding meeting time button to meet ui
let meetTimeBtn = document.createElement("button");
meetTimeBtn.id = "meetTimeBtn";
meetTimeBtn.className = "Jyj1Td CkXZgc";
meetTimeBtn.type = "button";
meetTimeBtn.style.border = "none";
meetTimeBtn.style.color = "white";
meetTimeBtn.style.backgroundColor = "#6d6d6d";
meetTimeBtn.style.fontSize = "16px";

// "duration" variable - to calculate duration of video recording:-
let duration = 0;

recButtonsContainer.addEventListener("click", () => {
  console.log("clicked", videoRecordingEnabled);
  if (videoRecordingEnabled == false) {
    StartVideoRecording();
  }
});

stopBtn.addEventListener("click", (event) => {
  let endButton = document.querySelector(".Gt6sbf");
  // endButton.click();
  setTimeout(() => {
    // location.reload();
  }, 2000);
  event.stopPropagation();
  if (videoRecordingEnabled == true) {
    stopVideoRecording();
    recButtonsContainer.innerHTML = "";
    recButtonsContainer.appendChild(redDot);
    recButtonsContainer.appendChild(recSessionTxt);
  }
});

let openPreview

function openPreviewPage() {
  window.open("chrome-extension://khephbgeikkgcjalekljfgoahnopnfbl/preview.html")
  window.clearInterval(openPreview)
}

function insertRecButton() {
  try {
    if (document.getElementsByClassName("VfPpkd-kBDsod NtU4hc").length > 0) {
      ui_buttons = document.getElementsByClassName("VfPpkd-kBDsod NtU4hc");
      document
        .getElementsByClassName("lefKC")[0]
        .appendChild(recButtonsContainer);
    }
  } catch (error) {
  }
}

let muteVideoRecording = false;

let insertingmute = setInterval(() => {
  try {
    if (
      document.getElementsByClassName(
        "U26fgb JRY2Pb mUbCce kpROve yBiuPb y1zVCf HNeRed M9Bg4d"
      )[0] !== null
    ) {
      let mutee = document.getElementsByClassName(
        "U26fgb JRY2Pb mUbCce kpROve yBiuPb y1zVCf HNeRed M9Bg4d"
      )[0];

      mutee.addEventListener("click", () => {
        muteVideoRecording = !muteVideoRecording;
      });

      window.clearInterval(insertingmute);
    }
  } catch (err) { }
}, 500);

let insideMuteInterval = setInterval(() => {
  try {
    if (
      document.getElementsByClassName(
        "VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c uaILN JxICCe Uulb3c"
      )[0] !== null
    ) {
      let insideMute = document.getElementsByClassName(
        "VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c uaILN JxICCe Uulb3c"
      )[0];

      insideMute.addEventListener("click", () => {
        muteVideoRecording = !muteVideoRecording;
        if (muteVideoRecording === true) {
          handleMute();
        } else {
          handleUnMute();
        }
      });
      window.clearInterval(insideMuteInterval);
    }
  } catch (err) {
  }
}, 500);

let insertBtnInterval = setInterval(() => {
  insertRecButton();
}, 1000);

function insertButton() {
  try {
    ui_buttons = document.getElementsByClassName("VfPpkd-kBDsod NtU4hc");
    if (!isAttendanceWorking) {
      isAttendanceWorking = true;
      StartTime = new Date().toLocaleTimeString();
      studentDetails.clear();
      studentsNameSet.clear();
      totalClassDuration = 0;
      start();
    }

    document
      .getElementsByClassName("Gt6sbf QQrMi")
      .addEventListener("click", function () {
        if (isAttendanceWorking) {
          stop();
        }
      });
    clearInterval(tryInsertingButton);
  } catch (error) { }
}

setInterval(insertButton, 1000);

// async function start() {
//   startTime = new Date();
//   startAttendanceTracker = setInterval(attendanceTracker, 1000);
// }

// to get the meeting name/title
const getMeetingName = () => {
  const elm = document.querySelector("[data-meeting-title]");
  if (elm && elm.dataset.meetingTitle) {
    return elm.dataset.meetingTitle;
  } else {
    return document.title;
  }
};

function toTimeFormat(time) {
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_MINUTE = 60;

  let hours = Math.floor(time / SECONDS_IN_HOUR);
  let minutes = Math.floor((time % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  let seconds = time % SECONDS_IN_MINUTE;

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  return hours === "00"
    ? `${minutes}:${seconds}`
    : `${hours}:${minutes}:${seconds}`;
}

//Recorder functions

let recorderWorking = true;

//mute and unmute functions

function handleMute() {
  if (videoRecordingEnabled === true) {
    chrome.runtime.sendMessage({ action: "muteAudio", message: true });
  } else {
  }
}
function handleUnMute() {
  if (videoRecordingEnabled === true) {
    chrome.runtime.sendMessage({ action: "unmuteAudio", message: false });
  }
}


let openPreviewPageInterval;


function StartVideoRecording() {
  chrome.runtime.sendMessage({
    message: "closePreview",
    closeURL: previewPageUrl,
  });

  if (videoRecordingEnabled === false) {
    chrome.runtime.sendMessage({
      action: "openPopUp",
      message: "firstOpenPopUp",
    });
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "Mute-audio",
        message: muteVideoRecording,
      });
    }, 500);

  }
}

async function stopVideoRecording() {
  window.onbeforeunload = null;
  // stop timer for video duration calculation:-
  clearInterval(intervalId);
  duration = 0;
  meetTimeBtn.innerText = "00:00:00";
  videoRecordingEnabled = false;
  stop();

  chrome.runtime.sendMessage({ action: "stopRecording", method:"manually" });


  let data = {
    attendies_data: JSON.stringify(record),
  };
  if (flag === true) {
  }
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startRecordingTimer") {
    duration = 0;
    if (openPreviewPageInterval == undefined) {
      openPreviewPageInterval = setInterval(() => {
        let endButton = document.querySelector(".Gt6sbf");
        console.log(endButton, videoRecordingEnabled, "endbutton")
        
        if (endButton == null) {
          
          window.clearInterval(openPreviewPageInterval)
          console.log("endbutton is null", openPreviewPageInterval)
          if (videoRecordingEnabled == true) {
            chrome.runtime.sendMessage({ action: "stopRecording", method:"automatically" });
          chrome.runtime.sendMessage({ action: "createTabAfterDelay", url: previewUrl });
          }else{
            chrome.runtime.sendMessage({ action: "createTab", url: previewUrl });
          }
        }
      }, 1000)
    }
    videoRecordingEnabled = true;
    clearInterval(intervalId);
    meetTimeBtn.innerText = "00:00:00";
    recButtonsContainer.innerHTML = "";
    recButtonsContainer.appendChild(redDot);
    recButtonsContainer.appendChild(meetTimeBtn);
    recButtonsContainer.appendChild(stopBtn);
    intervalId = setInterval(() => {
      const hours = Math.floor(duration / 3600000)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((duration % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = ((duration % 60000) / 1000).toFixed(0).padStart(2, "0");
      meetTimeBtn.innerText = `${hours}:${minutes}:${seconds}`;
      duration += 1000;
    }, 1000);
  }
  if (message.message === "PopupClosed") {
    recButtonsContainer.innerHTML = "";
    recButtonsContainer.appendChild(redDot);
    recButtonsContainer.appendChild(recSessionTxt);
    videoRecordingEnabled = false;
  }
  if (message.message === "closePreviewFirst") {
    alert("Please close the preview page first to record this meeting");
  }
});

window.onbeforeunload = null;
