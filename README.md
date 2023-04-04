# @mrli-utils/asyncpool

promise并发请求控制


在做node中台时候，要转发后端dubbo服务为前端提供http服务，经常遇到这样的需求，
前端上传excel文件到node, node解析到数据后，批量对数据进行校验，校验需要调后dubbo接口，但是后台的接口不支持批量校验，又或者导出Excel的时候，后端仅有分页借口，
而且excel数据量有时候很大，比如几万条，若使用promise.all并发一次2000甚至几万个请求，服务器内存会爆炸，有很多请求因为阻塞而处于等待状态，最终失败，
这个并发控制就可以很好的解决问题

# 使用
## 1. 安装
```bash
$ npm install @mrli-utils/asyncpool --save
```
## 2. 引入
```js
/* Nodejs */
const { asyncPool } = require("@mrli-utils/asyncpool");

/* 浏览器 */
import { asyncPool } from '@mrli-utils/asyncpool'
```

## 3. 使用示例
```js
// 真是的请求函数
function getPageList(filter, page) {
 return axios.get('/xxxxx',{
    method:'GET',
    params:{ filter, page }
 })
}

// 每次请求的参数， 有个数组元素就会发出几次请求， 这里是5次
let paramsArray = [
  [{name:'xxx'}, {pageSize:100, pageNum: 1}],
  [{name:'xxx'}, {pageSize:100, pageNum: 2}],
  [{name:'xxx'}, {pageSize:100, pageNum: 3}],
  [{name:'xxx'}, {pageSize:100, pageNum: 4}],
  [{name:'xxx'}, {pageSize:100, pageNum: 5}]
];

// 请求示例， 2表示同一时间内最多2个请求
asyncPool(2, paramsArray, getPageList)
  .then(result => {
    console.log("请求结果数组", result); // result是每个请求返回的结果
    const data = [];  // 最终的结果
    result.forEach(res=>{
      // 将请求结果取出来放到同一个数组内
      data.push(res.xxxxx)
    })

    // ... 对请求结果的后续操作

  })
  .catch(e => {
    // 只要paramsArray.length个请求中有一个出错了， 就会进入catch
    console.log("出错了", e);
  });
```

**若需要this, 可用apply, call调用asyncPool**

# 参数说明

`requestLimit`接收三个参数

`limit`
- 类型：Number
- 描述：同一时间发请求的最大数量

`paramsArray`
- 类型：Array[]： 二维数组，若fn接受3个参数， 那么内存数组应该有三项元素， 每一项对应一个参数
- 描述：array里面的每一项都会传递给fn, 有几个参数就会根据limit数据发起请求， 直到所有请求都完成或者有一个出错

`fn`
- 类型：Function
- 描述：真正的异步请求函数,第一个参数是array里面的当前项,第二个参数是整个array





