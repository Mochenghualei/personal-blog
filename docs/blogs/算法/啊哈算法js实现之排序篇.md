---
title: 【啊哈算法】：排序篇🔥
author: shuai
date: "2022-2-27"
categories:
  - 前端
  - 算法
tags:
  - 排序算法
---

- 1.简单桶排序

- ```js
  // 桶排序
  let arr = [6, 1, 2, 7, 9, 3, 5, 5, 10, 8]
  let resArr = []
  // 10个数,最大数为10
  // 初始化盛放数组
  let sortArr = new Array(11)
  // 数组元素初始化为0
  for (let i = 0; i < sortArr.length; i++) {
    sortArr[i] = 0
  }
  // 标记元素位置及次数
  for (let i = 0; i < arr.length; i++) {
    sortArr[arr[i]]++
  }

  // 输出结果
  for (let i = 0; i < sortArr.length; i++) {
    for (let j = 0; j < sortArr[i]; j++) {
      resArr.push(i)
    }
  }

  console.log(resArr)
  // [1, 2, 3, 5,  5, 6, 7, 8, 9, 10]
  ```

- 2.冒泡排序

- ```js
  // 冒泡排序
  let arr = [6, 1, 2, 7, 9, 3, 5, 5, 10, 8]

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  console.log(arr)
  // [1, 2, 3, 5,  5, 6, 7, 8, 9, 10]
  ```

- 3.快排

- ```js
  // 快速排序
  let arr = [6, 1, 2, 7, 9, 5, 4, 5, 10, 8]

  function quickSort(left, right) {
    // 循环结束条件
    if (left > right) {
      return
    }
    // 初始化基准数及变量
    let temp = arr[left],
      i = left,
      j = right
    // 循环：先走j，再走i，满足条件交换位置
    while (i != j) {
      while (arr[j] >= temp && j > i) {
        j--
      }
      while (arr[i] <= temp && i < j) {
        i++
      }
      if (i < j) {
        let t = arr[i]
        arr[i] = arr[j]
        arr[j] = t
      }
    }
    // 归位基准数
    arr[left] = arr[i]
    arr[i] = temp
    // 递归处理基准数左侧
    quickSort(left, i - 1)
    // 递归处理基准数右侧
    quickSort(i + 1, right)
    return
  }

  quickSort(0, arr.length - 1)
  console.log(arr)
  // [1, 2, 4, 5, 5, 6, 7, 8, 9, 10]
  ```
