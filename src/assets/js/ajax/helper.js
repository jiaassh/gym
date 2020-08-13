/**
 * Array
 **/

// 数组对象去重
function arrUnique(arr, field) {
	const res = new Map();
	return arr.filter(val => {
		!res.has(val[field]) && res.set(val[field], 1)
	})
}




// 数组是否存在且长度大于0
function arrIsCanMap(arr) {
	return arr && arr.length > 0
}


//创建模板，把数组的值逐个赋值到对象上
function arrSetValueToObj(obj, arr) {
	let res = {};
	Object.keys(obj).map((val, index) => {
		res[val] = arr[index]
	})
	return res;
}

// 将数组转换为逗号分割的字符串
function arrToString(arr,delimiter = ',') {
	let str = "";
	if (arr.length > 0) {
		arr.map((item, index) => {
			item = item.toString()
			str += index != 0 ? delimiter + item : item
		})
		return str
	}
	return ""
}


// 根据指定的字符串，生成字典
function arrToDictionary(arr,valueField,labelField) {
	let dictArr = []
	if(arr.length > 0){
		arr.map(item => {
			dictArr.push({
				value: item[valueField] || null,
				label: item[labelField] || null
			})
		})
	}
	return dictArr
}


/**
 * Object
 **/

// 对象中的键位大于0
function objIsHasKey(obj) {
	return obj && Object.keys(obj).length > 0
}


// 查找字典
function objGetDict(dictionary, value) {
	return dictionary.find(item => {
		return item.value == value
	});
}




// 对象转成url请求的get参数，fe：
// let params = { a : 1, b : 2}
// let url = objSetUrlParamsToString(params)
// url = ?a=1&b=2

function objSetUrlParamsToString(data) {
	let str = "";
	Object.keys(data).forEach(key => {
		str += `&${key}=${data[key]}`
	})
	str = '?' + str.substr(1);
	return str;
}

// 根据字符串，判断深层对象的键位是否存在
function objHasDepthKey(object, path) {

}

// 根据字符串路径，查找这个深度的对象的值
function objFindDepth(object, path) {
	let props = path.split(".");
	for (let i = 0; i < props.length; i++) {
		let p = props[i];
		if (object && object.hasOwnProperty(p)) {
			object = object[p];
		} else {
			return undefined;
		}
	}
	return object;
}

// 根据字符串路径，查找这个深度的对象的里的数组，且判断数组长度
function objFindAndCheckDepthArr(object, path) {
	return arrIsCanMap(objFindDepth(object, path)) || []
}



// 根据字符串路径，设置这个深度的对象的值
function objSetDepthValue(object, path, value) {
	let obj = JSON.parse(JSON.stringify(object))
	let props = path.split(".");
	let newObj = obj;
	for (let i = 0; i < props.length - 1; i++) {
		let p = props[i];
		newObj = newObj[p];
	}
	newObj[props[props.length - 1]] = value
	return obj;
}

// 对象深度合并
function objDeepMerge(obj1, obj2) {
	// let key;
	for (let key in obj2) {
		obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
			objDeepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
	}
	return obj1;
}


// 传入一个数组，移除对象中这个数组所有的值
function objRemoveKey(obj, removeList = []) {
	if (removeList.length == 0 || !objIsHasKey(obj)) {
		return obj
	}

	let res = {};
	Object.keys(obj).map(val => {
		if (!removeList.includes(val)) {
			res[val] = obj[val]
		}
	})
	return res;
}

// 对象遍历
function objMap(obj, callback) {
	if (objIsHasKey(obj)) {
		Object.keys(obj).map((key, index) => {
			return callback({
				key,
				index,
				value: obj[key],
				[key]: obj[key]
			})
		})
	}
	return obj
}

// 设置配置为私有属性，方便简写
function objSetValueToPrivate(obj, target, prefix) {
	objMap(obj, res => {
		target[prefix + res.key] = res.value
	})
	return target
}

