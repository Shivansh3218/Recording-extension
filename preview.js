let loadingScreen = document.querySelector("#loading-screen");
let buttonsContainer = document.querySelector(".buttons");
let downloadButton = document.querySelector("#download-recording");

let resultArr = [];
let totalSize = 1000;
let arrayBufferVideo = null;
let chunks = []
let accessKeyId = "";
let secretAccessKey = "";
let sessionToken = "";
let bucketName = "";
let videoObj = null;
// let videoName = "";
let videoBlob = null;
// let isMerakiCall;

// Function to retrieve and log the chunks array from chrome.storage.local
function logChunksArray() {
  chrome.storage.local.get('chunks', (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving chunks array:', chrome.runtime.lastError);
    } else {
      let chunksArray = result.chunks || [];
      console.log('Chunks array:', chunksArray);
      const blobsArray = chunksArray.map((base64String) =>
        base64ToBlob(base64String, "video/mp4")
      );

      videoBlob = concatenateBlobs(blobsArray);

      const videoElement = document.querySelector("#recorded-video");
      videoElement.classList.add("video-player");
      videoElement.src = URL.createObjectURL(videoBlob);
      let loader = document.querySelector("#loader");
      loader.classList.add("none");
      videoElement.classList.remove("none")

      downloadButton.classList.remove("pointerNone")

      downloadButton.addEventListener("click", () => {
        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(videoBlob);
        downloadLink.download = "video.mp4";
        document.body.appendChild(downloadLink);

        // Trigger download
        downloadLink.click();
        chunksArray = [];
        downloadLink.remove();
      })
    }

  });
}

// Call the function to log the chunks array
logChunksArray();
// Function to convert base64 to Blob
function base64ToBlob(base64String, mimeType) {
  const binaryString = atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}

function concatenateBlobs(blobsArray) {
  return new Blob(blobsArray, { type: blobsArray[0].type });
}