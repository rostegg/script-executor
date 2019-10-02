//https://www.flaticon.com/authors/freepik

// https://bugzilla.mozilla.org/show_bug.cgi?id=1408996

const executorName = 'scriptExecutor';

function getValue(path) {
  return window.eval(path);
}

function setValue(path, value) {
  return window.eval(`${path} = ${value}`);
}

function initGlobalObject() {
  window.eval(`var ${executorName} = {}`)
}



function createPath(path) {
  let elements = path.split('.');
  elements = elements[0] === executorName ? elements.slice(1) : elements;
  const initPath = `window.${executorName}`;
  const fullPath = elements.reduce(function (accumulator, currentValue) {
    const p = accumulator.concat(`.${currentValue}`);
    if (typeof getValue(p) === 'undefined')
      setValue(p, '{}');
    return p;
  }, initPath);
  return fullPath
}

function appendToVariable(path, value) {
  const fullPath = createPath(path);
  setValue(fullPath, value);
}

function appendToExecutor(path, value) {
  appendToVariable(`${executorName}.${path}`, value);
}

function appendCode(path, value) {
  const fullPath = createPath(path);
  setValue(fullPath, )
}

// need return anonym
function strToFunc(funcStr) {
    return new Function(`return ${funcStr}`);
}
const functionRegExp = new RegExp()
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