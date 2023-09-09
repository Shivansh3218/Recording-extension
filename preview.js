let loadingScreen = document.querySelector("#loading-screen");
let buttonsContainer = document.querySelector(".buttons");

// let resultArr = [];
// let totalSize = 1000;
// let arrayBufferVideo = null;
// let chunks = []
// let accessKeyId = "";
// let secretAccessKey = "";
// let sessionToken = "";
// let bucketName = "";
// let videoObj = null;
// // let videoName = "";
// let videoBlob = null;
// // let isMerakiCall;

// // Function to retrieve and log the chunks array from chrome.storage.local
// function logChunksArray() {
//   chrome.storage.local.get('chunks', (result) => {
//     if (chrome.runtime.lastError) {
//       console.error('Error retrieving chunks array:', chrome.runtime.lastError);
//     } else {
//       let chunksArray = result.chunks || [];
//       console.log('Chunks array:', chunksArray);
//       const blobsArray = chunksArray.map((base64String) =>
//         base64ToBlob(base64String, "video/mp4")
//       );

//       videoBlob = concatenateBlobs(blobsArray);

//       const videoElement = document.querySelector("#recorded-video");
//       videoElement.classList.add("video-player");
//       videoElement.src = URL.createObjectURL(videoBlob);
//       let loader = document.querySelector("#loader");
//       loader.classList.add("none");
//       videoElement.classList.remove("none")

//       downloadButton.classList.remove("pointerNone")

//       downloadButton.addEventListener("click", () => {
//         // Create a download link
//         const downloadLink = document.createElement("a");
//         downloadLink.href = URL.createObjectURL(videoBlob);
//         downloadLink.download = "video.mp4";
//         document.body.appendChild(downloadLink);

//         // Trigger download
//         downloadLink.click();
//         chunksArray = [];
//         downloadLink.remove();
//       })
//     }

//   });
// }

// // Call the function to log the chunks array
// logChunksArray();
// // Function to convert base64 to Blob
// function base64ToBlob(base64String, mimeType) {
//   const binaryString = atob(base64String);
//   const byteArray = new Uint8Array(binaryString.length);
//   for (let i = 0; i < binaryString.length; i++) {
//     byteArray[i] = binaryString.charCodeAt(i);
//   }
//   return new Blob([byteArray], { type: mimeType });
// }

// function concatenateBlobs(blobsArray) {
//   return new Blob(blobsArray, { type: blobsArray[0].type });
// }

// let resultArr = [];
// let totalSize = 1000;
// let arrayBufferVideo = null;
// let chunks = []
// let accessKeyId = "";
// let secretAccessKey = "";
// let sessionToken = "";
// let bucketName = "";
// let videoObj = null;
// let videoName = "";
// let videoBlob = null;
// let isMerakiCall;

// function getChromeLocalStorage(key) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(key, function (result) {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }



// async function getData() {
//   let resultSize = 0;

//   let resultVar = await getChromeLocalStorage([`data_chunk_0`]);
//   resultSize = resultVar.data_chunk_0.totalChunks;
//   console.log(resultVar, resultSize);

//   for (let i = 0; i < resultSize; i++) {
//     let randomVar = await getChromeLocalStorage([`data_chunk_${i}`]);
//     resultArr.push(randomVar[`data_chunk_${i}`].chunk);
//   }
//   console.log({ resultArr });

//   // Function to convert base64 to Blob
//   function base64ToBlob(base64String, mimeType) {
//     const binaryString = atob(base64String);
//     const byteArray = new Uint8Array(binaryString.length);
//     for (let i = 0; i < binaryString.length; i++) {
//       byteArray[i] = binaryString.charCodeAt(i);
//     }
//     return new Blob([byteArray], { type: mimeType });
//   }

//   // Function to concatenate Blobs
//   function concatenateBlobs(blobsArray) {
//     return new Blob(blobsArray, { type: blobsArray[0].type });
//   }

//   // Convert base64 strings to Blobs
//   const blobsArray = resultArr.map((base64String) =>
//     base64ToBlob(base64String, "video/mp4")
//   );

//   console.log(blobsArray);
//   // Concatenate Blobs into a single video Blob
//   videoBlob = concatenateBlobs(blobsArray);

//   console.log(videoBlob);

//   // Define a function that converts a Blob to an ArrayBuffer
//   function blobToArrayBuffer(blob) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.addEventListener("loadend", () => {
//         resolve(reader.result);
//       });
//       reader.addEventListener("error", () => {
//         reject(reader.error);
//       });
//       reader.readAsArrayBuffer(videoBlob);
//     });
//   }

//   // Use the function to convert the Blob to an ArrayBuffer
//   blobToArrayBuffer(videoBlob)
//     .then((arrayBuffer) => {
//       // Do something with the ArrayBuffer
//       arrayBufferVideo = arrayBuffer;
//       console.log(
//         "Converted Blob to ArrayBuffer:",
//         arrayBuffer,
//         arrayBufferVideo
//       );
//     })
//     .catch((error) => {
//       console.error("Error converting Blob to ArrayBuffer:", error);
//     });

//   // Create a video element
//   const videoElement = document.querySelector("#recorded-video");
//   videoElement.classList.add("video-player");
//   videoElement.src = URL.createObjectURL(videoBlob); 
//   let loader = document.querySelector("#loader");
//   loader.classList.add("none");
//   videoElement.classList.remove("none")


//   downloadButton.classList.remove("pointerNone")

