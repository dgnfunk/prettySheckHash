const currentItem = document.getElementById('currentItem');
const dropDownTypeHash = document.getElementById('encrypt-type');
const checkedButton = document.getElementById('check-button');
const resultContent = document.getElementById('result-content');
const inputToCompare = document.getElementById('string-compare');
const resetButton = document.getElementById('reset-button');
const fileToCheckElement = document.getElementById('fileToCheck');
const coppiedText = document.getElementById('copiedText');

let currentItemData;
let currentFile;
let checkedButtonState = false;

document.getElementById('copiedButton').addEventListener('click', () => {
    if (!resultContent.innerText) {
        return;
    }
    
    coppiedText.removeAttribute('hidden');
    window.pSheck.copyToClipboard(resultContent.innerText);

    setTimeout(() => {
        coppiedText.setAttribute('hidden', 'true');
    }, 2000);
})

document.getElementById('closeWindowBtn').addEventListener('click', () => {
    window.pSheck.closeWindow();
});

document.getElementById('minimizeWindowBtn').addEventListener('click', () => {
    window.pSheck.minimizeWindow();
});

document.getElementById('buttonToSearch').addEventListener('click', () => {
    fileToCheckElement.click();
});

fileToCheckElement.addEventListener('change', (event) => {
    const fileList = event.target.files;

    resetButton.style.display = 'block';
    currentFile = fileList[0];
    currentItem.value = currentFile.name;
    resultContent.innerText = '';

    if (currentFile && currentFile.name && currentItem.classList.contains('error-input')) {
        currentItem.classList.remove('error-input');
    }
});

document.getElementById('generate-button').addEventListener('click', () => {
    resetButton.style.display = 'block';

    if (!currentFile) {
        currentItem.classList.add('error-input');
        resultContent.innerText = 'Error! Please check your input information.'

        return;
    }
  
    const ecryptType = dropDownTypeHash.value;

    window.pSheck
        .generate(ecryptType, currentFile.path)
        .then((encryptedString) => {
            resultContent.innerText = encryptedString;
        }, () => {
            resultContent.innerText = 'Error! Please check your input information.';
        });
});

checkedButton.addEventListener('click', () => {
    const compaStringTo = inputToCompare.value;
    const ecryptType = dropDownTypeHash.value;

    if (checkedButtonState && compaStringTo === '') {
        checkedButton.classList.remove('checked-button-active');
        inputToCompare.setAttribute('disabled', 'true');
        checkedButtonState = false;
        checkedButton.innerText = 'Compare';

        return;
    } 
    
    inputToCompare.removeAttribute('disabled');
    checkedButton.classList.add('checked-button-active')
    checkedButtonState = true;
    checkedButton.innerText = 'Check';

    if (compaStringTo === '') {
        return;
    }

    window.pSheck
        .compare(ecryptType, currentFile.path, compaStringTo)
        .then((sameString) => {
            inputToCompare.classList.add('success-active');
            resultContent.innerText = sameString.toLocaleString().toUpperCase();
        }, () => {
            resultContent.innerText = 'Error! Please check your input information.';
        });
});

resetButton.addEventListener('click', () => {
    checkedButton.innerText = 'Compare';
    checkedButtonState = false;
    checkedButton.classList.remove('checked-button-active');
    inputToCompare.setAttribute('disabled', 'true');
    inputToCompare.classList.remove('success-active');
    inputToCompare.value = '';
    resultContent.innerText = '';
    currentFile = null;
    currentItem.value = '';
    currentItem.classList.remove('error-input');
    resetButton.style.display = 'none';
    fileToCheckElement.value = null;
});
