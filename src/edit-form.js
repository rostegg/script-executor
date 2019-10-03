"use strict";

const scriptExecutorPort = browser.runtime.connect({name:"script-executor-port"});

class EditForm {
    constructor(containerElement) {
        this.containerElement = containerElement;
        this.removeSnippet = this.removeSnippet.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    removeSnippet() {

    }

    saveChanges() {

    }

    initEditor(code) {
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/monokai");
        this.editor.session.setMode("ace/mode/javascript");
        this.editor.session.setValue(code);
    }
}

const formInput = document.querySelectorAll('.form__element__input');
Array.prototype.forEach.call(formInput, function(el){
    el.addEventListener("focus", (event) => {
        el.parentNode.classList.add('form__element--typing');
    });
    el.addEventListener("blur", (event) => {
        if (el.value.length == 0) {
        el.parentNode.classList.remove('form__element--typing');
    }});
});

const editForm = new EditForm(document.getElementById('edit-form-container'));
const str = `
 var x = "All this is syntax highlighted";
 return x;
 `;
editForm.initEditor(str);

window.onbeforeunload = function() {
    alert("Exit handled");
}