let scriptExecutorPort;
const fieldName = `executorScriptState`;

function connected(port) {
    scriptExecutorPort = port;
    scriptExecutorPort.onMessage.addListener(onMessageRecieved);
}
  
browser.runtime.onConnect.addListener(connected);

function onMessageRecieved(message) {
    switch(true) {
        case typeof message.updatedExecutorState === 'object':
            setExecutorStateObject(message.updatedExecutorState);
            break;
        case message.requestExecutorState:
            getExecutorStateObject();
            break;
        default:
            console.log(`Unknown command from content script: ${JSON.stringify(message)}`)
    }
}

const updateOpenedTabs = (state) => {
    console.log('updating opened tabs');
    const tabsQuery = browser.tabs.query({url: "<all_urls>"});
    tabsQuery.then(
        (tabs) => {
            tabs.forEach(tab => {
                browser.tabs.sendMessage(
                    tab.id,
                    {updatedExecutorState: state}
                );
            });
        },
        (error) => {
            console.log(`Can't get opened tabs: ${error}`);
        }
    );
}

const setExecutorStateObject = (state) => {
    console.log('I just retrive new state')
    console.log(state)
    browser.storage.local.set({[fieldName]: state}).then((result)=> {
        updateOpenedTabs(state);
    });
}

const getExecutorStateObject = () => {
    browser.storage.local.get(fieldName).then(onGettingResult, onGettingError);
}

const onGettingError = (err) => {
    console.log(`Recieved error, while trying to connect to local storage : ${err}`)  
}
const onGettingResult = (result) => {
    console.log("Well, i  get an object");
    console.log(result);
    const state = result[fieldName] || {};
    scriptExecutorPort.postMessage({responseState: state});
}