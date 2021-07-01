const { createHash } = require('crypto');
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const { clipboard } = require('electron')
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
contextBridge.exposeInMainWorld('pSheck', api(createHash, ipcRenderer, fs, clipboard));

function api(createHash, ipcRenderer, fs, clipboard) {
  return {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    generate,
    compare,
    copyToClipboard
  }

  function copyToClipboard(text) {
    clipboard.writeText(text);
  }

  function generate(ecryptType, path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, null, (err, data) => {
          if (err) {
              console.log(err);
              reject(null);
          }

          const hash = createHash(ecryptType);
          hash.update(data);

          resolve(hash.digest('hex'));
      });
    });
  }

  function compare(ecryptType, path, stringToCompare) {
    return generate(ecryptType, path).then((encryptedString) => {
      return encryptedString === stringToCompare;
    }, () => {
      return false;
    });
  }

  function closeWindow(params) {
    ipcRenderer.send('close-window', 'true')
  }

  function minimizeWindow(params) {
    ipcRenderer.send('minimize-window', 'true')
  }

  function maximizeWindow(params) {
    ipcRenderer.send('maximize-window', 'true')
  }
}