/**
 * 通用js方法封装处理
 * Copyright (c)
 */

export function dispatch(componentName, eventName, params) {
  var parent = this.$parent || this.$root;
  var name = parent.$options.componentName;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.componentName;
    }
  }
  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
}
export function initNew(data) {
  delete data.id;
  delete data.createId;
  delete data.createDate;
  delete data.createdBy;
  delete data.creationDate;
  delete data.modifyId;
  delete data.modifyDate;
  return data;
}
// 数字取舍
export function initDig(val) {
  if (
    !val ||
    typeof val === "object" ||
    !val.toString().length ||
    Number(val) < 0
  )
    return 0;
  val = Number(val);
  if (val < 1) return 0.01;
  val = initNumber(val, 0);
  let length = val.toString().length - 1;
  return Math.pow(10, length) / 100;
}
// 获取周数
export function getWeek(val) {
  console.log(val);
  let endDate = new Date(val);
  //本年的第一天
  var beginDate = new Date(endDate.getFullYear(), 0, 1);
  //星期从0-6,0代表星期天，6代表星期六
  var endWeek = endDate.getDay();
  if (endWeek == 0) endWeek = 7;
  var beginWeek = beginDate.getDay();
  if (beginWeek == 0) beginWeek = 7;
  //计算两个日期的天数差
  var millisDiff = endDate.getTime() - beginDate.getTime();
  var dayDiff = Math.floor(
    (millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000
  );
  return Math.ceil(dayDiff / 7) + 1;
}

// 数字取舍
export function initNumber(val, dig = 2, type = "round") {
  if (val === undefined || val === null || val === "") return "";
  val = Number(val);
  if (type == "ceil")
    return Math.ceil(val * Math.pow(10, dig)) / Math.pow(10, dig);
  if (type == "floor")
    return Math.floor(val * Math.pow(10, dig)) / Math.pow(10, dig);
  if (type == "round")
    return Math.round(val * Math.pow(10, dig)) / Math.pow(10, dig);
  return (val * Math.pow(10, dig)) / Math.pow(10, dig);
}
// 瓜分总额
export function initDivideNumber(model, total, index, valName) {
  if (!model || !model.length || !total || !valName) return;
  let left = total - model[index][valName];
  let indexBox = [],
    tempIndex = index,
    noLeft = false;
  for (let i = 0; i < model.length; i++) {
    indexBox.push(tempIndex);
    tempIndex = tempIndex == model.length - 1 ? 0 : tempIndex + 1;
  }
  indexBox.splice(0, 1);
  indexBox.reverse();
  indexBox.forEach((i, $i) => {
    if ($i == indexBox.length - 1) {
      model[i][valName] = left;
    } else {
      if (left < model[i][valName]) {
        model[i][valName] = left;
        left = 0;
      } else {
        left = left - model[i][valName];
      }
    }
  });
}
// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) return null;
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time))
      time = parseInt(time);
    else if (typeof time === "number" && time.toString().length === 10)
      time = time * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) value = "0" + value;
    return value || 0;
  });
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = params;
  search.params = {};
  if (null != dateRange && "" != dateRange) {
    if (typeof propName === "undefined") {
      search.params["beginTime"] = dateRange[0];
      search.params["endTime"] = dateRange[1];
    } else {
      search.params["begin" + propName] = dateRange[0];
      search.params["end" + propName] = dateRange[1];
    }
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue == "" + value) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join("");
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue == "" + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    });
  });
  return actions.join("").substring(0, actions.join("").length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}
// 格式化html
export function initInnerHtml(html = "") {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match
      .replace(/height="[^"]+"/gi, "")
      .replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
    match = match
      .replace(/width:[^;]+;/gi, "max-width:100%;")
      .replace(/width:[^;]+;/gi, "max-width:100%;");
    return match;
  });
  newContent = newContent.replace(
    /\<img/gi,
    '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"'
  );
  return newContent;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children",
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] instanceof Array
        ? o[config.childrenList].push(...(childrenListMap[o[config.id]] || []))
        : (o[config.childrenList] = childrenListMap[o[config.id]]);
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