// 批量设置对象的值
function objBatchSetValue(obj,fields,value = null) {
	fields.map(item =>{
		obj[item] = value
	})
	return obj
}

// 为对象补充键值对,addConfig是数组则增加同名，是对象则更换
function objAddKeys(obj,addConfig){
	
}





// 转换数据函数
const dataTransform = {
	// 时间戳格式化
	timeFormat(val, set) {
		return timeFormat(val, set)
	},
	//获取时间戳
	timestamp(val, set) {
		return val.getTime();
	},
	// 汉字长度截取，自动追加"..."
	intercept(val, set) {
		return strIntercept(val, set)
	},
	// 字符串截取
	subString(val, set) {
		return val.substring(0, parseInt(set));
	},
	// 把人民币单位从分转换为元
	formatRmb(val, set) {
		let str = (val / 100).toFixed(2) + '';
		let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
		let dot = str.substring(str.length, str.indexOf(".")) //取到小数部分

		return intSum + dot;
	},
	// 价格补零
	addPriceZero(val) {
		return val % 1 === 0 ? val + '.00' : val;
	},
	// 转换类型
	setDataType(val, set) {
		const transValue = {
			int() {
				return parseInt(val);
			},
			string() {
				return val.toString()
			},
		}

		// 没有符合条件则直接原路返回
		if (typeof transValue[set] !== 'function' || val == null) {
			return val;
		}
		return transValue[set]();
	}
}


/**
 * String
 **/
 
// 将逗号分隔的字符串转换成整型数组
function stringToIntArray(str,toInt = true, split = ',') {
	if(str){
		let arr = str.split(split) || []
		let dataIntArr = []
		if(arr.length > 0){
			arr.map(item =>{
				if(item){
					toInt ? dataIntArr.push(+item) : dataIntArr.push(item); 
				}
			})
		}
		return dataIntArr;
	}
	return []
} 

// 获取汉字长度
function strGetLen(str) {
	return str ? str.replace(/[^\x00-\xff]/g, "**").length : 0
}

// 汉字长度截取，末尾自动添加...
function strIntercept(str, size ,addValue = '...') {
	if (strGetLen(str) > size) {
		let len = 0,
			res = "";

		for (let i = 0; i < str.length; i++) {
			len += strGetLen(str.charAt(i));
			if (len >= size) {
				res = str.substring(0, i + 1);
				break;
			}
		}
		return res += addValue;
	}
	return str;
}

// 格式化替换
function strFormat(msg, ruleArr) {
	const arr = dataCheckType(ruleArr, 'Array') ? ruleArr : [ruleArr];

	for (let i = 0; i < arr.length; i++) {
		let re = new RegExp('\\{' + i + '\\}', 'gm');
		msg = msg.replace(re, arr[i]);
	}
	return msg;
}


/**
 * Common
 **/


// 验证数据类型
function dataCheckType(val, checkType) {
	let check = false;
	const objToString = Object.prototype.toString;
	const config = {
		'Number': '[object Number]',
		'String': '[object String]',
		'Boolean': '[object Boolean]',
		'Undefined': '[object Undefined]',
		'Null': '[object Null]',
		'Object': '[object Object]',
		'Array': '[object Array]',
		'Function': '[object Function]'
	}
	Object.keys(config).map(key => {
		if (key == checkType && objToString.call(val) == config[key]) {
			check = true
		}
	})
	return check
}




/**
 * Cookie
 **/

function cookieGet(name) {
	let strcookie = document.cookie; //获取cookie字符串
	let arrcookie = strcookie.split("; "); //分割
	//遍历匹配
	for (let i = 0; i < arrcookie.length; i++) {
		let arr = arrcookie[i].split("=");
		if (arr[0] == name) {
			return arr[1];
		}
	}
	return "";
}


