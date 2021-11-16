function CalculateTopPosition(helperMsgId, rectangle, message) {
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement && msgElement.innerHTML !== undefined && msgElement.style !== undefined) {
        msgElement.innerHTML = message;
        // We might need to make some adjustments for the height of this element if it wraps
        var rectangleOfMsgElement = msgElement.getBoundingClientRect();

        // Not sure the math is right, but it appears 3.5 times the input field height works well
        var topOffset = rectangle.top - (rectangle.height + rectangleOfMsgElement.height) + window.scrollY;
        // Add an inline style of the top to the helperMsgId to position it absolutely 
        // on the screen. 
        // Added the grid layout height
        msgElement.style.top = topOffset + "px";

        // Not sure we have the math right, but -32 seems to work well
        var leftOffset = rectangle.left + rectangle.width - 32 + window.scrollX;
        // Add an inline style of the left to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.left = leftOffset + "px";
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot display it`);
    }

}

function HasFocus(id, helperMsgId, msgText) {
    var element = document.getElementById(id);
    if (element) {
        // Get the bounding rectangle where the element is on the web page
        // see https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
        var rectangleOfElement = element.getBoundingClientRect();

        if (rectangleOfElement && rectangleOfElement.top !== undefined) {
            ToggleClassState(helperMsgId, 'hidden', false);
        }
        // Reposition the element on the web page
        if (element.id != "from")
            CalculateTopPositionEdited(helperMsgId,
                rectangleOfElement,
                msgText);
        else {
            CalculateTopPosition(helperMsgId,
                rectangleOfElement,
                msgText);
        }
    }
    else {
        console.log(`Could not find id '${id}' so cannot focus on it`);
    }
}

function LostFocus(id, helperMsgId) {
    // Update the element to remove the top position
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement) {
        msgElement.style = "";  // Remove the top and left inline style
        if (id) {
            msgElement.innerHTML = "";  // Remove the help text inside the element
        }
        // Toggle the class called "hidden" on the helperMsgId element to make it disappear
        ToggleClassState(helperMsgId, 'hidden', true);
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot display it`);
    }
}

function ToggleClassState(id, toggleClass, force) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Toggle the Class 
        inputElement.classList.toggle(toggleClass, force);
    }
}

function CalculateTopPositionEdited(helperMsgId, rectangle, message) {
    var msgElement = document.getElementById(helperMsgId);
    if (msgElement && msgElement.innerHTML !== undefined && msgElement.style !== undefined) {
        msgElement.innerHTML = message;
        // We might need to make some adjustments for the height of this element if it wraps
        var rectangleOfMsgElement = msgElement.getBoundingClientRect();

        // Not sure the math is right, but it appears 3.5 times the input field height works well
        var topOffset = rectangle.top - (rectangle.height + rectangleOfMsgElement.height) + window.scrollY;
        // Add an inline style of the top to the helperMsgId to position it absolutely 
        // on the screen. 
        // Added the grid layout height
        msgElement.style.top = topOffset + 70 + "px";

        // Not sure we have the math right, but -32 seems to work well
        var leftOffset = rectangle.left + rectangle.width - 32 + window.scrollX;
        // Add an inline style of the left to the helperMsgId to position it absolutely 
        // on the screen. 
        msgElement.style.left = leftOffset + "px";
    }
    else {
        console.log(`Could not find id of help box '${helperMsgId}' so cannot display it`);
    }

}