// RBG转HSL
export function rgb2hsl(rgb) {
  let r, g, b;
  if (rgb instanceof Array) {
    r = rgb[0] / 255;
    g = rgb[1] / 255;
    b = rgb[2] / 255;
  } else {
    r = arguments[0] / 255;
    g = arguments[1] / 255;
    b = arguments[2] / 255;
  }
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  var H = h * 360;
  var S = s * 100;
  var L = l * 100;
  return [H, S, L];
}
// HEX转RGB, arrayRGB:是否转为数组RGB
export function hex2rgb(hex, arrayRGB) {
  var sColor = hex.toLowerCase();
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return arrayRGB ? sColorChange : "RGB(" + sColorChange.join(",") + ")";
  }
  return sColor;
}
// HEX转HSL
export function hex2hsl(HEX) {
  const rgb = hex2rgb(HEX, true);
  return rgb2hsl(rgb);
}
// 颜色混合
export function mixColor(c1, c2 = "#FFFFFF", rate = 0.9) {
  rate = Math.max(Math.min(Number(rate), 1), 0);
  let r1 = parseInt(c1.substring(1, 3), 16);
  let g1 = parseInt(c1.substring(3, 5), 16);
  let b1 = parseInt(c1.substring(5, 7), 16);
  let r2 = parseInt(c2.substring(1, 3), 16);
  let g2 = parseInt(c2.substring(3, 5), 16);
  let b2 = parseInt(c2.substring(5, 7), 16);
  let r = Math.round(r1 * (1 - rate) + r2 * rate);
  let g = Math.round(g1 * (1 - rate) + g2 * rate);
  let b = Math.round(b1 * (1 - rate) + b2 * rate);
  r = ("0" + (r || 0).toString(16)).slice(-2);
  g = ("0" + (g || 0).toString(16)).slice(-2);
  b = ("0" + (b || 0).toString(16)).slice(-2);
  return "#" + r + g + b;
}
// 图表颜色
export function initGraphColor(length, baseColor = "#428BCA", alpha = 0.95) {
  let res = [];
  const each = initNumber(alpha / length, 4, "ceil");
  for (let i = 0; i < alpha; i = i + each) {
    res.push(mixColor(baseColor, "#ffffff", i));
  }
  return res;
}