/**
 * Date
 **/
 
 // 判断时间戳长度,传入时间戳
 function checkTimeLengthIsTen (date) {
 	return (date && (date + "").length == 10)
 }

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 *  formatDate(); 							// 2016-09-02 13:17:13
	formatDate(new Date(), 'yyyy-MM-dd'); 	// 2016-09-02
	2016-09-02 第3季度 星期五 13:19:15:792
	formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS');
	formatDate(1472793615764); // 2016-09-02 13:20:15
 */
function timeFormat(date, fmt) {
	if (checkTimeLengthIsTen(date)) {
		date = date * 1000;
	}
	date = date == undefined ? new Date() : date;
	date = typeof date == 'number' ? new Date(date) : date;
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj = {
		'y': date.getFullYear(), // 年份，注意必须用getFullYear
		'M': date.getMonth() + 1, // 月份，注意是从0-11
		'd': date.getDate(), // 日期
		'q': Math.floor((date.getMonth() + 3) / 3), // 季度
		'w': date.getDay(), // 星期，注意是0-6
		'H': date.getHours(), // 24小时制
		'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
		'm': date.getMinutes(), // 分钟
		's': date.getSeconds(), // 秒
		'S': date.getMilliseconds() // 毫秒
	};
	var week = ['天', '一', '二', '三', '四', '五', '六'];
	for (var i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
			var val = obj[i] + '';
			if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
			for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
}



// 将数组中的2个时间戳分别赋值给对象的起始时间和截止时间
function timeArrSlice(target,config = {}) {
	const defaultConfig = {
		startTimeField:'startTime',
		endTimeField:'endTime',
		timeArrField:'times',
		length:10,
		toLastSecond:true,//如果起始时间和截止时间相同，且都为凌晨，则截止时间改成23:59:59
	}
	config = Object.assign({},defaultConfig,config);
	
	const isTen = config.length == 10;
	const {timeArrField,startTimeField,toLastSecond,endTimeField} = config;
	const timeArr = target[timeArrField] || [];
	
	if(timeArr.length > 1){
		const sTime = timeArr[0],eTime = timeArr[1];
		let startTime = isTen ? sTime / 1000 : sTime;
		let endTime = isTen ? eTime / 1000 : eTime;
		if(toLastSecond){
			endTime = timeToLastSecond(endTime,isTen)
		}
		
		target[startTimeField] = startTime;
		target[endTimeField] = endTime;
	}
	return target
}
//验证手机号
function isPhone(val) {
	return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(val)
}


// 当日凌晨时间转换成最后一秒
function timeToLastSecond(time,isTen = true){
	time = time + 60 * 60 * 24 - 1
	return isTen ? time : time * 1000
}

//转换时间
function totimesearch(target,config={}) {
	const defaultConfig={
		startTimeField:'startTime',
		endTimeField:'endTime',
		timeArrField:'times',
	};
	config = Object.assign( target,defaultConfig,config)
	const {timeArrField,startTimeField,endTimeField} = config;
	let  allTime= target[timeArrField] || []
	let sTime;
	let eTime ;
	if (allTime != null && allTime != "") {
		sTime = allTime[0];
		eTime = allTime[1];
		if (sTime <= eTime) {
			let str = eTime.substring(0, 11);
			eTime = `${str}23:59:59`;
		}
	} else {
		sTime = "";
		eTime = "";
	}
	target[startTimeField] = sTime;
	target[endTimeField] = eTime;
	return target
}

// 打印log
function log(data, style = 'table') {
	console[style](data);
}



// 导出
export default {
	dataTransform,
	dataCheckType,
	arrUnique,
	arrIsCanMap,
	arrSetValueToObj,
	arrToDictionary,
	arrToString,
	objIsHasKey,
	objGetDict,
	objFindDepth,
	objFindAndCheckDepthArr,
	objSetDepthValue,
	objRemoveKey,
	objMap,
	objDeepMerge,
	objSetValueToPrivate,
	objBatchSetValue,
	strGetLen,
	strIntercept,
	strFormat,
	stringToIntArray,
	timeFormat,
	timeArrSlice,
	timeToLastSecond,
	cookieGet,
	log,
	totimesearch,
	isPhone
}
