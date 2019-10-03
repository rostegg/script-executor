"use strict";

class SnippettItem {
    constructor(path, value) {
        this.path = path;
        this.value = value;
    }
}

class Popup {
    constructor(containerElement) {
        this.containerElement = containerElement;

        this.onClick = this.onClick.bind(this);

        this.containerElement.querySelector("button.create-snippet").onclick = this.onClick;
    }

    onClick() {
        alert("Clicked, lol");
        browser.runtime.sendMessage({number:1});
    }

}

const popup = new Popup(document.getElementById('app'));


browser.runtime.onMessage.addListener((message) => {
    
});