// 深拷贝
export function clone(data) {
  if (!data || typeof data === "number") return data;
  if (typeof data === "string") return data.includes("{") || data.includes("[") ? JSON.parse(data) : data;
  return JSON.parse(JSON.stringify(data));
}
// 软拷贝(浅) object:当前对象 target:待拷贝对象
export function softClone(object, target) {
  if (!object || typeof object !== "object" || typeof target !== "object") return object;
  for (let i in object) {
    if (target.hasOwnProperty(i)) object[i] = target[i];
  }
}
// 硬拷贝(浅) object:当前对象 target:待拷贝对象
export function hardClone(object, target) {
  if (!object || typeof object !== "object" || typeof target !== "object") return object;
  for (let i in target) {
    if (target.hasOwnProperty(i)) object[i] = target[i];
  }
}
//数组转对象
export function arr2obj(arr, keyName) {
  let res = {},
    name;
  if (arr && arr.length) {
    if (keyName && typeof keyName === "string" && arr[0][keyName])
      name = keyName;
    arr.forEach((item, index) => {
      if (name) {
        if (item[name]) res[item[name]] = item;
      } else {
        res[index.toString()] = item;
      }
    });
  }
  return res;
}
//对象转数组
export function obj2arr(obj, keyName = "id") {
  let res = [],
    name,
    keys = obj && Object.keys(obj);
  if (keys.length) {
    name = keyName;
    res = keys.map((item, index) => {
      let rowObj = obj[item];
      if (!index && rowObj.hasOwnProperty(keyName) && rowObj[keyName] !== item)
        name = "$" + keyName;
      return {
        ...rowObj,
        [name]: item,
      };
    });
  }
  return res;
}
// 扁平转树型
const initParentPath = function (parent, map = {}, res = [], options = {}) {
  if (parent) {
    const grandpa = map[parent[options.pidName]],
      pathItem = parent[options.pathBy];
    if (pathItem) res.unshift(pathItem);
    initParentPath(grandpa, map, res, options);
  }
};
export function row2tree(data, $options = {}) {
  const options = {
    idName: "id",
    pidName: "pid",
    childrenName: "children",
    pathBy: "",
    addMethod: "push",
    ...$options,
  };
  let idMap = [],
    res = [];
  data.forEach((item) => {
    idMap[item[options.idName]] = item;
  });
  data.forEach((item) => {
    let parent = idMap[item[options.pidName]];
    if (options.pathBy) {
      let pathList = [];
      if (parent) initParentPath(parent, idMap, pathList, options);
      if (item[options.pathBy])
        pathList.push(item[options.pathBy].replace("/", ""));
      item.$path = pathList.join("/");
    }
    if (parent) {
      if (!parent[options.childrenName]) parent[options.childrenName] = [];
      if (options.addMethod == "push") parent[options.childrenName].push(item);
      else parent[options.childrenName].unshift(item);
    } else {
      if (options.addMethod == "push") res.push(item);
      else res.unshift(item);
    }
  });
  return res;
}
// 树型转扁平
export function tree2row(data, childrenName = "children") {
  let res = [];
  data.forEach((item) => {
    res.push(item);
    item[childrenName] && res.push(...tree2row(item[childrenName]));
  });
  return res;
}
// 在树型中查找行数据
export function findItemInTree(e, tree, idName, childName) {
  if (e === undefined || !tree || typeof tree !== "object") return null;
  let option = { idName: "id", childName: "children" };
  if (idName && typeof idName === "object") {
    option = Object.assign(option, idName);
  } else {
    if (idName) option.idName = idName;
    if (childName) option.childName = childName;
  }
  const $tree = tree instanceof Array ? tree : [tree];
  for (const item of $tree) {
    if (typeof e === "function") {
      // 当e为方法时
      if (e(item)) return item;
    } else {
      // 当e为id时
      if (e == item[option.idName]) return item;
    }
    const res = findItemInTree(e, item[option.childName], option);
    if (res) return res;
  }
  return null;
}
// 计算目标在树形中的路径
export function findItemInTreePath(
  val,
  tree,
  idName = "id",
  childName = "children"
) {
  if (val === undefined || !tree || typeof tree !== "object") return null;
  const $tree = tree instanceof Array ? tree : [tree];
  for (const item of $tree) {
    if (val == item[idName]) return [item];
    if (item[childName]) {
      const res = findItemInTreePath(val, item[childName], idName, childName);
      if (res) {
        res.unshift(item);
        return res;
      }
    }
  }
  return null;
}
// 在树形中查找目标的父节点
export function findParentInTree(
  val,
  tree,
  idName = "id",
  childName = "children"
) {
  if (!val || !tree || typeof tree !== "object") return null;
  const $tree = tree instanceof Array ? tree : [tree];
  for (const item of $tree) {
    if (val == item[idName] || !item[childName]) continue;
    const index = item[childName].findIndex((find) => {
      return find[idName] == val;
    });
    if (index > -1) {
      return item;
    } else {
      const res = findParentInTree(val, item[childName], idName, childName);
      if (res) return res;
    }
  }
  return null;
}
// 数组去重
export function uniquelize(val, idName) {
  let res = [];
  if (val && val instanceof Array && val.length) {
    val.forEach((row) => {
      const index = res.findIndex((all) => {
        return idName === undefined || !row[idName]
          ? JSON.stringify(row) === JSON.stringify(all)
          : all[idName] == row[idName];
      });
      if (index < 0) res.push(row);
    });
  }
  return res;
}
// 数组并集
export function union(val1, val2, idName) {
  return uniquelize(val1.concat(val2), idName);
}
// 数组差集
export function minus(val1, val2, idName) {
  return val1.each((all) => {
    const index = val2.findIndex((row) => {
      return idName === undefined || !row[idName]
        ? JSON.stringify(row) === JSON.stringify(all)
        : all[idName] == row[idName];
    });
    return index < 0 ? all : null;
  });
}
//数组排顺
export function by(name, type = "number", order = "asc") {
  return function (o, p) {
    if (o && p && typeof o === "object" && typeof p === "object") {
      let a = o[name] || "",
        b = p[name] || "";
      if (a === b) return 0;
      if (type == "text") {
        return order == "asc" ? a.localeCompare(b) : b.localeCompare(a);
      } else if (type == "date") {
        a = new Date(a);
        b = new Date(b);
      } else {
        a = Number(a);
        b = Number(b);
      }
      return order == "asc" ? a - b : b - a;
    } else {
      throw "error";
    }
  };
}

