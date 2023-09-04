let loadingScreen = document.querySelector("#loading-screen");
let buttonsContainer = document.querySelector(".buttons");
let downloadButton = document.querySelector("#download-recording");

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

const video = document.getElementById("video-tag");

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

  cursor.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const recordingLink = document.createElement("button");
      let recordingContainer = document.querySelector("#recordings-list");
      recordingLink.classList.add("btn-play");
      recordingLink.id = URL.createObjectURL(cursor.value.recording.data);
      console.log(cursor.value.id, "recording link");
      recordingLink.textContent = `${cursor.value.recording.name}`;
      recordingContainer.appendChild(recordingLink);
      // Create a button to delete the recording
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete");
      deleteButton.textContent = "Delete";
      deleteButton.id = cursor.value.id;

      recordingContainer.appendChild(deleteButton);
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
  // console.log(btnId, "button id inside function")
  let arr = Array.from(document.getElementsByClassName("btn-play"));
  // console.log(arr, "button array");
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i],"button");
    arr[i].addEventListener("click", () => {
      handleClick(arr[i].id)
    })
  }

  let delarr = Array.from(document.getElementsByClassName("delete"));
  // console.log(delarr, "delete array");
  for (let i = 0; i < delarr.length; i++) {
    // console.log(arr[i],"button");
    delarr[i].addEventListener("click", () => {
      deleteRecording(delarr[i].id)
    })
  }
}






function deleteRecording(nameToDelete) {
  const transaction = db.transaction(["recordings"], "readwrite");
  const objectStore = transaction.objectStore("recordings");

  console.log(nameToDelete,objectStore, "name to delete");

  const deleteRequest = objectStore.delete(nameToDelete);

  // Handle the delete request success.
  deleteRequest.onsuccess = () => {
    console.log(`Video '${nameToDelete}' deleted successfully.`);
    // console.log(objectStore, "delete request result");
  };

  // Handle errors.
  deleteRequest.onerror = (event) => {
    console.error(`Error deleting video: ${event.target.error}`);
  };


  // transaction.oncomplete = function () {
  //   db.close();
  // };
  // Open a cursor on the object store
  // const cursorRequest = objectStore.openCursor();

  // cursorRequest.onsuccess = function (event) {
  //   const cursor = event.target.result;
    

  //   if (cursor) {
      
  // console.log(cursor.value, "cursor request")
  //     // Check if the current cursor record matches the criteria
  //     if (cursor.value.id === keyToDelete) {
  //       // Delete the record associated with the cursor
  //       cursor.delete();
  //       console.log("Video deleted successfully");
  //     }

  //     // Continue iterating through the cursor
  //     cursor.continue();
  //   }
  // };

  // cursorRequest.onerror = function (event) {
  //   console.error("Cursor error: " + event.target.errorCode);
  // };



}







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

        console.log(recordingsArray[recordingsArray.length - 1], "recordings array");
        const video = document.createElement("video");
        video.id = "recordedVideo";
        video.controls = true;
        video.width = 500;
        video.height = 300;
        let videoContainer = document.querySelector("#meeting-recording-container");
        console.log(videoContainer)
        videoContainer.appendChild(video);
        video.src = URL.createObjectURL(recordingsArray[recordingsArray.length - 1]);

      }
    }



  };
}

LoadFirstVideo();