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