//数组换位
export function swap(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// 随机数
export function randomValue(min, max) {
  if (typeof min === "number") {
    if (typeof max === "number") {
      let $min = max > min ? min : max,
        $max = max > min ? max : min;
      return Math.floor(Math.random() * ($max - $min + 1) + $min);
    } else {
      if (min < 1) min = 6;
      return Math.floor(Math.random() * Math.pow(10, min));
    }
  } else if (min instanceof Array) {
    return min[Math.floor(Math.random() * min.length)];
  } else {
    return Math.floor(Math.random() * 1000000);
  }
}

/**
 * 获取URL地址上的参数
 * @param parmName  参数名
 * @returns
 */
export function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

//判断Object是否相等
export function isSame(obj1, obj2) {
  if (!obj1 || !obj2) return obj1 === obj2;
  else if (typeof obj1 === "string" && typeof obj2 === "string")
    return obj1 === obj2;
  else return JSON.stringify(obj1) === JSON.stringify(obj2);
}

//推算时间
export function getDateDiff(begin, end, allResult) {
  let res = "";
  if (!(begin instanceof Date)) begin = new Date(begin);
  const dateTimeStamp = begin.getTime();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  const month = day * 30;
  const year = day * 365;
  const now = end ? new Date(end).getTime() : new Date().getTime();
  const tip = now > dateTimeStamp ? "前" : "后";
  const diffValue =
    now > dateTimeStamp ? now - dateTimeStamp : dateTimeStamp - now;
  const yearC = diffValue / year;
  const monthC = diffValue / month;
  const halfamonthC = diffValue / halfamonth;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  if (allResult) {
    return {
      year: yearC,
      month: monthC,
      halfamonth: halfamonthC,
      week: weekC,
      day: dayC,
      hour: hourC,
      min: minC,
    };
  }
  if (yearC >= 1) {
    res = "" + parseInt(yearC) + "年" + tip;
  } else if (monthC >= 1) {
    res = "" + parseInt(monthC) + "个月" + tip;
  } else if (halfamonthC >= 1) {
    res = "半个月" + tip;
  } else if (weekC >= 1) {
    res = "" + parseInt(weekC) + "周" + tip;
  } else if (dayC >= 1) {
    res = "" + parseInt(dayC) + "天" + tip;
  } else if (hourC >= 1) {
    res = "" + parseInt(hourC) + "小时" + tip;
  } else if (minC >= 1) {
    res = "" + parseInt(minC) + "分钟" + tip;
  } else {
    res = "刚刚";
  }
  return res;
}
// 数字转汉语数字
export function num2text(num) {
  if (Number.isInteger(Number(num)) && Number(num) < 100 && Number(num) > 0) {
    const integerTextArr = [
      "",
      "十",
      "二十",
      "三十",
      "四十",
      "五十",
      "六十",
      "七十",
      "八十",
      "九十",
    ];
    const singleTextArr = [
      "",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
    ];
    let textNum = "";
    if (num < 10) {
      textNum = singleTextArr[num];
    } else {
      let tmpNumArr = String(num).split("");
      textNum = integerTextArr[tmpNumArr[0]] + singleTextArr[tmpNumArr[1]];
    }
    return textNum;
  } else {
    return new Error("turnNumToText 参数必须为整数，且大于0小于100");
  }
}

//推算周期执行日期
export function getNextCycle(val) {
  if (!val) return "";
  let res = "";
  const now = new Date();
  if (val.cycleFrequency == 5) {
    const wDay = now.getDay();
    res =
      (wDay <= Number(val.cycleBegin)
        ? Number(val.cycleBegin) - wDay
        : wDay + 7 - Number(val.cycleBegin)) + "天后";
  } else {
    const nowYear = now.getFullYear(),
      nowMonth = now.getMonth() + 1,
      nowDay = now.getDate();
    let nextYear = nowYear,
      nextMonth = nowMonth,
      nextDay = Number(val.cycleBegin);
    if (val.cycleFrequency == 0) {
      nextMonth = val.cycleBeginInt;
      if (nextMonth < nowMonth || (nextMonth == nowMonth && nextDay < nowDay))
        nextYear++;
    } else if (val.cycleFrequency == 4) {
      if (nextDay < nowDay) {
        if (nextMonth == 12) {
          nextYear++;
          nextMonth = 1;
        } else {
          nextMonth++;
        }
      }
    } else {
      const monthBox =
        val.cycleFrequency == 3
          ? [0, 2, 4, 6, 8, 10]
          : val.cycleFrequency == 2
          ? [0, 3, 6, 9]
          : [0, 6];
      for (let i = 0; i < monthBox.length; i++) {
        const temp = monthBox[i] + val.cycleBeginInt;
        if (temp > nowMonth || (temp == nowMonth && nextDay > nowDay)) {
          nextMonth = temp;
          break;
        } else if (i == monthBox.length - 1) {
          nextMonth = monthBox[0] + val.cycleBeginInt;
          nextYear++;
        }
      }
    }
    const nextMaxDay = new Date(nextYear, nextMonth, 0).getDate();
    if (nextDay > nextMaxDay) nextDay = nextMaxDay;
    res = getDateDiff(nextYear + "-" + nextMonth + "-" + nextDay);
  }
  return res;
}
// 设置样式默认数值(string/number通用)
export function setCssValue(val, defaultVal, unit = "px") {
  if (val === undefined && defaultVal !== undefined) val = defaultVal;
  return typeof val === "number" || /^[1-9][0-9]*(\.[0-9]{1,2}) ? $/.test(val)
    ? val + unit
    : val;
}

export function getAuditRouter(item, params, type) {
  let path = "/Performance/NeedToDealDetail",
    query = {};

  if (item.extraAttribute) {
    query = item.extraAttribute;
  }

  switch (item.taskType) {
    case "ST_PROCESS":
      if (
        item.extraAttribute?.stepTypeCode === "assess_step_type_calibration"
      ) {
        path = "/Performance/PerformanceCalibrate";
      }
      break;
    case "ST_DATA_SOURCE":
      path = "/Performance/DataSource";
      break;
    case "ST_PROCESS_DELIVERY":
      path = "/Performance/PerformanceDelivery";
      break;
    case "INDEX_PERIOD_DATASOURCE":
      path = "/Performance/PerformanceIndexPeriod";
      break;
    case "EVL_PROCESS_EXAM":
      path = "/examination";
      break;
    case "EVL_PROCESS_ASSESS":
      path = "/evaluate/EvaluateExam";
      break;
    case "PFM_APPEAL":
      path = "/hrManagement/Performance/appealList";
      type = null;
      break;
    case "LRN_COURSE_OVERDUE_NOTIFY_CREATE_USER":
      path = "/Learn/Person";
      query.courseId = item.fromId;
      break;
    case "ITG_MONITOR":
      path = "/Integral/ApplicationResult";
      break;
    case "ITG_SUBSCRIBE":
      Object.assign(query, {
        subscribeTime: item.createDate,
      });
      path = "/Integral/SubscribeDetail";
      break;
    case "ITG_TEAM_ASSIGN":
      path = "/Integral/AssignIntegral";
      query = {
        fromId: item.fromId,
      };
      break;
    // -------------
    case "LRN_LIBRARY_BUILD_TASK":
      path = "/Learn/MyLearn";
      query.tab = "libraryTask";
      query.taskId = item.fromId;
      break;
    case "STAFF_APPEAL_HANDLER":
      if (
        item.extraAttribute != null &&
        item.extraAttribute.itemValueMode === 2
      ) {
        path = `/Integral/TeamIntegralAchievement`;
      } else {
        path = `/Integral/IntegralAchievement`;
      }
      break;
    case "STAFF_APPEAL_HR_NOTIFY":
      path = `/hrManagement/Complaint`;
      break;
    case "ASSESS_PROCESS":
      // 新绩效流程
      path = "/Performance/PerformanceAssess";
      params = query;
      break;
    case "ASSESS_PROCESS_ALIGN":
      // 新绩效校准
      path = "/Performance/adjusting";
      params = query;
      break;
    case "ASSESS_PFM_INDEX_DATA":
      // 新绩效外部数据录入
      path = "/Performance/DataEntry";
      params = query;
      Object.assign(params, {
        title: item.title,
      });
      break;
    // --------------------  salary start -----------------------------
    case "SAL_PAYSLIP_SEND":
      // path = `/Integral/IntegralAchievement`;
      // path = `/chatMenu/salaryInfo`;
      path = `/chatMenu/selfHelp`;
      query = query;
      break;
    // --------------------  salary end -----------------------------
  }

  if (params) {
    Object.assign(query, params);
  }

  let result = {
    path,
    query,
  };

  if (type === "string") {
    let queryStr = Object.keys(query).map((key) => `${key}=${query[key]}`);
    result = `${path}?${queryStr.join("&")}`;
  }
  return result;
}

export function isMobile() {
  // UA检测
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|midp|webos|webview|ucweb|iphone|ipad|ipod|blackberry|iemobile|opera mini|windows ce|mobile/i.test(ua);
  // 视口检测
  const isMobileView = window.innerWidth < 992;
  // 综合判断逻辑
  return isMobileUA || isMobileView;
}

// 比较字符串相似度
export function isSimilar(x, y) {
  var z = 0;
  x = x.toUpperCase();
  y = y.toUpperCase();
  x = x.replace("_", "");
  y = y.replace("_", "");
  if (typeof x == "string") {
    x = x.split("");
    y = y.split("");
  }
  var s = x.length + y.length;
  x.sort();
  y.sort();
  var a = x.shift();
  var b = y.shift();
  while (a !== undefined && b != undefined) {
    if (a === b) {
      z++;
      a = x.shift();
      b = y.shift();
    } else if (a < b) {
      a = x.shift();
    } else if (a > b) {
      b = y.shift();
    }
  }
  return (z / s) * 200;
}
// 工作年限
export function initWorkAge(val, isNum) {
  if (!val || val == "0年0个月") return isNum ? 0 : "不满1个月";
  let temp = val.split("年");
  const year = Number(temp[0]);
  const month =
    temp[1] && temp[1].split("个月")[0] ? Number(temp[1].split("个月")[0]) : 0;
  const monthNum = month < 10 ? "0" + month : month;
  const yearStr = year ? year + "年" : "";
  const monthStr = month ? month + "个月" : "";
  return isNum ? Number(year + "." + monthNum) : yearStr + monthStr;
}
// echart axis mix/max
export function minAxis(value, coe = 1.2) {
  const min = Math.abs(Number(value.min));
  const max = Math.abs(Number(value.max));
  return (max > min ? -max * coe : -min * coe).toFixed(2);
}
export function maxAxis(value, coe = 1.2) {
  const min = Math.abs(Number(value.min));
  const max = Math.abs(Number(value.max));
  return (max > min ? max * coe : min * coe).toFixed(2);
}
//10转26进制
export function to26(num) {
  let code = "";
  while (num > 0) {
    let m = num % 26;
    if (m == 0) {
      m = 26;
    }
    code = String.fromCharCode(64 + parseInt(m)) + code;
    num = (num - m) / 26;
  }
  return code;
}
//26转10进制
export function to10($code) {
  const code = $code.toUpperCase();
  let num = 0;
  for (let i = code.length - 1, j = 1; i >= 0; i--, j *= 26) {
    num += (code[i].charCodeAt() - 64) * j;
  }
  return num;
}
// 获取年龄
export function getAge(str) {
  if (!str) return "";
  var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
  if (r == null) return "";
  var d = new Date(r[1], r[3] - 1, r[4]);
  var returnStr = "";
  if (
    d.getFullYear() == r[1] &&
    d.getMonth() + 1 == r[3] &&
    d.getDate() == r[4]
  ) {
    var date = new Date();
    var yearNow = date.getFullYear();
    var monthNow = date.getMonth() + 1;
    var dayNow = date.getDate();
    var largeMonths = [1, 3, 5, 7, 8, 10, 12], //大月， 用于计算天，只在年月都为零时，天数有效
      lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12, // 上一个月的月份
      isLeapYear = false, // 是否是闰年
      daysOFMonth = 0; // 当前日期的上一个月多少天
    if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
      // 是否闰年， 用于计算天，只在年月都为零时，天数有效
      isLeapYear = true;
    }
    var Y = yearNow - parseInt(r[1]);
    var M = monthNow - parseInt(r[3]);
    var D = dayNow - parseInt(r[4]);
    if (D < 0) M--;
    if (M < 0) Y--;
    if (Y < 0) returnStr = "出生日期有误！";
    else returnStr = Y + "岁";
  }
  return returnStr;
}

