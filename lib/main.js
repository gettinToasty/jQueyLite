const DOMNodeCollection = require('./dom_node_collection');

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
