/**
 * **********************************************
 * MARKDOWN RENDER, TOGGLE DISPLAY AND SAVE INPUT
 * **********************************************
 */

/**
 * Initiate the markdown renderer
 * with specified options
 *
 * TODO: Allow user to manually config
 * these options
 */
const converter = new showdown.Converter({
    'simplifiedAutoLink': true,
    'excludeTrailingPunctuationFromURLs': true,
    'strikethrough': true,
    'tables': true,
    'tasklist': true,
    'ghCodeBlocks': true,
    'smoothLivePreview': true,
    'smartIndentationFix': true,
    'simpleLineBreaks': true,
    'openLinksInNewWindow': true,
    'emoji': true
});

/**
 * GitHub-styled markdown to allow
 * tasklists, tables, simple-line-breaks etc.
 */
converter.setFlavor('github');


const renderBox = document.querySelector('.markdown-body');
const textarea = document.querySelector('textarea');
let rawText = localStorage.getItem('rawText');

/**
 * Toggle between renderBox and textarea
 * @param n - If n = 1, display renderBox, else display textarea
 */
const toggleDisplay = (n) => {

    if (n) {
        textarea.classList.remove('nodisplay');
        renderBox.classList.add('nodisplay');
    }

    else {
        textarea.classList.add('nodisplay');
        renderBox.classList.remove('nodisplay');
    }

};

/**
 * Move the textarea caret to the start of the
 * line instead of the last line so that it is visible
 * From https://stackoverflow.com/a/8190890/
 */
const moveCaretToStart = () => {

    if (typeof textarea.selectionStart === 'number') {
        textarea.selectionStart = textarea.selectionEnd = 0;
    }

    else if (typeof textarea.createTextRange !== 'undefined') {
        textarea.focus();
        const range = textarea.createTextRange();
        range.collapse(true);
        range.select();
    }

};

// Main edit function
const edit = () => {

    toggleDisplay(1);
    moveCaretToStart();
    textarea.focus();
    textarea.scrollTop = 0;

};

// Main save function
const save = () => {

    toggleDisplay(0);

    const text = textarea.value;
    const html = converter.makeHtml(text);

    renderBox.innerHTML = html;
    localStorage.setItem('rawText', text);

    if (text !== rawText) {
        const lastEditDate = new Date();
        localStorage.setItem('lastEdited', lastEditDate);
        rawText = text;
    }

};

/**
 * Get `rawText` from localStorage and populate textarea with it
 */
textarea.value = rawText;
save();

/**
 * Add event listeners to edit and save buttons
 */
document.querySelector('#edit').addEventListener('click', () => { edit(); }, false);
document.querySelector('#save').addEventListener('click', () => { save(); }, false);

/**
 * Capture keystrokes and perform respective functions:
 * 
 * Ctrl + S => Save input (`save` function)
 * Ctrl + E => Edit input (`edit` function)
 */
document.addEventListener('keydown', (e) => {
    if (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) {
        if (e.keyCode === 83) {
            e.preventDefault();
            save();
        }
        else if (e.keyCode === 69) {
            e.preventDefault();
            edit();
        }
    }
}, false);

/**
 * **************************
 * BOTTOM BAR FUNCTIONALITIES
 * **************************
 */

/**
 * Simple time-display function for the bottom bar
 */
const timeDisplay = () => {

    setInterval(function () {

        const today = new Date();
        const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        const year = today.getFullYear() < 10 ? '0' + today.getFullYear() : today.getFullYear();

        const hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
        const minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        const seconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

        const output = `${day}/${month}/${year} - ${hour}:${minute}:${seconds}`;

        document.querySelector('#time').innerHTML = output;

    }, 1000);

};
timeDisplay();

/**
 * Last edited: _______
 */
setInterval(() => {
    document.querySelector('#lastEdited').innerHTML = `Last edited: ${timeago().format(Date.parse(localStorage.getItem('lastEdited')))}`;
}, 1000);

/**
 * *********
 * POWERMODE
 * *********
 */

POWERMODE.shake = false; // Disable shaking (too much of a distraction IMO)
POWERMODE.colorful = true;
textarea.addEventListener('input', POWERMODE); // Add POWERMODE function to input.