export const getDateFormat = function (val, format = "YYYY-MM-DD HH:mm") {
  if (typeof val == "string") {
    // 小程序内部new Date不支持YYYY-MM-DD格式；
    val = val.replace(/-/g, "/");
  }
  const date = val ? new Date(val) : new Date();
  format = format.replace("YYYY", date.getFullYear() + "");
  format = format.replace("MM", repaireZero(date.getMonth() + 1));
  format = format.replace("DD", repaireZero(date.getDate()));
  format = format.replace("HH", repaireZero(date.getHours()));
  format = format.replace("mm", repaireZero(date.getMinutes()));
  format = format.replace("ss", repaireZero(date.getSeconds()));
  return format;
};

export function repaireZero(val) {
  val = String(val || 0);
  return val.length === 1 && val != 0 ? `0${val}` : val;
}

export const tableSpanMerge = function ({
  row,
  column,
  rowIndex,
  mergeOptions,
  tableData,
  external,
  columnIndex,
}) {
  let rowspan = 1;
  if (mergeOptions && mergeOptions[column.property]) {
    if (
      rowIndex == 0 ||
      !mergeOptions[column.property](tableData[rowIndex - 1], row)
    ) {
      let index = rowIndex,
        count = 1;
      while (
        index < tableData.length - 1 &&
        mergeOptions[column.property](tableData[index + 1], row)
      ) {
        count++;
        index++;
      }
      rowspan = count;
    } else {
      rowspan = 0;
    }
  }
  let res = {
    rowspan,
    colspan: 1,
  };

  if (external) res = external({ res, row, column, rowIndex, columnIndex });
  return res;
};

