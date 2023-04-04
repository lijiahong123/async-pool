/**
 * @function 并发控制核心函数
 * @param {Number} limit 同一时间内并发的最大请求数量, 默认为1
 * @param {any[]} requestParams 参数二维数组array里面的每一项都会通过apply传递给fn 例如[[{page:1,rows:10,},{name:'xxx', age:12}], []]
 * @param {Function} requestFn 用户真正的异步请求函数,第一个参数是array里面的当前项
 * @return Promise
 * @author 1471363285@qq.com 2022-02-08
 */
 async function asyncPool(limit = 1, requestParams = [], requestFn) {
    if (typeof requestFn !== 'function') throw new Error('缺少真实请求函数')
    asyncPool._RESULT = []; // 结果集合
    asyncPool._pool = []; // 请求池
    for (const params of requestParams) {

        if (!Array.isArray(params)) throw new TypeError("请求参数需要放到一个数组里面， 例如[[{page:1,rows:10,},{name:'xxx', age:12}], []]");

        const task = Promise.resolve().then(() => requestFn.apply(this, params))
        asyncPool._RESULT.push(task)

        if (requestParams.length >= limit) {
            const e = task.then(() => asyncPool._pool.splice(asyncPool._pool.indexOf(e), 1));
            asyncPool._pool.push(e);
            if (asyncPool._pool.length >= limit) {
                await Promise.race(asyncPool._pool)
            }
        }
    }
    return Promise.all(asyncPool._RESULT)
}

export default asyncPool;
