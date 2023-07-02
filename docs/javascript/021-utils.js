/**
 * 将 get 链接上的参数变成对象
 * @param {string} str - ?classcode=139
 * @return {object} {classcode: '139'}
 */
export const queryString2Object = str => {
  const obj = {};
  const arr1 = str.split('?');
  const arr2 = arr1[1].split('&');
  for (const i = 0; i < arr2.length; i++) {
    const res = arr2[i].split('=');
    obj[res[0]] = res[1];
  }
  return obj;
};

/**
 * 对象转换为URL查询参数
 * @param {object} obj - {classcode: '139', name: '美术'}
 * @return {string} classcode=139&name=美术
 */
export const object2QueryString = obj => {
  const ret = [];
  for (const key in obj) {
    key = encodeURIComponent(key);
    const values = obj[key];
    if (values && values.constructor == Array) {
      //数组
      const queryValues = [];
      for (let i = 0, len = values.length, value; i < len; i++) {
        value = values[i];
        queryValues.push(toQueryPair(key, value));
      }
      ret = ret.concat(queryValues);
    } else {
      ret.push(toQueryPair(key, values));
    }
  }
  return ret.join('&');
};

const toQueryPair = (key, value) => {
  if (typeof value == 'undefined') return key;
  return key + '=' + encodeURIComponent(value === null ? '' : String(value));
};

/**
 * 格式化金额 将以分为单位转化为以元为单位，2位小数 1,123,121.00
 * @param {string | number} money - 120000
 * @return {string} 120,000.00
 */
export const formateMoney = money => (Number(money) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * 获取指定元素的所有父级对象的索引
 * @param {array} treeData - 要匹配的树
 * @param {string} $selectKey - 要匹配的元素
 * github: https://github.com/chenyin151/GetParentForTree
 */
export const getParentForTree = (treeData, $selectKey) => {
  for (let i = 0; i < treeData.length; i++) {
    const layer = 0;
    const posIndx = [];
    const item = treeData[i];
    if (item.value === $selectKey) {
      return [{ value: item.value, label: item.label }];
    } else {
      const res = scanTree(item, $selectKey, layer, posIndx);
      if (res) return res;
    }
  }
};

/**
 * 扫描树下面的孩子对象
 * @param {object} $item - 要递归遍历的对象
 * @param {string} $value - 要匹配的元素
 * @param {number} $layer - 遍历到哪一级孩子对象
 * @param {array} $posIndx - 用来存储匹配到的元素的所有父级
 * @returns {array} - 匹配到的元素的所有父级
 */
const scanTree = ($item, $value, $layer, $posIndx) => {
  if (!$item.children) {
    $layer -= 1;
    return false;
  }
  $posIndx[$layer] = { value: $item.value, label: $item.label };
  for (let i = 0; i < $item.children.length; i++) {
    const item = $item.children[i];
    if (item.value === $value) {
      $posIndx.push({ value: item.value, label: item.label });
      return $posIndx;
    } else {
      const layer = $layer + 1;
      const node = scanTree(item, $value, layer, $posIndx);
      if (!node && $posIndx.length > 0) {
        $posIndx.length -= 1;
        $posIndx[$layer] = { value: $item.value, label: $item.label };
      }
      if (node) return node;
    }
  }
};

/**
 * 在子级的value添加父级的value
 * @param {array} sources
 * @return {array} sources
 */
export const formateTreeSelect = sources => {
  if (Object.prototype.toString.call(sources) !== '[object Array]') {
    return [];
  }
  let result = sources;
  for (let item of result) {
    if (item.children) {
      addKeys(item.children, item.value);
    }
  }
  return result;
};

/**
 * 在子级的value添加父级的value
 * @param {array} children
 * @param {string} pValue
 */
const addKeys = (children, pValue) => {
  for (let subItem of children) {
    subItem.value = `${pValue}-${subItem.value}`;
    let subKey = subItem.value;
    if (subItem.children) {
      addKeys(subItem.children, subKey);
    }
  }
};

/**
 * List 转为 Tree
 * @param {array} data
 * @param {string} parentKeyName
 * @param {string} childKeyName
 * @return {array} tree
 */
export const formateListToTree = (data, parentKeyName, childKeyName) => {
  let parents = data.filter(item => item[parentKeyName] === 0),
    children = data.filter(item => item[parentKeyName] !== 0);
  dataToTree(parents, children);
  return parents;
  function dataToTree(parents, children) {
    parents.map(p => {
      children.map((c, i) => {
        if (c[parentKeyName] === p[childKeyName]) {
          let _children = JSON.parse(JSON.stringify(children));
          _children.splice(i, 1);
          dataToTree([c], _children);
          if (p.children) {
            p.children.push(c);
          } else {
            p.children = [c];
          }
        }
      });
    });
  }
};

/**
 * 返回 Tree 的数据 转换为 Array 数据格式
 * @param {array} nodes - Tree
 * @return {array} arr - Array
 */
export const formatListData = nodes => {
  let arr = [];
  function fn(tree) {
    for (let i = 0; i < tree.length; i++) {
      arr.push(tree[i].key);
      if (tree[i].children && tree[i].children.length > 0) {
        fn(tree[i].children);
      }
    }
  }
  fn(nodes);
  return arr;
};

/**
 * Tree 改变键值
 * @param {array} data
 * @param {string} newTitle
 * @param {string} newKey
 * @param {string} oldTitle
 * @param {string} oldKey
 * @return {array} treeData
 */
export const formatTreeData = (arr, newTitle, newKey, oldTitle, oldKey) => {
  let treeData = [];
  for (let i = 0; i < arr.length; i++) {
    let item = {
      [newKey]: arr[i][oldKey],
      [newTitle]: arr[i][oldTitle]
    };
    if (arr[i].children && arr[i].children.length > 0) {
      item.children = formatTreeData(arr[i].children, newTitle, newKey, oldTitle, oldKey);
    }
    treeData.push(item);
  }
  return treeData;
};
