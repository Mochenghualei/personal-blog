---
title: 【高频面试题】：手写实现call、apply、bind🔥
author: shuai
date: "2022-2-11"
categories:
  - 前端
tags:
  - 面试
---

```js
// 简单手写call
Function.prototype.myCall = function (context) {
  if (!typeof this === "function") {
    throw new TypeError("err")
  }
  // 保存上下文,不传则为window
  context = context || window
  // 获取参数
  let args = [...arguments].slice(1)
  // 上下文添加fn，执行后删除
  context.fn = this
  let result = context.fn(...args)
  delete context.fn
  return result
}

// 简单手写apply
Function.prototype.myApply = function (context) {
  // 写法和call一致，只是处理参数的方式不同
  if (!this instanceof Function) {
    throw new TypeError("err")
  }

  context = context || window
  context.fn = this
  let result
  let args = arguments[1]
  if (args) {
    result = context.fn(...args)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

// 简单手写bind
// bind返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过new方式
// 对于直接调用来说，这里选择了apply的方式实现，但是对于参数需要注意以下情况：
// 因为bind可以实现类似这样的代码fn.bind(obj,1)(2),所以我们需要将两边的参数拼接起来，于是就有了这样的实现args.concat(...arguments)
// 最后来说通过new的方式，在之前的章节中我们学习过如何判断this,对于new的情况来说，不会被任何方式改变this,所以对于这种情况我们需要忽略传入的this

Function.prototype.myBind = function (context) {
  if (!typeof this === "function") {
    throw new TypeError("err")
  }

  let _this = this
  let args = [...arguments].slice(1)
  return function Fn() {
    //因为返回了一个函数，我们可以 new F(),所以需要判断
    if (this instanceof Fn) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
let obj = {
  name: "shuai",
}

function sayName() {
  console.log(this.name)
}

// sayName.myCall(obj)
// sayName.myApply(obj)

let fn = sayName.myBind(obj)
fn()
```
