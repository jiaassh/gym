
// 环境常量
import constant from './constant.js'

const SYSTEM_WEB = constant.SYSTEM_WEB
const SYSTEM_MINI_PROGRAM = constant.MINI_PROGRAM.SYSTEM

//如果接口配置错误时默认错误码
const RES_ERROR_STATE_CODE = 2000;

// ajax库
let axios = undefined;

// mockjs库
let Mock = undefined;

// 请求类
class HttpRequestClass{
	constructor(api) {
		const {system,httpSuccessCode,httpStateField,getThrowText} = api;
		
		this._api = api;//接口配置
		this._system = system;//系统环境
		this._httpSuccessCode = httpSuccessCode;//见公共配置
		this._httpStateField = httpStateField;//见公共配置
		this._getThrowText = getThrowText;//见公共配置
		this._requestInstance = undefined;//请求实例（Promise）
		this._sendConfig = {};//兼容各框架的配置
		this._axios = new Function();//axios实例
		this._miniProgram = new Function();//小程序实例
		
		this.init();
		return this._requestInstance;
	}
	
	// 初始化
	init(){
		this.setRequestConfigAdapter();
		this.setSendToken();
		this.setSendPage();
		this.judgeEnvironment();
	}
	
	
	
	// 提取保存的token
	setSendToken(){
		const {tokenTestValue,tokenSendPostion,system,tokenSendField,tokenAutoSend} = this._api;
		const saveToken = system == SYSTEM_MINI_PROGRAM
			? wx.getStorageSync(tokenSendField)
			: localStorage[tokenSendField];
			
		const token = tokenTestValue ? tokenTestValue : saveToken;
		if(token && tokenAutoSend){
			if(['params','header','headers'].includes(tokenSendPostion)){
				this._sendConfig[tokenSendPostion][tokenSendField] = token
			}
		}
	}
	
	// 判断环境
	judgeEnvironment(){
		if(this._api.mock){
			this._requestInstance = this.mockGetPromise()
		}else{
			this._requestInstance = (this._system == SYSTEM_WEB)
				? this.axiosGetPromise()
				: this.miniProgramGetPromise();
		}
		
	}
	
	// 获取catch
	getReject(state = RES_ERROR_STATE_CODE,errorData = {}) {
		return Promise.reject({state,errorData,msg: this._getThrowText(state)})
	}
	
	// 设置请求method
	setMethod(val) {
		return ['post', 'get', 'put', 'delete'].includes(val) ? val : 'post';
	}
	
	//是否发送分页
	setSendPage(){
		let {pageAutoSend,pageIndex,pageIndexField,pageSize,pageSizeField,params} = this._api;
		if(pageAutoSend){
			params[pageIndexField] = pageIndex;
			params[pageSizeField] = pageSize;
		}
	}
	
	
	//设置请求跨平台配置适配
	setRequestConfigAdapter() {
		let {url,params,httpHeader,httpMethod,httpTimeOut,httpResponseType} = this._api;
		let pushConfig = {},baseConfig = {url, method:httpMethod,responseType:httpResponseType || null}
		
		pushConfig = this._system == SYSTEM_WEB 
			? {params,timeout:httpTimeOut,headers:httpHeader}
			: {data:params,header:httpHeader}
		
		this._sendConfig = Object.assign({},baseConfig,pushConfig);
	}
	
	//小程序请求实例
	miniProgramGetPromise() {
		const { url, data,header, method } = this._sendConfig;
		const {requestLoading,requestLoadingMsg,resDataField} = this._api;
		
		return new Promise((resolve, reject) => {
			if (requestLoading){
				wx.showLoading({title: requestLoadingMsg,mask: true})
			}
		 
			wx.request({
				url,data,method,header,
				success: res => {
					wx.hideLoading();
					const state = res[this._httpStateField];
					return state != this._httpSuccessCode
						? reject({ state, msg: this._getThrowText(state) })
						: resolve(res[resDataField])
				},fail: error => {
				  wx.hideLoading();
				  return reject(error)
				}
			})
		})
	}
	
	// 获取mock数据，并返回promise
	mockGetPromise(){
		if(!Mock){Mock = require('mockjs')};
		const {httpMethod,resDataField,resSuccessCode,resMsgField,resMsgText,mockConfig,resStateFields,httpStateField,httpSuccessCode,mockParams,resFieldRemark,paramsFieldRemark} = this._api;
		let res = Mock.mock({
			[httpStateField]:[httpSuccessCode],
			[resDataField]:{
				[resStateFields[0]]:resSuccessCode,
				[resMsgField]:resMsgText,
				[resDataField]: mockConfig || {},
				mockParams:mockParams || {},
				resFieldRemark:resFieldRemark || [],
				paramsFieldRemark:paramsFieldRemark || [],
				httpMethod
			},
		})
		return Promise.resolve(res[resDataField]);//约定只返回正确的数据
	}
	
	//原生（半成品）
	getDefaultPromise(){
		const ajaxPromise = params => {
			return new Promise((resovle, reject) => {
				let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				xhr.open(params.type || "get", params.url, true);
				xhr.send(params.data || null);
				xhr.onreadystatechange = () => {
					if(xhr.readyState === 4){
						let res = JSON.parse(xhr.responseText);
						xhr.status === 200 ? resovle(res) : reject(res);
					 }
				}
			})
		}
	}
	
	//axios引入
	axiosGetPromise(){
		if(!axios){axios = require('axios')};
		['CreateInstance','SetRequest','SetResponse'].map(func => {
			this[`axios${func}Config`]()
		});
		return this.axiosGetRequest();
	}
	
	// 创建axios实例
	axiosCreateInstanceConfig() {
		this._axios = axios.create(this._sendConfig)
	}
	
	// 发送请求前
	axiosSetRequestConfig(){
		this._axios.interceptors.request.use(config => {
			if(config.method == 'post'){
				config.params = {};
			}
			return config;
		}, error => {
			return Promise.reject(error)
		})
	}
	
	//获取结果后
	axiosSetResponseConfig(){
		this._axios.interceptors.response.use(res => {
			return res[this._httpStateField] != this._httpSuccessCode 
				? this.getReject(resCode)
				: Promise.resolve(res[this._api.resDataField])
			},error => {
				const state = error.response && error.response.status ? error.response.status : 503;
				return this.getReject(state,error)
			}
		)
	}
	
	// 获取发送的请求
	axiosGetRequest(){
		const {method,url,params} = this._sendConfig;
		return this._axios[this.setMethod(method)](url, params)
	}	
}


export default HttpRequestClass

