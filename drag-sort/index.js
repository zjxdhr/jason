/** 
 * 
 drag-item class ['isInPath', 'isBelowLastPath', 'no-action', 'dark']
 html :
 <div id="drag" class="drag-wrap">
  <li class="drag-item"></li>
</div>
 var items = [
      {id: 123, index: 1},
      {id: 223, index: 2},
      {id: 433, index: 3}
    ]
    var dragSort = new DragSort({
      topEl: '#drag',
      flexDirection: 'row', 
      start: function (index) {
      },
      moving: function (index) {
      },
      finish: function (res) {
        if (res) {
          var prev = res.start;
          var next = res.end;
          if (prev < next) {
            next = next - 1;
          }
          var itemsTemp = items.concat();
          var release = itemsTemp.splice(prev, 1)[0];
          itemsTemp.splice(next, 0, release);
          items = itemsTemp;
        }
      }
    });
 */
function DragSort (options) {
  var $ = this.$;
  this.parentEl = $(options.el);
  this.start = options.start;
  this.moving = options.moving;
  this.finish = options.finish;
  this.dragEl = this.parentEl.getElementsByClassName('item');
  this.currentIndex = -1;
  this.init();
}
DragSort.prototype = {
  constructor: DragSort,
  $: function (el) {
    return document.querySelector(el);
  },
  init: function () {
    this._event = new _Event();
    this.bindEvent();
  },
  distroy: function () {
    this._event.emit('distroy');
    this._event.remove('distroy');
  },
  bindEvent: function () {
    var $ = this.$;
    var parentEl = this.parentEl;
    var drag = false;
    var ox, oy, itemsPos, startIndex, lastMoveInIndex;
    var pointIsInPath = this.pointIsInPath;
    var getItemsPos = function () {
      var items = this.dragEl;
      var pos = [];
      for (var i = 0, len = items.length; i < len; i++) {
        pos.push(items[i].getBoundingClientRect())
      }
      return pos
    }
    var dragStart = function (e) {
      e.preventDefault();
      var html = e.target.innerHTML;
      document.body.style.cursor = 'move';
      drag = true;
      var temp = this.createTemp()(html);
      itemsPos = getItemsPos.call(this);
      ox = e.pageX;
      oy = e.pageY;
      startIndex = pointIsInPath(itemsPos, {x: ox, y: oy});
      this.start && this.start(startIndex);
      lastMoveInIndex = startIndex;
      temp.setAttribute('style', 'top:' + oy+ 'px;' + 'left:' + ox + 'px;');
      parentEl.appendChild(temp);
      temp = null;
    }.bind(this);
    var dragMove = function (e) {
      if (drag) {
        ox = e.pageX;
        oy = e.pageY;
        var temp = $('#drag-temp');
        temp.setAttribute('style', 'top:' + oy + 'px;' + 'left:' + ox + 'px;');
        var moveInIndex = pointIsInPath(itemsPos, {x: ox, y: oy});
        if (moveInIndex > -1 && moveInIndex !== lastMoveInIndex) {
          lastMoveInIndex = moveInIndex;
          this.moving && this.moving(moveInIndex);
        }
      }
    }.bind(this);
    var dropDown = function (e) {
      if (drag) {
        ox = e.pageX;
        oy = e.pageY;
        document.body.style.cursor = 'auto';
        var temp = $('#drag-temp');
        parentEl.removeChild(temp);
        var dropInIndex = pointIsInPath(itemsPos, {x: ox, y: oy});
        if (dropInIndex > -1 && dropInIndex !== startIndex) {
          this.finish && this.finish({start: startIndex, end: dropInIndex});
        } else {
          this.finish && this.finish();
        }
        temp = null;
        itemsPos = null;
      }
      drag = false;
    }.bind(this);
    // 绑定鼠标事件
    parentEl.addEventListener('mousedown', dragStart, true);
    window.addEventListener('mousemove', dragMove, false);
    window.addEventListener('mouseup', dropDown, false);
    // 生命周期结束卸载所绑定的事件
    this._event.on('distroy', function () {
      parentEl.removeEventListener('mousedown', dragStart);
      window.removeEventListener('mousemove', dragMove);
      window.removeEventListener('mouseup', dropDown);
    })
  },
  pointIsInPath: function (paths, point) {
    var index = -1;
    var len = paths.length;
    for (var i = 0; i < len; i++) {
      var path = paths[i];
      if (point.x > path.left && point.x <path.right && point.y > path.top && point.y < path.bottom) {
        index = i;
        break;
      }
    }
    var path0 = paths[0];
    var pathLast = paths[len-1];
    if (point.x > path0.left && point.x < path0.right && point.y < path0.bottom) {
      index = 0;
    }
    if (point.x > pathLast.left && point.x < pathLast.right && point.y > pathLast.bottom) {
      index = len;
    }
    return index;
  },
  createTemp: function () {
    var result = null;
    return function (html) {
      if (result) {
        return result;
      }
      var div = document.createElement('div');
      div.innerHTML = html;
      div.className = 'tempBox';
      div.id = 'drag-temp';
      return div;
    }
  }
}

function _Event () {
  this.events = {};
}
_Event.prototype = {
  constructor: _Event,
  on: function (key, fn) {
    var cbs = this.events[key] || [];
    cbs.push(fn);
    this.events[key] = cbs;
  },
  emit: function (key, data) {
    var cbs = this.events[key] || [];
    for (var i = 0, len = cbs.length; i < len; i++) {
      var cb = cbs[i];
      cb(data);
    }
  },
  remove: function (key, fn) {
    var cbs = this.events[key];
    if (!cbs) {
      return false;
    }
    if (!fn) {
      cbs.length = 0;
    } else {
      for (var i = cbs.length - 1; i >= 0; i--) {
        var cb = cbs[i];
        if (cb === fn) {
          cbs.splice(i,1)
        }
      }
    }
  }

}