export function interDateRange(b1, e1, b2, e2) {
  if ((!e2 && b2 && b2.length != 4) || !b2) return false;
  const year = 1000 * 60 * 60 * 24 * 365,
    now = new Date();
  const max = year * 100;
  b1 = new Date(b1 || now.getTime() - max);
  e1 = new Date(e1 || now.getTime() + max);
  if (!e2) {
    e2 = Number(b2) + 1 + "-01-01";
    b2 = b2 + "-01-01";
  }
  b2 = new Date(b2);
  e2 = new Date(e2);
  if (b1 > e2 || e1 < b2) return false;
  return true;
}

export const isNumber = function (val) {
  const regPos = /^\d+(\.\d+)?$/; //非负浮点数
  const regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  return regPos.test(val) && regNeg.test(val);
};
// 获取字符串中的参数
export const getStrParam = function (str, paramName) {
  if (!str) return null;
  const regex = new RegExp("[?&]" + paramName + "=([^&#]*)");
  const results = regex.exec(str);
  if (!results) return null;
  return decodeURIComponent(results[1].replace(/\+/g, " "));
};
// 向前移动index
export const indexPrev = function (index, list) {
  if (!list || !list.length || !index) return;
  list[index] = list.splice(index - 1, 1, list[index])[0];
};
// 向后移动index
export const indexNext = function (index, list) {
  if (!list || !list.length || index >= list.length - 1) return;
  list[index] = list.splice(index + 1, 1, list[index])[0];
};

