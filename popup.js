var port = chrome.runtime.connect();
let startRecordMeetingInterval = setInterval(() => {
  try {
    if (startRec !== null) {
      startRec.addEventListener("click", shareScreen);
      window.clearInterval(startRecordMeetingInterval);
    }
  } catch (er) {
    console.log(er);
  }
}, 100);

let startRec = document.querySelector("#start-recording");
let stopRec = document.querySelector("#stop-recording");

let isMuted;
let stream = null;
let audio = null;
let mixedStream = null;
chunks = [];
let recorder = null;
let isRecordingVideo = false;
const previewUrl = chrome.runtime.getURL("preview.html");

const dbName = "recordingsDatabase";
const dbVersion = 1;
let db;
let mediaRecorder;
let recordedChunks = [];
const openRequest = indexedDB.open(dbName, dbVersion);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "stopRecording") {
    stopRecording();
  }

  if (request.action === "start-Recording") {
    shareScreen();
  }
  if (request.action === "muteAudio") {
    muteAudio();
    isMuted = request.message;
  }
  if (request.action === "Mute-audio") {
    isMuted = request.message;
  }
  if (request.action === "unmuteAudio") {
    unmuteAudio();
    isMuted = request.message;
  }
});

function muteAudio() {
  if (isRecordingVideo === true) {
    localStream.getAudioTracks().forEach(function (track) {
      track.enabled = !track.enabled;
    });
  } else {
  }
}
function unmuteAudio() {
  if (isRecordingVideo === true) {
    localStream.getAudioTracks().forEach(function (track) {
      track.enabled = true;
    });
  } else {
  }
}

openRequest.onsuccess = async function (event) {
  db = event.target.result;
}

openRequest.onupgradeneeded = function (event) {
  db = event.target.result;

  if (!db.objectStoreNames.contains("recordings")) {
    const recordingStore = db.createObjectStore("recordings", {
      keyPath: "id",
      autoIncrement: true,
    });
    // recordingStore.createIndex("name", "name", { unique: false });
    // recordingStore.createIndex("time", "time", { unique: false });
  }
};


function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

function shareScreen() {
  chrome.runtime.sendMessage({
    message: "closePreview",
    closeURL: previewUrl,
  });

  isRecordingVideo = true;
  var screenConstraints = { video: true, audio: true };
  navigator.mediaDevices
    .getDisplayMedia(screenConstraints)
    .then(function (screenStream) {
      /* use the screen & audio stream */

      var micConstraints = { audio: true };
      navigator.mediaDevices
        .getUserMedia(micConstraints)
        .then(function (micStream) {
          var composedStream = new MediaStream();

          screenStream.getVideoTracks().forEach(function (videoTrack) {
            composedStream.addTrack(videoTrack);
          });

          var context = new AudioContext();

          var audioDestinationNode = context.createMediaStreamDestination();

          //check to see if we have a screen stream and only then add it
          if (screenStream && screenStream.getAudioTracks().length > 0) {
            const systemSource = context.createMediaStreamSource(screenStream);

            const systemGain = context.createGain();
            systemGain.gain.value = 1.0;

            systemSource.connect(systemGain).connect(audioDestinationNode);
          }

          if (micStream && micStream.getAudioTracks().length > 0) {
            const micSource = context.createMediaStreamSource(micStream);

            //set it's volume
            const micGain = context.createGain();
            micGain.gain.value = 1.0;

            //add it to the destination
            micSource.connect(micGain).connect(audioDestinationNode);
          }

          audioDestinationNode.stream
            .getAudioTracks()
            .forEach(function (audioTrack) {
              composedStream.addTrack(audioTrack);
            });
          onCombinedStreamAvailable(composedStream);
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}



function onCombinedStreamAvailable(stream) {
  localStream = stream;
  if (localStream != null) {
    recorder = new MediaRecorder(localStream);
    if (isMuted === true) {
      localStream.getAudioTracks().forEach(function (track) {
        track.enabled = !track.enabled;
      });
    } else {
      localStream.getAudioTracks().forEach(function (track) {
        track.enabled = true;
      });
    }
    recorder.ondataavailable = handleDataAvailable;

    recorder.start(1000);
    window.onbeforeunload = (event) => {
      const confirmationMessage =
        "Closing this tab will cause you to lose your meeting recording. Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = confirmationMessage;
    };
    chrome.runtime.sendMessage({
      action: "startingRecording",
      message: "recording-started",
    });

    chrome.windows.getCurrent(function (currentWindow) {
      chrome.windows.update(currentWindow.id, {
        focused: false,
        state: "minimized",
      });
    });
  } else {
    console.log("localStream is missing");
  }
}

async function stopRecording() {
  const transaction = db.transaction("recordings", "readwrite");
  const recordingStore = transaction.objectStore("recordings");
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  recordedChunks = [];
  let date = new Date();
  const timestamp = new Date(date).toLocaleTimeString() // Get current timestamp

  const recording = {
    name: "Recording " + timestamp,
    data: blob
  };

  const addRequest = recordingStore.add({ recording });
  addRequest.onsuccess = function () {
    console.log("Recording added to the database");
    chrome.windows.getCurrent({ populate: true }, function (currentWindow) {
      const currentTab = currentWindow.tabs.find(tab => tab.active);
      if (currentTab) {
        const currentTabId = currentTab.id;
        console.log('Current tab ID:', currentTabId);
        
       chrome.runtime.sendMessage({ action: "closePopupWindow", tabId: currentTabId });
      } else {
        console.error('Unable to get the current tab information.');
      }
    });
  };

  addRequest.onerror = function () {
    console.error("Error adding recording to the database");
  };
  try {
    if (recorder.state !== "inactive") {
      recorder.stop();
    }
    isRecordingVideo = false;
    stop();

    window.onbeforeunload = null;

    // chrome.runtime.sendMessage({ action: "createTab", url: previewUrl });
  } catch (error) {
    console.log(error);
  }
}
openRequest.onerror = function (event) {
  console.error("Error opening database", event.target.error);
};