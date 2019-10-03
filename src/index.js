//https://www.flaticon.com/authors/freepik

// https://bugzilla.mozilla.org/show_bug.cgi?id=1408996

const executorName = 'scriptExecutor';

const scriptExecutorPort = browser.runtime.connect({name:"script-executor-port"});

scriptExecutorPort.onMessage.addListener(function(message) {
  switch (true) {
    case typeof message.responseState === 'object':
      console.log("Its response state!!");
      initGlobalExecutor(objectAsString(message.responseState))
      break;
    default:
        scriptExecutorPort.postMessage(message);
  }
});

browser.runtime.onMessage.addListener(message => {
  (message.updatedExecutorState) && updateGlobalState(objectAsString(message.updatedExecutorState));
});

const objectAsString = (obj) => { return JSON.stringify(obj); }

const updateGlobalState = (state) => {
  console.log('New state, updating');
  window.eval(`window.${executorName} = ${state}`)
}

function getValue(path) {
  return window.eval(path);
}

function setValue(path, value) {
  return window.eval(`${path} = ${value}`);
}

function initGlobalExecutor(state) {
  window.eval(`var ${executorName} = ${state}`)
  console.log("Here check init obj")
  console.log(getValue('window.scriptExecutor'))
  console.log(getValue('scriptExecutor'))
  console.log("Now lets update")
  appendToExecutor('other', 12);
}

function createPath(path) {
  console.log("creating path")
  let elements = path.split('.');
  elements = elements[0] === executorName ? elements.slice(1) : elements;
  const initPath = `window.${executorName}`;
  console.log(initPath)
  const fullPath = elements.reduce(function (accumulator, currentValue) {
    const p = accumulator.concat(`.${currentValue}`);
    console.log(`just p: ${p}`)
    console.log(getValue(p))
    console.log("get value")
    if (typeof getValue(p) === 'undefined')
      setValue(p, objectAsString({}));
    return p;
  }, initPath);
  return fullPath
}

function appendToVariable(path, value) {
  const fullPath = createPath(path);
  console.log("full path is ready")
  setValue(fullPath, objectAsString(value));
  console.log("Ok, its created localy, now save")
  saveExecutorState();
}

function appendToExecutor(path, value) {
  appendToVariable(`${executorName}.${path}`, value);
}

function saveExecutorState() {
  console.log('save updated state')
  scriptExecutorPort.postMessage({updatedExecutorState: getValue(executorName)});
}

const requestState = () => {
  scriptExecutorPort.postMessage({requestExecutorState: true});
}

requestState();


//requestState();
/*const functionRegExp = new RegExp()
initGlobalObject();
appendToExecutor('just.test', "2");
appendToExecutor('just.ither', "{}");
appendToExecutor('other', "12");
appendToExecutor('func', function(a) {alert(a)})
//console.log(getValue('scriptExecutor.just'));
// init global object
//defineGlobalVaribaleInWindow(globalObjectName, "{}");
//const globalObjectLink =  window.wrappedJSObject[globalObjectName];

//const code = `function a(){console.log('a')} function b(){console.log('b')}`;


const definedJsFunctionsRegex = /function\s*([A-z0-9]+)?\s*\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{((?:[^}{]+|\{[^}{]*\}|[^}]|\}(\"|\'|\`))*)*\}/g;
const str = `
function a (a,b) { hfgdhfhjg
  fdgdhfytr
  confsf 
  dfdasg  	
  }
  
  
  function test() {
  fdsf
  consol.gkgd("fsdfs");
  const a = function(m) {fuck you};
  a();
  return 1
  }
  
  function(fds) { obj = {} return "}" }
  

  function r () { obj = {}; a = []; }
  
  function test(float, best) { 
  console.log("Well");
  }
  
  function a(){console.log('a')} function b(){console.log('b')}
`;

let matches = [...str.matchAll(definedJsFunctionsRegex)];


// (?:const|let|var)\s*([A-z0-9]+)?\s*=\s(function\s*\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\=\>)\s*\{((?:[^}{]+|\{[^}{]*\}|[^}]|\}(\"|\'|\`))*)*\}
// call from curr context - const b = {f1: ()=> {console.log("f1")}, f2: function() {console.log("f2"); this.f1();}}



const definedJsFunctionsAsObjectRegex = /^(?:const|let|var)\s*([A-z0-9]+)?\s*=\s(function\s*\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\=\>)\s*\{((?:[^}{]+|\{[^}{]*\}|[^}]|\}(\"|\'|\`))*)*\}/gm

const str = `
let f = function(a,b) {
  console.log('gdhfsgdfg');
}

const f2 = (a,b,   d) => { return "hello" }

let f3 = function(){
  fdgdhgf
}

function test() {
	const inner = (t, b) => { im must be undetected}
	const inner2 = function (a,b) {
		im must be undetected too
	}
}

// here checking for }"
function(fds) { obj = {} return "}" }

function r () { obj = {}; a = []; }

function a(){console.log('a')} function b(){console.log('b')}
`;

let matches = [...str.matchAll(definedJsFunctionsAsObjectRegex)];
const fn = `return ${matches[1][2]} {${matches[1][5]}}`;
const func = new Function(fn)();
console.log(`well ${func(1,2,3)}`)


*/