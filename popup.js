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


// Function to initialize the array and store it in chrome.storage.local

  const initialChunksArray = [];
  
  // Save the initial array to chrome.storage.local
  chrome.storage.local.set({ chunks: initialChunksArray }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error initializing chunks array:', chrome.runtime.lastError);
    } else {
      console.log('Chunks array initialized:', initialChunksArray);
    }
  });



function pushToChunksArray(item) {
  // Retrieve the current array from chrome.storage.local
  chrome.storage.local.get('chunks', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving chunks array:', chrome.runtime.lastError);
    } else {
      const currentChunksArray = result.chunks || [];
      currentChunksArray.push(item);
      
      // Save the updated array back to chrome.storage.local
      chrome.storage.local.set({ chunks: currentChunksArray }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error updating chunks array:', chrome.runtime.lastError);
        } else {
          console.log('Item pushed to chunks array:', item);
        }
      });
    }
  });
}




function handleDataAvailable(e) {
  // console.log(chunks);
  if (e.data) {
    chunks.push(e.data);
    const blobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Strings = reader.result
            .toString()
            .replace(/^data:(.*,)?/, "");
          resolve(base64Strings);
        };
        reader.onerror = (error) => reject(error);
      });
    };

    blobToBase64(e.data)
      .then((base64Strings) => {
        pushToChunksArray(base64Strings);
      
      })
      .catch((error) => {
        console.error(error);
      });
  }
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
  // stop timer for video duration calculation:-
  try {
    if (recorder.state !== "inactive") {
      recorder.stop();
    }
    isRecordingVideo = false;
    stop();

    window.onbeforeunload = null;

    chrome.runtime.sendMessage({ action: "createTab", url: previewUrl });
  } catch (error) {
    console.log(error);
  }
}

