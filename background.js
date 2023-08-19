// let popUpId;
// let meetWindowId;
// let isPopUpOpened = false;
// let firstPopUpOpen = true;
// let popupArr = [];

// function openPopup() {
//   console.log(isPopUpOpened, "Is a popup already opened")
//   if (!isPopUpOpened) {
//     chrome.windows.create(
//       {
//         url: "popup.html",
//         type: "popup",
//         width: 700,
//         height: 600,
//       },
//       function (window) {
//         popUpId = window.id; // Store the ID of the newly opened popup
//         isPopUpOpened = true;
//       }
//     );
//   } else {
//   }
// }

// function closePopup(id) {
//   if (isPopUpOpened) {
//     chrome.windows.remove(id, function () {
//       if (chrome.runtime.lastError) {
//         console.error(chrome.runtime.lastError);
//       }
//     });
//   }
//   isPopUpOpened = false;
// }

// async function doesWindowExist(windowId) {
//   try {
//     await chrome.windows.get(windowId, function (window) {
//       if (chrome.runtime.lastError) {
//         // An error occurred, which means the window does not exist
//         console.log("Window does not exist");
//         return false;
//       }
//       // Check if the window is present and accessible
//       if (window) {
//         return true;
//       } else {
//         return false;
//       }
//     });
//   } catch (error) {}

// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "openPopUp") {
//     openPopup();
//   }

//   if (request.action === "popupId") {
//     // Access the popup's window object
//     popUpId = request.message;
//   }
//   if (request.action === "getContentTabId") {
//     meetWindowId = sender.tab.id;
//     console.log("meeting window id is present at", meetWindowId)

//   }

//   if (request.action === "startingRecording") {
//     console.log("The meeting recording message received in background.js")
//     try {
//       console.log("background.js sending the request of showiing the stop and timer", meetWindowId);

//       chrome.tabs.sendMessage(meetWindowId, { action: "startRecordingTimer" });
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   if (request.action === "stopRecording") {
//   }
//   if (request.message === "closePreview") {
//     console.log("close preview event", request.closeURL);
//     myArray = [];
//     try {
//       chrome.tabs.query(
//         {
//           url: request.closeURL,
//         },
//         function (tabs) {
//           if (tabs.length > 0) {
//             chrome.tabs.remove(tabs[0].id, function () {
//               if (chrome.runtime.lastError) {
//                 try {
//                 } catch (err) {}
//               }
//             });
//           }
//         }
//       );
//     } catch (er) {}
//   }
//   if (request.action === "createTab") {
//     chrome.tabs.create({ url: request.url });

//     if (doesWindowExist(popUpId)) {
//       chrome.windows.remove(popUpId, function () {
//         if (chrome.runtime.lastError) {
//           console.error(chrome.runtime.lastError);
//         }
//       });
//     }
//   }
// });

// // let connect = 0;
// // chrome.runtime.onConnect.addListener(function (externalPort) {
// //   externalPort.onDisconnect.addListener(function () {
// //     console.log(meetWindowId, "meet window id on disconnect");
// //     if (doesWindowExist(meetWindowId) === true) {
// //       try {
// //         chrome.tabs.sendMessage(meetWindowId, { message: "PopupClosed" });
// //       } catch (err) {
// //         console.log(err);
// //       }
// //     }

// //     isPopUpOpened = false;
// //   });
// // });

// chrome.windows.onRemoved.addListener((popUpId) => {
//   console.log('Popup window with ID', popUpId, 'is closed');
//   if (doesWindowExist(meetWindowId)) {
//     try {
//       chrome.tabs.sendMessage(meetWindowId, { message: "PopupClosed" });
//       isPopUpOpened = false
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });
 





















let myArray = [];
let popUpId;
let meetWindowId;
let isPopUpOpened = false;
let firstPopUpOpen = true;
let popupArr = [];
// Function to initialize the array and store it in chrome.storage.local

  


function openPopup() {
  console.log("open popup function called this time")
  if (!isPopUpOpened) {
    chrome.windows.create(
      {
        url: "popup.html",
        type: "popup",
        width: 700,
        height: 600,
      },
      function (window) {
        popUpId = window.id; // Store the ID of the newly opened popup
        isPopUpOpened = true;
      }
    );
  } else {
  }
}

function closePopup(id) {
  if (isPopUpOpened) {
    chrome.windows.remove(id, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }
  isPopUpOpened = false;
}

async function doesWindowExist(windowId) {
  try {
    await chrome.windows.get(windowId, function (window) {
      if (chrome.runtime.lastError) {
        // An error occurred, which means the window does not exist
        console.log("Window does not exist");
        return false;
      }
      // Check if the window is present and accessible
      if (window) {
        return true;
      } else {
        return false;
      }
    });
  } catch (error) {}

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPopUp") {
    console.log("the background script received the message to open popup")
    openPopup();
  }

  if (request.action === "popupId") {
    // Access the popup's window object
    popUpId = request.message;
  }
  if (request.action === "getContentTabId") {
    meetWindowId = sender.tab.id;
  }
  if (request.action === "dummyMessage") {
    console.log(request.data)
  }

  if (request.action === "startingRecording") {
    try {
      chrome.tabs.sendMessage(meetWindowId, { action: "startRecordingTimer" });
    } catch (err) {
      console.log(err);
    }
  }
  if (request.action === "stopRecording") {
  }
  if (request.message === "closePreview") {
    console.log("close preview event", request.closeURL);
    myArray = [];
    try {
      chrome.tabs.query(
        {
          url: request.closeURL,
        },
        function (tabs) {
          if (tabs.length > 0) {
            chrome.tabs.remove(tabs[0].id, function () {
              if (chrome.runtime.lastError) {
                try {
                } catch (err) {}
              }
            });
          }
        }
      );
    } catch (er) {}
  }
  if (request.action === "createTab") {
    myArray.map((chunk, index) => {
      const key = `data_chunk_${index}`;
      const chunkData = { chunk, index, totalChunks: myArray.length };
      chrome.storage.local.set({ [key]: chunkData }, () => {});
    });
    chrome.tabs.create({ url: request.url });

    if (doesWindowExist(popUpId)) {
      chrome.windows.remove(popUpId, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }
  } else if (request.type == "base64Data") {
    myArray.push(request.data);
  } else if (request.type === "attendance") {
    let attendanceRecord = request.meetRecord;
    chrome.storage.local.set({ attendanceRecord }, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
      }
    });
  }
});

let connect = 0;
chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log(meetWindowId, "meet window id on disconnect");
    if (doesWindowExist(meetWindowId) === true) {
      try {
        chrome.tabs.sendMessage(meetWindowId, { message: "PopupClosed" });
      } catch (err) {
        console.log(err);
      }
    }

    isPopUpOpened = false;
  });
});