export function initContentBrief(content = "") {
  if (!content || content[0] != "<") return content;
  let res = content
    .replace(/<table.*?<\/table>|<img.*?\/>|<a.*?<\/a>|<br>|<input.*?>/g, "")
    .replace(
      /<\/?strong.*?>|<\/?em.*?>|<\/?s.*?>|<\/?u.*?>|<\/?ol.*?>|<\/?ul.*?>/g,
      ""
    )
    .replace(/<p>\s+<\/p>|<p><\/p>|/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<p.*?>|<li.*?>|<div.*?>|<h\d.*?>/g, "\n")
    .replace(/<\/?p.*?>|<\/?li.*?>|<\/?div.*?>|<\/?h\d.*?>/g, "")
    .replace(/^\n/, "");
  return res;
}
export function getLastMonth() {
  let currentDate = new Date();
  let lastMonthYear = currentDate.getFullYear();
  let lastMonth = currentDate.getMonth() + 1;
  // 如果当前月是1月，则上一个月为去年的12月
  if (lastMonth === 1) {
    lastMonthYear = lastMonthYear - 1;
    lastMonth = 12;
  } else {
    lastMonth = lastMonth - 1;
  }
  let data = "";
  if (lastMonth < 10) {
    lastMonth = "0" + lastMonth;
    data = `${lastMonthYear}${lastMonth}`;
  } else {
    data = `${lastMonthYear}${lastMonth}`;
  }
  return data;
}

