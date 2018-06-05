使用说明：

html 结构:

drag-item 需要添加的类名 class ['isInPath', 'isBelowLastPath', 'no-action', 'dark']

isInPath: 鼠标拖拽进入item

isBelowLastPath: 鼠标拖拽到最后一个item之后

no-action: 鼠标拖拽进入item时不需要任何相应

dark: 被鼠标选中拖拽的item的状态

 <div id="drag" class="drag-wrap">
 
  <li class="drag-item"></li>
  
</div>

js DragSort调用
 
```
var items = [
  {id: 123, index: 1},
  {id: 223, index: 2},
  {id: 433, index: 3}
]
    
var dragSort = new DragSort({
  topEl: '#drag',
  flexDirection: 'row', 
  start: function (index, parentIndex) {
    // parentIndex 第几个列表（有可能有多个可排序的列表）
    // 可在第index个item 加dark classname,表示被选中拖拽
  },
  moving: function (index) {
    // 可在第index个item 加isInPath classname,表示鼠标经过的item
    // index === items.length 时 可在第index个item 加isBelowLastPath classname,表示在最后一个item之后插入item
  },
  finish: function (res) {
    if (res) {
      var prev = res.start;
      var next = res.end;
      if (prev < next) {
        next = next - 1;
      }
      // items第prev个item与第next个item调换顺序
      var itemsTemp = items.concat();
      var release = itemsTemp.splice(prev, 1)[0];
      itemsTemp.splice(next, 0, release);
      items = itemsTemp;
    }
  }
});
```
