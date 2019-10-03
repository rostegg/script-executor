"use strict";

const scriptExecutorPort = browser.runtime.connect({name:"script-executor-port"});

class Popup {
    constructor(containerElement) {
        this.containerElement = containerElement;
        
        this.onCreateClick = this.onCreateClick.bind(this);
        this.containerElement.querySelector("button.create-snippet").onclick = this.onCreateClick;
        
        this.objectToTree = this.objectToTree.bind(this);
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
    
    onNodeClick(e, node) {
        alert('clicked on function ' + node.toString())
    }

    onCreateClick() {
        let createData = {
            type: "popup",
            url: "edit-page.html",
            width: 670,
            height: 850
        };
        let creating = browser.windows.create(createData);
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
        this.tree.collapseAllNodes();
        this.tree.reload();
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

