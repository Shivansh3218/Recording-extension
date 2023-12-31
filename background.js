
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
        chrome.storage.local.set({ popUpId }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log("stored in local storage")
          }
        });
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
  } catch (error) { }

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPopUp") {
    console.log("the background script received the message to open popup")
    openPopup();
  }

  if (request.action === "popupId") {
    // Access the popup's window object
    popUpId = request.message;
    chrome.storage.local.set({ popUpId }, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("stored in local storage")
      }
    });
  }
  if (request.action === "getContentTabId") {
    meetWindowId = sender.tab.id;
    chrome.storage.local.set({ meetWindowId }, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(" meet  window id stored in local storage")
      }
    });
  }
  if (request.action === "dummyMessage") {
    console.log(request.data)
  }

  if (request.action === "startingRecording") {
    chrome.storage.local.get('meetWindowId', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving chunks array:', chrome.runtime.lastError);
      } else {
        meetWindowId = result.meetWindowId;

        try {
          chrome.tabs.sendMessage(meetWindowId, { action: "startRecordingTimer" });
        } catch (err) {
          console.log(err);
        }
      }
    })

  }
  if (request.action === "stopRecording") {
    // setTimeout(() => {
    //   if (doesWindowExist(popUpId)) {
    //     try {
    //       chrome.windows.remove(popUpId, function () {
    //         if (chrome.runtime.lastError) {
    //           console.log(chrome.runtime.lastError, "errorr in removing window")
    //         }
    //       })

    //     } catch (err) {
    //       console.log(err)
    //     }

    //   }
    // }, 4000);

  }
  if (request.message === "closePreview") {
    console.log("close preview event", request.closeURL);

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
                } catch (err) { }
              }
            });
          }
        }
      );
    } catch (er) { }
  }

  if (request.action === "closePopupWindow") {
    chrome.storage.local.get('popUpId', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving chunks array:', chrome.runtime.lastError);
      } else {
        popUpId = result.popUpId;
        if (doesWindowExist(popUpId)) {
          try {
            chrome.windows.remove(popUpId, function () {
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError, "errorr in removing window")
              }
            })

          } catch (err) {
            console.log(err)
          }

        }
      }
    })

  }
  if (request.action === "createTab") {
    chrome.tabs.create({ url: request.url });
    chrome.storage.local.get('popUpId', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving chunks array:', chrome.runtime.lastError);
      } else {
        popUpId = result.popUpId;
        if (doesWindowExist(popUpId)) {
          try {
            chrome.windows.remove(popUpId, function () {
              if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError, "errorr in removing window")
              }
            })

          } catch (err) {
            console.log(err)
          }

        }
      }
    })
  }

  if (request.action === "createTabAfterDelay") {
    setTimeout(() => {

      chrome.tabs.create({ url: request.url });
      chrome.storage.local.get('popUpId', (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error retrieving chunks array:', chrome.runtime.lastError);
        } else {
          popUpId = result.popUpId;
          if (doesWindowExist(popUpId)) {
            try {
              chrome.windows.remove(popUpId, function () {
                if (chrome.runtime.lastError) {
                  console.log(chrome.runtime.lastError, "errorr in removing window")
                }
              })

            } catch (err) {
              console.log(err)
            }

          }
        }
      })
    }, 4000)


  }

  else if (request.type === "attendance") {
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

    chrome.storage.local.get('meetWindowId', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving chunks array:', chrome.runtime.lastError);
      } else {
        meetWindowId = result.meetWindowId;

        if (doesWindowExist(meetWindowId) === true) {
          try {
            chrome.tabs.sendMessage(meetWindowId, { message: "PopupClosed" });
          } catch (err) {
            console.log(err);
          }
        }

        isPopUpOpened = false;
      }
    });
  });

});










// setInterval(() => {
//   chrome.storage.local.get('popUpId', (result) => {
//         if (chrome.runtime.lastError) {
//           console.error('Error retrieving chunks array:', chrome.runtime.lastError);
//         } else {
//           console.log('Chunks array:', result);
//         }
//       })
// }, 1000);
