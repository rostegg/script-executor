"use strict";

class SnippettItem {
    constructor(path, value) {
        this.path = path;
        this.value = value;
    }
}

const scriptExecutorPort = browser.runtime.connect({name:"script-executor-port"});   


class Popup {
    constructor(containerElement) {
        this.containerElement = containerElement;
        

        this.onCreateClick = this.onCreateClick.bind(this);
        this.containerElement.querySelector("button.create-snippet").onclick = this.onCreateClick;
        
        this.objectToTree = this.objectToTree.bind(this);
        this.selectSnippet = this.selectSnippet.bind(this);
        this.onNodeClick = this.onNodeClick.bind(this);

        scriptExecutorPort.postMessage({requestExecutorState: true});
    }


    objectToTree(obj, root) {
        if (Object.entries(obj).length === 0 && obj.constructor === Object)
            return root
        Object.keys(obj).forEach(item => {
            let node = new TreeNode(item);
            switch (true) {
                case typeof obj[item] === 'object':
                    this.objectToTree(obj[item], node)
                    root.addChild(node);
                    break;
                case typeof obj[item] === 'function':
                    node.on('click', this.onNodeClick);
                    root.addChild(node);
                    break;
            }
        });
        return root;
    }

    selectSnippet() {

    }
    
    onNodeClick(e, node) {

    }

    onCreateClick() {
        alert("Clicked, lol");
    }

    createTreeView(state) {
        let root = new TreeNode("scriptExecutor");
        this.root = this.objectToTree(state, root);
        this.tree = new TreeView(this.root, "#tree-view-container", {
            context_menu: undefined,
            leaf_icon: `<i class="fas fa-file"></i>`,
            parent_icon: `<i class="fas fa-folder"></i>`,
            open_icon: `<i class="fas fa-angle-down"></i>`,
            close_icon: `<i class="fas fa-angle-right"></i>'`
        });
    }

    buildTree() {
        this.root = new TreeNode("scriptExecutor");
        this.root.changeOption("icon", '<i class="fas fa-code-branch"></i>');
        var n1 = new TreeNode("1"),
        n11 = new TreeNode("1.1"),
        n2 = new TreeNode("2"),
        n3 = new TreeNode("3"),
        n31 = new TreeNode("3.1"),
        n32 = new TreeNode("3.2"),
        n321 = new TreeNode("3.2.1"),
        n33 = new TreeNode("3.3");

        this.root.addChild(n1);
        this.root.addChild(n2);
        this.root.addChild(n3);

        n1.addChild(n11);

        n3.addChild(n31);
        n3.addChild(n32);
        n3.addChild(n33);

        n3.setEnabled(false);

        n32.addChild(n321);
        this.tree = new TreeView(this.root, "#tree-view-container", {
            context_menu: undefined,
            leaf_icon: `<i class="fas fa-file"></i>`,
            parent_icon: `<i class="fas fa-folder"></i>`,
            open_icon: `<i class="fas fa-angle-down"></i>`,
            close_icon: `<i class="fas fa-angle-right"></i>'`
        });
    }

    

}
const popup = new Popup(document.getElementById('app'));
let testObj = {
    test: {
        a: function() {return 1},
        b: function() { return 2}
    },
    empty: {},
    deep: {
        im: {
            here: {
                now : (a, b) => {return 3}
            }
        }
    }
};
popup.createTreeView(testObj);

scriptExecutorPort.onMessage.addListener((message) => {
    console.log(`AAAAAAAAAAAA ${JSON.stringify(message)}`);
    /*switch (true) {
        case typeof message.responseState === 'object':
            popup.createTreeView(message.responseState);
            break;
    } */   
});

