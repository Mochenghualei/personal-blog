---
title: 高频面试题：手写实现Promise🔥
author: shuai
date: "2022-2-9"
categories:
  - 前端
tags:
  - 面试题
---



```js
// 声明变量保存状态
const PENDING = "pending"
const RESOLVE = "resolve"
const REJECT = "reject"

// 声明构造函数，传入状态机
function MyPromise(fn) {
  let that = this
  // 初始化状态为pending
  this.state = PENDING
  // 声明value，保存传入resolve或reject的参数
  this.value = null
  // 声明数据结构，保存then中还处于pending状态下的回调
  this.resolveCallbacks = []
  this.rejectCallbacks = []

  // resolve
  function resolve(val) {
    // 首先判断是否为pending状态，执行完更改状态，以保证每种状态下只执行一次
    if (that.state === PENDING) {
      that.state = RESOLVE
      that.value = val
      that.resolveCallbacks.map((cb) => cb(that.value))
    }
  }
  // reject
  function reject(val) {
    // 首先判断是否为pending状态，执行完更改状态，以保证每种状态下只执行一次
    if (that.state === PENDING) {
      that.state = REJECT
      that.value = val
      that.rejectCallbacks.map((cb) => cb(that.value))
    }
  }

  // 执行状态机
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

// 实现then方法
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  let that = this
  // 因为是可选参数，判断连两个参数的类型是否为函数，不是则给默认值
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (e) => {
          throw e
        }
  // 判断状态，执行相应的回调
  if (that.state === PENDING) {
    that.resolveCallbacks.push(onFulfilled)
  }

  if (that.state === RESOLVE) {
    onFulfilled(that.value)
  }

  if (that.state === REJECT) {
    onRejected(that.value)
  }
}
let pr = new MyPromise((resolve, reject) => {
  resolve(666)
  reject("err")
})

pr.then(
  (res) => console.log(res),
  (err) => console.log(err)
)
```