//   downloadButton.addEventListener("click", () => {
//     // Create a download link
//     const downloadLink = document.createElement("a");
//     downloadLink.href = URL.createObjectURL(videoBlob);
//     downloadLink.download = "video.mp4";
//     document.body.appendChild(downloadLink);

//     // Trigger download
//     downloadLink.click();

//     // Clean up
//     resultArr = [];
//     downloadLink.remove();
//   });


//   chrome.storage.local.clear(function () {
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError);
//     } else {
//       console.log("chrome.storage.local cleared successfully.");
//       chrome.storage.local.get("attendanceRecord", (result) => {
//         console.log(result , "inside clear ")
//       })

//     }
//   });
// }

// setTimeout(()=>{
//   getData()
// },1000)









// Open IndexedDB
const dbName = "recordingsDatabase";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

let recordedVideo = document.querySelector("#recorded-video");
request.onupgradeneeded = event => {
  db = event.target.result;
  const objectStore = db.createObjectStore("recordings", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = event => {
  db = event.target.result;
  displayRecordings();

};

request.onerror = event => {
  console.error("Error opening database:", event.target.error);
};

// Display recordings
function displayRecordings() {
  const transaction = db.transaction(["recordings"], "readonly");
  const recordingStore = transaction.objectStore("recordings");
  const recordingsList = document.getElementById("recordings-list");

  const cursor = recordingStore.openCursor();


  function deleteRecording(id) {
    const transaction = db.transaction("recordings", "readwrite");
    const recordingStore = transaction.objectStore("recordings");

    const deleteRequest = recordingStore.delete(id);
    console.log("delete request", id)

    deleteRequest.onsuccess = function () {
      console.log(`Recording ${id} deleted successfully.`);
      location.reload();
    };

    deleteRequest.onerror = function () {
      console.error(`Error deleting recording ${id}`);
    };
  }


  cursor.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const recordingLink = document.createElement("button");
      let recordingContainer = document.querySelector("#recordings-list");
      let individualRecordingContainer = document.createElement("div");

      individualRecordingContainer.classList.add("individual-recording-container");
      recordingContainer.appendChild(individualRecordingContainer);

      recordingLink.classList.add("btn-play");
      recordingLink.id = URL.createObjectURL(cursor.value.recording.data);
      console.log(cursor, "recording link");
      recordingLink.textContent = `${cursor.value.recording.name}`;
      individualRecordingContainer.appendChild(recordingLink);
      // Create a button to delete the recording
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete");
      deleteButton.textContent = "Delete Rec";
      deleteButton.id = cursor.value.id;
      deleteButton.addEventListener("click", function () {
        deleteRecording(parseInt(deleteButton.id));
      });

      individualRecordingContainer.appendChild(deleteButton);
      Listener(recordingLink.id);
      cursor.continue();
    }

  };
}



// Display recording by ID
function displayRecordingById(id) {
  const transaction = db.transaction(["recordings"], "readonly");
  const objectStore = transaction.objectStore("recordings");

  const request = objectStore.get(id);

  request.onsuccess = event => {
    const recording = event.target.result;
    if (recording) {
      video.src = URL.createObjectURL(recording.data);
      video.play();
    }
  };

  request.onerror = event => {
    console.error("Error retrieving recording:", event.target.error);
  };

  transaction.oncomplete = () => {
    if (recordings.length > 0) {
      const lastRecordingId = recordings[recordings.length - 1].id;
      displayRecordingById(lastRecordingId);
    }
  };

}

function Listener(btnId) {
  let arr = Array.from(document.getElementsByClassName("btn-play"));
  for (let i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", () => {
      handleClick(arr[i].id)
    })
  }
}

let downloadButton = document.querySelector("#download-recording");

downloadButton.addEventListener("click", () => {
  // Create a download link
  const downloadLink = document.createElement("a");
  downloadLink.href = recordedVideo.src;
  downloadLink.download = "video.mp4";
  document.body.appendChild(downloadLink);

  // Trigger download
  downloadLink.click();

  // Clean up
  resultArr = [];
  downloadLink.remove();
});






function handleClick(buttonId) {
  // const videoUrl = URL.createObjectURL(buttonId);
  console.log(buttonId, "button id");
  recordedVideo.src = buttonId;
  recordedVideo.controls = true;

}


function LoadFirstVideo() {

  const dbName = "recordingsDatabase";
  const dbVersion = 1;
  let db;
  let recordingsArray = [];

  const request = indexedDB.open(dbName, dbVersion);

  request.onupgradeneeded = event => {
    db = event.target.result;
    const objectStore = db.createObjectStore("recordings", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("name", "name", { unique: false });
  };

  request.onsuccess = event => {
    db = event.target.result;

    const transaction = db.transaction(["recordings"], "readonly");
    const objectStore = transaction.objectStore("recordings");

    const cursor = objectStore.openCursor();

    cursor.onsuccess = function (event) {

      const cursor = event.target.result;
      if (cursor) {
        // console.log(cursor, "cursor");
        recordingsArray.push(cursor.value.recording.data);
        cursor.continue();

      } else {
        const recordedVideo = document.querySelector("#recorded-video");
        recordedVideo.width = 500;
        recordedVideo.height = 300;
        try {
          recordedVideo.src = URL.createObjectURL(recordingsArray[recordingsArray.length - 1]);
        } catch (error) {
         console.log(error)
        }
        // recordedVideo.src = URL.createObjectURL(recordingsArray[recordingsArray.length - 1]);

      }
    }
  };
}

LoadFirstVideo();