// 高亮搜索文本
export function getTextNodes(node) {
  var textNodes = [];
  var walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  return textNodes;
}
export function highlightText(searchTerm, node) {
  // 获取节点下的所有文本节点
  if (!node) node = document.body;
  var textNodes = getTextNodes(node);

  // 遍历文本节点，对匹配的文本进行高亮处理
  textNodes.forEach(function (textNode) {
    var text = textNode.nodeValue;
    var regex = new RegExp(searchTerm, "gi");
    var replacedText = text.replace(
      regex,
      "<span class='t-highlight'>$&</span>"
    );
    // 创建一个临时 div 元素来容纳替换后的文本
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = replacedText;
    // 将临时 div 中的子节点插入到原来的文本节点中
    while (tempDiv.firstChild) {
      textNode.parentNode.insertBefore(tempDiv.firstChild, textNode);
    }
    // 移除原来的文本节点
    textNode.parentNode.removeChild(textNode);
  });
}

export function uniqueByKey(array, key){
  if (array && array instanceof Array && array.length > 0){
    return array.reduce((acc, item) => {
      if (!acc.some(i => i[key] === item[key])) {
        acc.push(item);
      }
      return acc;
    }, []);
  }else {
    return [];
  }
}


export function getCurrentDate(format) {
  const now = new Date();
  format = format ? format : "YYYY-MM-DD HH:mm:ss";
  const map = {
    'yyyy': now.getFullYear(),
    'MM': String(now.getMonth() + 1).padStart(2, '0'), // 月份从0开始，需加1
    'dd': String(now.getDate()).padStart(2, '0'),
    'HH': String(now.getHours()).padStart(2, '0'),
    'mm': String(now.getMinutes()).padStart(2, '0'),
    'ss': String(now.getSeconds()).padStart(2, '0')
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => map[match]);
}

export function updateObjectVal(taregt, sources, emptyUpdate) {
  for (let key in sources) {
    if (taregt.hasOwnProperty(key)) {
      let newVal = sources[key];
      if (emptyUpdate){
        taregt[key] = newVal;
      }else {
        if (newVal !== undefined && newVal !== null && newVal !== "undefined" && newVal !=="null"){
          taregt[key] = newVal;
        }
      }
    }
  }
}

