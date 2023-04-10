const Print = function (dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend(
    {
      noPrint: '.no-print',
      onStart: function () {},
      onEnd: function () {},
    },
    options
  );

  if (typeof dom === 'string') {
    this.dom = document.querySelector(dom);
  } else {
    this.dom = dom;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    let content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend: function (obj, obj2) {
    for (let k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    let str = '';
    let styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str +=
      '<style>' +
      (this.options.noPrint ? this.options.noPrint : '.no-print') +
      '{display:none;}</style>';

    return str;
  },

  getHtml: function () {
    var inputs = document.querySelectorAll('input');
    var textareas = document.querySelectorAll('textarea');
    var selects = document.querySelectorAll('select');
    let cells = document.querySelectorAll('.cell');

    for (var k = 0; k < inputs.length; k++) {
      if (inputs[k].type == 'checkbox' || inputs[k].type == 'radio') {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', 'checked');
        } else {
          inputs[k].removeAttribute('checked');
        }
      } else if (inputs[k].type == 'text') {
        inputs[k].setAttribute('value', inputs[k].value);
      } else {
        inputs[k].setAttribute('value', inputs[k].value);
      }
    }

    for (var k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (var k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        var child = selects[k3].children;
        for (var i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', 'selected');
            } else {
              child[i].removeAttribute('selected');
            }
          }
        }
      }
    }

    const tableNode = document.querySelectorAll(
      '.el-table__header,.el-table__body'
    );
    console.log(tableNode);
    // el-table 打印预览的时候，宽度占满
    for (let k6 = 0; k6 < tableNode.length; k6++) {
      const tableItem = tableNode[k6];
      tableItem.style.width = '100%';
    }

    return this.dom.outerHTML;
  },

  writeIframe: function (content) {
    let w;
    let doc;
    let iframe = document.createElement('iframe');
    let f = document.body.appendChild(iframe);
    iframe.id = 'myIframe';
    iframe.style = 'position:absolute;width:0;height:0;top:-10px;left:-10px;';
    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    this.toPrint(w, function () {
      document.body.removeChild(iframe);
    });
  },

  toPrint: function (w, cb) {
    let _this = this;
    w.onload = function () {
      try {
        setTimeout(function () {
          w.focus();
          typeof _this.options.onStart === 'function' &&
            _this.options.onStart();
          if (!w.document.execCommand('print', false, null)) {
            w.print();
          }
          typeof _this.options.onEnd === 'function' && _this.options.onEnd();
          w.close();
          cb && cb();
        });
      } catch (err) {
        console.log('err', err);
      }
    };
  },
};
const MyPlugin = {};
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print;
};
export default MyPlugin;
