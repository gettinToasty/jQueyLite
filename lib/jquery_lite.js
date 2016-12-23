/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	window.$l = function(arg) {
	  let collection;
	  let queue = [];
	  if (typeof arg === "function") {
	    if (document.readyState === "complete") {
	      arg();
	    } else {
	      queue.push(arg);
	    }
	  } else if (arg instanceof HTMLElement) {
	    collection = new DOMNodeCollection([arg]);
	  } else {
	    let arr = Array.from(document.querySelectorAll(arg));
	    collection = new DOMNodeCollection(arr);
	  }
	  queue.forEach((fn) => {
	    document.addEventListener("DOMContentLoaded", fn);
	  });
	  return collection;
	};

	window.$l.prototype.extend = function(...objs) {
	  let base = objs[0];
	  let keys = base.entries.map((el) => {
	    return el[0];
	  });
	  objs.slice(1).forEach((obj) => {
	    obj.entries.forEach((entry) => {
	      if(!(base.keys.includes(entry[0]))) {
	        base[entry[0]] = entry[1];
	      }
	    });
	  });
	  return base;
	};

	window.$li.prototype.ajax = function(request) {
	  const defaults = {method: 'GET',
	                    type: 'GET',
	                    data: {},
	                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	                    url: document.location.pathname,
	                    success: function(data) { console.log(data); },
	                    error: function() { console.log("error"); }
	                  };
	  request = this.extend(request, defaults);
	  const xhr = new XMLHttpRequest();
	  xhr.open(request['method'], request['url']);
	  xhr.onload = function() {
	    if(xhr.status === 200) {
	      request["success"](JSON.parse(xhr.response));
	    } else {
	      request["error"](JSON.parse(xhr.response));
	    }
	  };
	  xhr.send(request["data"]);
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(HTMLElements) {
	    this.HTMLElements = HTMLElements;
	  }

	  html(string) {
	    if(string) {
	      this.HTMLElements.forEach((el) => {
	        el.innerHTML = string;
	      });
	    } else {
	      return this.HTMLElements[0].innerHTML;
	    }
	  }

	  empty() {
	    return this.html(new String());
	  }

	  append(args) {
	    this.HTMLElements.forEach((el) => {
	      if(typeof args === 'string') {
	        el.innerHTML += args;
	      } else {
	        args.forEach((arg) => {
	          arg.remove();
	          el.appendChild(arg.outerHTML);
	        });
	      }
	    });
	  }

	  attr(attrName, val) {

	    if(val) {
	      this.HTMLElements.forEach((el) => {
	        el.setAttribute(attrName, val);
	      });
	    } else {
	      let elem = this.HTMLElements.find((el) => {
	        el.getAttribute(attrName);
	      });
	      return elem.getAttribute(attrName);
	    }
	  }

	  addClass(className) {
	    this.HTMLElements.forEach((el) => {
	      el.className += ` ${className}`;
	    });
	  }

	  removeClass(className) {
	    this.HTMLElements.forEach((el) => {
	      let classes = el.className;
	      el.className = classes.replace(new RegExp('\\s+'+className), "");
	    });
	  }

	  children() {
	    let children = [];
	    this.HTMLElements.forEach((el) => {
	      let collection = Array.from(el.children);
	      children = children.concat(collection);
	    });
	    return new DOMNodeCollection(children);
	  }

	  parent() {
	    let parents = [];
	    this.HTMLElements.forEach((el) => {
	      parents.push(el.parentElement);
	    });
	    return new DOMNodeCollection(parents);
	  }

	  find(selector) {
	    let found = [];
	    this.children().HTMLElements.forEach((el) => {
	      if(el.outerHTML.includes(selector)) {
	        found.push(el);
	      }
	    });
	    return new DOMNodeCollection(found);
	  }

	  remove() {
	    this.HTMLElements.forEach((el) => {
	      el.remove();
	    });
	  }

	  on(type, callback) {
	    this.HTMLElements.forEach((el) => {
	      el.setAttribute("callback", callback);
	      el.addEventListener(type, callback);
	    });
	  }

	  off(type) {
	    this.HTMLElements.forEach((el) => {
	      el.removeEventListener(type, el.getAttribute("callback"));
	    });
	  }


	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);