---
title: 【高频面试题】：Vue篇🔥
author: shuai
date: "2022-10-9"
categories:
  - 前端
tags:
  - 面试
  - Vue
---



### 1.v-if与v-for优先级问题

- 官方不推荐两者同时使用；

- vue2中v-for优先级高于v-if：

  - 可以借助这种优先级机制渲染部分列表项，但这样v-if将分别重复运行于每个v-for循环中，造成一定程度的性能和资源浪费，建议使用一个返回过滤后列表的computed取而代之：

    ```vue
    <!-- 不建议使用 -->
    <li v-for="(item, index) in list" :key="index" v-if="item.isActive">
      {{ item.msg }}
    </li>
    
    <!-- 计算属性返回列表 -->
    <li v-for="(item, index) in filteredList" :key="index">
      {{ item.msg }}
    </li>
    computed: {
      filteredList() {
        return this.list.filter(item => item.isActive)
      }
    }
    ```

- vue3中v-if优先级高于v-for：

  - 这时再把他们放在一起渲染部分列表项，由于v-if先执行会访问不到列表元素而报错；可以将v-for提到外层放到template容器上或者使用计算属性解决问题：

  - tips：vue2也可以外提v-for到template标签，只不过vue2中template标签不支持绑定key，需要将key绑定至真实的循环元素上，vue3则需要将key绑定到循环的template容器上;

    ```vue
    <!-- 报错 -->
    <ul>
      <li v-for="(item,index) in list" :key="index" v-if="item.isActive">{{item.msg}}</li>
    </ul>
    
    <!-- 外提v-for到template标签 -->
    <ul>
      <template v-for="(item, index) in list" :key="index">
        <li v-if="item.isActive">
          {{ item.msg }}
        </li>
      </template>
    </ul>
    ```

    

### 2.生命周期相关

- 定义：每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如数据监测，模板编译，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中会运行被称为生命周期钩子的函数，让开发者可以在特定阶段运行自己的代码。

- Vue生命周期总共分为8个阶段：创建前后、挂载前后、更新前后、销毁前后，以及一些特殊场景的生命周期，Vue3新增了3个用于调试和服务端渲染场景。

  | Vue2          | Vue3                | 描述                                     |
  | ------------- | ------------------- | ---------------------------------------- |
  | beforeCreate  | beforeCreate        | 组件实例被创建之初                       |
  | created       | created             | 组件实例已完成创建                       |
  | beforeMount   | beforeMount         | 组件挂载之前                             |
  | mounted       | mounted             | 组件挂载到实例上之后                     |
  | beforeUpdate  | beforeUpdate        | 组件数据发生变化、更新之前               |
  | updated       | updated             | 组件数据更新之后                         |
  | beforeDestroy | **beforeUnmounted** | 组件实例销毁之前                         |
  | destroyed     | **unmounted**       | 组件实例销毁之后                         |
  | activated     | activated           | keep-alive缓存的组件激活时               |
  | deactivated   | deactivated         | keep-alive缓存的组件停用时调用           |
  | errorCaptured | errorCaptured       | 捕获一个来自子孙组件的错误时被调用       |
  | -             | **renderTracked**   | 调试钩子，响应式依赖被收集时调用         |
  | -             | **renderTriggered** | 调试钩子，响应式依赖被触发时调用         |
  | -             | **serverPrefetch**  | ssr only，组件实例在服务器上被渲染前调用 |

- 结合实践

  - beforeCreate：通常用于插件开发中执行一些初始化任务（比如向App实例注入全局变量、全局属性等）；

  - created：组件初始化完毕，可以访问各种数据，获取接口数据等；

  - mounted：dom已创建，可用于获取访问数据和dom元素、访问子组件等；

  - beforeUpdate：此时view层还未更新，可用于获取更新前各种状态；

  - updated：完成view层的更新，更新后，所有状态已是最新；

  - beforeunmounted：实例被销毁前调用，可用于一些定时器或订阅的取消；

  - unmounted：销毁一个实例，可清理与其它实例的连接，解绑它的全部指令及事件监听器；

- tips1：setup和created谁先执行？为什么setup中没有beforeCreate和created？

  - setup最先执行，此时组件实例在setup内部已经创建，所以created的处理对于setup来讲明显在后面，对于开发者来说已经没有意义， 所以setup中没必要再使用beforeCreate和created。

- 官方最新生命周期示意图

- ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\lifelifecycle.png)

### 3.双向数据绑定使用和原理

- 定义：vue中双向绑定就是指v-model指令，可以绑定一个响应式数据到视图，同时视图中变化能同步改变该值。
- v-model是语法糖，作用在表单项和自定义组件上，表示某个值的输入和输出控制；使用v-model可以减少大量繁琐的事件处理代码，达到提高开发效率的目的。
- 作用在表单项上时，会根据所使用的元素自动使用对应的DOM属性和事件组合，默认情况下会指定value和input；v-model可以根据不同元素绑定不同的动态数据，且不局限于字符串类型：
  - 对于checkbox，可以使用true-value和false-value绑定动态数据；
  - 对于radio，可以使用value绑定动态数据；
  - 对于select，可以通过option的value绑定动态数据；


- v-model还可以结合修饰符做进一步操作：
  - .lazy可以将v-model操作input事件的默认行为改为操作change事件；
  - .number可以将用户输入通过parseFloat()处理为数字类型，不能处理则返回原始值；
  - .trim可以去除用户输入内容中两端的空格；

- 作用在组件上时，v-model行为有所不同：vue3中它类似于.sync修饰符，最终展开的结果为modelValue属性和update:modelValue事件；vue3中还可以用参数形式指定多个不同的绑定：例如v-model:foo和v-model:bar；

### 4.Vue中如何扩展一个组件

- 按照逻辑扩展和内容扩展来列举

  - 逻辑扩展的方法：mixins、extends、composition api
  - 内容扩展的方法：slots

- 使用方法、使用场景和问题

  - 混入：mixins是分发Vue组件中可复用功能的非常灵活的方式，混入对象可以包含任意组件的选项对象。但在使用中，由于混入的数据和方法不能明确判断来源且可能与组件内变量发生命名冲突，vue3中不再建议使用，而是引入了composition api，利用独立出来的响应式模块可以很方便的编写独立逻辑并提供响应式的数据，然后在setup选项中组合使用，增强代码的可读性和维护性，来看对比：

    ```js
    // 定义mixin对象
    const myMixin={
      created() {
        this.hello()
      },
      methods: {
        hello() {
          console.log("hello from mixin")
        }
      }
      // ...
    }
    // 局部混入:做数组项设置到mixins选项，仅作用于当前组件
    mixins:[myMixin]
    // 全局混入：慎用
    Vue.mixin(myMixin)
    ```

    ```vue
    //Vue3组合式函数
    //test.js
    import { ref, onMounted } from "vue"
    export function useMyfn() {
      // 被组合式函数封装和管理的状态
      const msg = ref("hello")
    
      onMounted(() => {
        hello()
      })
    
      function hello() {
        console.log(`${msg.value} from Myfn`)
      }
    
      return msg
    }
    
    //组件中使用
    <template>
      <div>{{msg}}</div>
    </template>
    
    <script setup>
    import { useMyfn } from "./hooks/test"
    const msg = useMyfn()
    </script>
    ```

    

  - 插槽：当有一个容器组件内容不确定，需要父组件分发扩展，就可以使用slot；

  - extends：不太常用：使一个组件可以继承另一个组件的组件选项，与mixins不同的是extends只能扩展单个选项，与同一组件的mixins发生命名冲突时它的优先级更高；

### 5.Vue子组件是否可以修改父组件的数据？

- 可以修改但不推荐：首先，文档中指出组件开发需要遵循单向数据流原则：即所有的 props 都遵循着**单向绑定**的原则，props 因父组件的更新而变化，避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。如果直接修改子组件props，vue会报错；

- 如果是鉴于以下两种需求更改prop，则建议如下：

  - **prop 被用于传入初始值；而子组件想在之后将其作为一个局部状态**：这时在子组件定义一个局部变量保存prop初始值即可：

    ```js
    const props = defineProps(['initialCounter'])
    const counter = ref(props.initialCounter)
    ```

  - **需要对传入的 prop 值做进一步的转换**：这时基于该 prop 值定义一个计算属性即可：

    ```js
    const props = defineProps(['size'])
    const normalizedSize = computed(() => props.size.trim().toLowerCase())
    ```

- 多数情况下子组件应该抛出一个事件来通知父组件做出改变，以Vue2中sync修饰符结合自定义事件为例：

  ```vue
  //父组件
  <Dialog :show.sync="show"></Dialog>
  //子组件
  <el-button @click="$emit('update:show', false)">取 消</el-button>
  ```


### 6.Vue如何做权限管理？控制到按钮级别的权限怎么做？

- 权限管理一般需求是两个：页面权限和按钮权限
- 下面从前端方案和后端方案分开阐述：
  - 前端方案会把所有路由信息在前端配置，通过路由守卫要求用户登录，用户登录后根据角色过滤出路由表。比如我会配置一个asyncRoutes数组，需要认证的页面在其路由的 **meta** 中添加一个 **roles** 字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。此过滤过程结束，剩下的路由就是该用户能访问的页面，最后通过**router.addRoutes（accessRoutes）**方式动态添加路由即可；
  - 后端方案会把所有页面路由信息存在数据库中，用户登录的时候根据其角色查询得到其能访问的所有页面路由信息返回给前端，前端再通过addRoutes动态添加路由信息

- 按钮权限的控制通常会实现一个指令，例如v-permission，将按钮要求角色通过值传给v-permission指令，在指令的moutned钩子中可以判断当前用户角色和按钮是否存在交集，有则保留按钮，无则移除按钮（是DOM操作）。

- 纯前端方案的优点是实现简单，不需要额外权限管理页面，但是维护起来问题比较大，有新的页面和角色需求就要修改前端代码重新打包部署；服务端方案就不存在这个问题，通过专门的角色和权限管理页面，配置页面和按钮权限信息到数据库，应用每次登陆时获取的都是最新的路由信息，可谓一劳永逸！
- 实现细节：服务端返回的路由信息如何添加到路由器中？

```js
// 前端组件名和组件映射表
const map = {
  // "xx":require("@/views/xx.vue") //同步方式
  "xx": () => import("@/views/xx.vue") // 异步方式 
}
// 后端返回的asyncRoutes
const asyncRoutes = [
  { path: "/xx", component: "xx" }
]
//遍历asyncRoutes，替换component
function mapComponent(asyncRoutes) {
  asyncRoutes.forEach(route => {
    route.component = map[route.component]
    if (route.children) {
      mapComponent(route.children)
    }
  })
  return asyncRoutes
}
mapComponent(asyncRoutes)
```

### 7.说一说对Vue数据响应式的理解

- 答题思路：
  - 1.啥是响应式？
  - 2.为什么vue需要响应式？
  - 3.它能给我们带来什么好处？
  - 4.vue的响应式是怎么实现的？有哪些优缺点？
  - 5.vue3中的响应式的新变化
- 回答范例：
  - 1.所谓数据响应式就是能够**使数据变化可以被检测并对这种变化做出响应**的机制；
  - 2.MVVM框架中要解决的一个核心问题是连接数据层和视图层，通过数据驱动应用，数据变化，视图更新，要做到这点的就需要对数据做响应式处理，这样一旦数据发生变化就可以立即做出更新处理；
  - 3.以vue为例说明，通过数据响应式加上虚拟DOM和patch算法，开发人员只需要操作数据，关心业务，完全不用接触繁琐的DOM操作，从而大大提升开发效率，降低开发难度；
  - 4.vue2中的数据响应式会根据数据类型来做不同处理，如果是对象则采用**Object.defineProperty（）**的方式定义**数据拦截**，当数据被访问或发生变化时，感知并作出响应；如果是数组则通过覆盖数组对象原型的7个变更方法，使这些方法可以额外的做更新通知，从而作出响应。这种机制很好的解决了数据响应化的问题，但在实际使用中也存在一些缺点：比如初始化时的递归遍历会造成性能损失；新增或删除属性时需要用户使用Vue.set/delete这样特殊的api才能生效；对于ES6中新产生的Map、Set这些数据结构不支持等问题；
  - 5.为了解决这些问题，vue3重新编写了这一部分的实现：利用ES6的**Proxy**代理要响应化的数据，它有很多好处，编程体验是一致的，不需要使用特殊api，初始化性能和内存消耗都得到了大幅改善；另外由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更灵活的使用它，第三方的扩展开发起来更加灵活了；

### 8.你了解虚拟DOM吗？

- 分析
  - 现有框架几乎都引入了虚拟DOM来对真实DOM进行抽象，也就是现在大家所熟知的VNode和VDOM，那么为什么需要引入虚拟DOM呢？围绕这个疑问来解答即可！

- 思路
  - 1.vdom是什么？
  - 2.引入vdom的好处是什么？
  - 3.vdom如何生成，又如何成为真实dom？
  - 4.在后续的diff中的作用

- 回答

  - 1.概念：虚拟dom顾名思义就是虚拟的dom对象，它本身就是一个`JavaScript`对象，只不过它是通过不同的属性去描述一个视图结构，相比于真实dom只保留了核心属性，进而使后续操作更加快速；

  - 2.通过引入vdom我们可以获得如下好处：
    - 将真实元素节点抽象成VNode，有效减少直接操作dom次数，从而提高程序性能；

    - 直接操作 dom 是有限制的，比如：diff、clone等操作，一个真实元素上有许多的内容，如果直接对其进行diff操作，会去额外diff一些没有必要的内容；同样的，如果需要进行clone，那么需要将其全部内容进行复制，这也是没必要的。但是，如果将这些操作转移到 JavaScript 对象上，那么就会变得简单了；

    - 操作 dom 是比较昂贵的，频繁的dom操作容易引起页面的重绘和回流，但是通过抽象VNode进行中间处理，可以有效减少直接操作dom的次数，从而减少页面重绘和回流；

    - 方便实现跨平台

      - 同一VNode节点可以渲染成不同平台上的对应的内容，比如：渲染在浏览器是dom元素节点，渲染在Native（iOS、Android）变为对应的控件、可以实现SSR（服务端渲染）、渲染到WebGL中等等；

      - Vue3中允许开发者基于VNode实现自定义渲染器（renderer），以便于针对不同平台进行渲染；

  - 3.vdom如何生成，又如何成为真实dom？以及在diff中的作用
    - 在vue中我们常常会为组件编写模板template，这个模板会被编译器compiler编译为渲染函数（render function），在接下来的挂载（mount）过程中会调用render函数，返回的对象就是虚拟dom。但它们还不是真正的dom，会在后续的patch过程中进一步转化为真实dom：
    - ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\虚拟DOM.png)
    - 挂载过程结束后，vue程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新render，此时就会生成新的vdom，和上一次的渲染结果diff就能得到变化的地方，从而转换为最小量的dom操作，高效更新视图；

### 9.你了解Diff算法吗？

- 思路
  - 1.diff算法是干什么的
  - 2.它的必要性
  - 3.它何时执行
  - 4.具体执行方式
  - 5.拔高：说一下vue3中的优化

- 回答范例

  - 1.概念：Vue中的`diff算法`称为`patching算法`，它由Snabbdom修改而来，虚拟DOM要想转化为真实DOM就需要通过patch方法转换；
  - 2.必要性：
    - 最初Vue1.x视图中每个依赖均有更新函数对应，可以做到精准更新，因此并不需要虚拟DOM和patching算法支持，但是这样粒度过细导致Vue1.x无法承载较大应用；Vue 2.x中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，此时就需要引入patching算法才能精确找到发生变化的地方并高效更新；

  - 3.执行时刻：
    - Vue中diff执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行`render函数`获得最新的虚拟DOM，然后执行patch函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的DOM操作；

  - 4.执行方式：
    - patch过程是一个递归过程，遵循`深度优先、同层比较`的策略；以vue3的patch为例：
      ①首先判断两个节点是否为相同同类节点（isSameVNodeType()，判断key、类型、标签），不同则删除重新创建；
      ②如果双方都是文本则更新文本内容；
      ③如果双方都是元素节点则递归更新子元素，同时更新元素属性；
      更新子节点时又分了几种情况：
      ①新的子节点是文本，老的子节点是数组则清空，并设置文本；
      ②新的子节点是文本，老的子节点是文本则直接更新文本；
      ③新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；
      ④新的子节点是数组，老的子节点也是数组，那么比较两组子节点；
      Vue3中引入的更新策略：编译期优化patchFlags、block等

### 10.说一说你了解的Vue3新特性

- 先说说API相关：官方文档展出的重要更新：

  - Composition API

  - SFC Composition API 语法糖 (<script setup>)

  - Teleport组件

  - Fragments组件

  - Emits选项

  - 自定义渲染器

  - SFC State-driven CSS Variables (v-bind in <style>)

  - SFC <style scoped> can now include global rules or rules that target only slotted content

  - Suspense组件

- 再说说框架特性：

  - 更快：
    - 重写虚拟DOM（编译优化内容的存储、type属性支持更加多样）
    - 编译器优化：静态提升、patchFlags、block（区块）等
    - 基于Proxy的响应式系统（了解Vue3的响应式原理）

  - 更小：更好的摇树优化
  - 更容易维护：TypeScript + 模块化
  - 更容易扩展：
    - 独立的响应式模块
    - 自定义渲染器

### 11.如何定义动态路由，如何获取传递过来的动态参数？如果让你实现一个vue路由，说一说思路

- 回答范例
  - 1.很多时候，我们需要将给定匹配模式的路由映射到同一个组件，这种情况就需要定义动态路由；
  - 2.例如，我们可能有一个User组件，它应该对所有用户进行渲染，但用户ID不同。在Vue Router中，我们可以在路径中使用一个动态字段来实现，例如：{path:'/users/:id'，component:User}，其中:id就是路径参数；
  - 3.路径参数用冒号 : 表示。当一个路由被匹配时，它的params的值将在每个组件中以`this.$route.params`的形式暴露出来；
  - 4.参数还可以有多个，例如/users/:username/posts/:postId；除了`$route.params`之外，$route对象还公开了其他有用的信息，如`$route.query`、`$route.hash`等；

- 实现一个vue路由的思路：

  - 思路分析：

    - 首先思考vue路由要解决的问题：用户点击跳转链接内容切换，页面不刷新；

    - 借助hash或者history api实现url跳转页面不刷新；

    - 同时监听hashchange事件或者popstate事件处理跳转；

    - 根据hash值或者state值从routes表中匹配对应component并渲染之；

  - 回答范例：

    - 需求分析：一个SPA应用的路由需要解决的问题是**页面跳转内容改变同时不刷新**，同时路由还需要以插件形式存在，所以：

    - 1.首先定义一个`createRouter`函数，返回路由器实例，实例内部做几件事：

      - 保存用户传入的配置项；

      - 监听hash或者popstate事件（取决于当前的模式）；

      - 回调里根据path匹配对应路由，render到`router-view`中；

    - 2.将router定义成一个Vue插件，即实现`install`方法，内部做两件事：

      - 注册两个全局组件（`app.component`）：`router-link`和`router-view`，分别实现页面跳转和内容显示；

      - 定义两个全局变量（`app.config.globalProperties`）：`$route`和`$router`，组件内可以访问的当前路由和路由器实例；

### 12.说说key的作用

- 思路分析：
  - 1.给出结论，key的作用是用于优化patch性能；
  - 2.key的必要性；
  - 3.实际使用方式；
  - 4.总结：可从源码层面描述一下vue如何判断两个节点是否相同；

- 回答范例：
  - 1.key的作用主要是为了更高效的更新虚拟DOM；
  - 2.vue在patch过程中**判断两个节点是否是相同节点是key是一个必要条件**，渲染一组列表时，key往往是唯一标识，所以如果不定义key的话，vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个patch过程比较低效，影响性能；
  - 3.实际使用中在渲染一组列表时key必须设置，而且必须是唯一标识，**应该避免使用数组索引作为key，这可能导致一些隐蔽的bug（过程中对数组进行排序等）**；vue中在使用相同标签元素过渡切换时，也会使用key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果；
  - 4.从源码中可以知道，vue判断两个节点是否相同时主要判断两者的key和元素类型等（`isSameVNodeType`），因此如果不设置key，它的值就是undefined，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的；

案例：模拟以下操作

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test1.png)

不使用key：增加3次额外的更新操作和1次E节点的创建和追加操作

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test2.png)

使用key：

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test3.png)

### 13.说说 nextTick() 的使用和原理

- 答题思路：
  - 1.nextTick是做什么的？
  - 2.为什么需要它呢？
  - 3.开发时何时使用它？
  - 4.下面介绍一下如何使用nextTick
  - 5.原理解读，结合异步更新和nextTick生效方式

- 回答范例：
  - 1.定义：nextTick是等待下一次DOM更新刷新的工具方法；
  - 2.为什么使用：Vue有个异步更新策略，意思是如果数据变化，Vue不会立刻更新DOM，而是开启一个队列，把组件更新函数保存在队列中，在同一事件循环中发生的所有数据变更会异步的批量更新。这一策略导致我们对数据的修改不会立刻体现在DOM上，此时如果想要获取更新后的DOM状态，就需要使用nextTick；
  - 3.开发时，有两个场景我们会用到nextTick：
    - created中想要获取DOM时；
    - 响应式数据变化后获取DOM更新后的状态，比如希望获取列表更新后的高度；
  - 4.如何使用：
    - nextTick签名如下：`function nextTick(callback?:()=>void):Promise<void>`
    - 所以我们只需要在传入的回调函数中访问最新DOM状态即可，或者我们可以await nextTick()方法返回的Promise之后做这件事；
  - 5.原理（为什么在nextTick的回调函数中可以访问到DOM更新）：
    - 在Vue内部，nextTick之所以能够让我们看到DOM更新后的结果，是因为我们传入的callback会被添加到队列刷新函数（flushSchedulerQueue）的后面，这样等队列内部的更新函数都执行完毕，所有DOM操作也就结束了，callback自然能够获取到最新的DOM值；

### 14.说一说watch和computed的区别

- 思路分析：
  - 1.先看computed，watch两者定义，列举使用上的差异；
  - 2.列举使用场景上的差异，如何选择；
  - 3.使用细节、注意事项；
  - 4.vue3变化；

- 回答范例：

  - 1.computed定义：接受一个 getter 函数，返回一个只读的响应式 `ref` 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象；watch定义：侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数，可以传递对象，设置deep、immediate等选项；

  - 2.计算属性可以从组件数据派生出新数据，最常见的使用方式是设置一个函数，返回计算之后的结果，computed和methods的差异是它具备缓存性，如果依赖项不变时不会重新计算。侦听器可以侦测某个响应式数据的变化并执行副作用，常见用法是传递一个函数，执行副作用，watch没有返回值，但可以执行异步操作等复杂逻辑；
  - 3.计算属性常用场景是简化行内模板中的复杂表达式，模板中出现太多逻辑会使模板变得随肿不易维护。侦听器常用场景是状态变化之后做一些额外的DOM操作或者异步操作。选择时首先看是否需要派生出新值，一般来说能用计算属性实现的方式首选计算属性；

  - 4.vue3中watch选项发生了一些变化，例如不再能侦测一个点操作符之外的字符串形式的表达式；响应式API中新出现了watch、watchEffect可以完全替代目前的watch选项，且功能更加强大；

### 15.阐述Vue子组件和父组件创建和挂载顺序

- 回答范例

  - 1.创建过程自上而下，挂载过程自下而上；即：
    - `parent created`
    - `child created`
    - `child mounted`
    - `parent mounted`
  - 2.之所以会这样是因为Vue创建过程是一个递归过程，先创建父组件，有子组件就会创建子组件，因此创建时先有父组件再有子组件；子组件首次创建时会添加mounted钩子到队列，等到patch结束再执行它们，可见子组件的mounted钩子是先进入到队列中的，因此等到patch结束执行这些钩子时也先执行，所以是子组件先挂载；

  - Vue3初始化流程协助理解：

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\Vue3初始化流程.png)

### 16.Vue中如何缓存组件、更新组件？

- 缓存组件使用`keep-alive`组件，这是一个非常常见且有用的优化手段，vue3中keep-alive有比较大的更新，能说的点比较多；

- 思路

  - 1.缓存用`keep-alive`，阐述它的作用与用法；
  - 2.使用细节，例如缓存指定/排除、结合router-view和transition；
  - 3.组件缓存后更新可以利用`activated`或者`beforeRouteEnter`钩子；
  - 4.原理阐述；

- 回答范例

  - 1.开发中缓存组件使用`keep-alive`，keep-alive是vue内置组件，keep-alive包裹动态组件component时，会缓存不活动的组件实例，而不是销毁它们，这样在组件切换过程中将状态保留在内存中，防止重复渲染：

  - ```vue
    <keep-alive>
      <component :is="tab"></component>
    </keep-alive>
    ```

  - 2.结合属性`include`和`exclude`可以明确指定缓存哪些组件或排除缓存指定组件；vue3中结合router-view时变化较大，之前是keep-alive包裹router-view，现在需要反过来用router-view包裹keep-alive，通过 `v-slot` 在 `RouterView` 内部使用：

  - ```vue
    //Vue2
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    //Vue3
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    ```

  - 3.缓存后如果要获取数据，解决方案可以有以下两种：

    - `beforeRouteEnter`：在有vue-router的项目，每次进入路由的时候，都会执行beforeRouteEnter：

    - ```js
      beforeRouteEnter (to, from, next) {
        next(vm=>{
          console.log(vm)
          // 每次进入路由执行
          vm.getData()
        })
      }
      ```

    - `activated`：在keep-alive缓存的组件被激活的时候，都会执行activated钩子：

    - ```js
      activated(){
        this.getData()
      }
      ```

  - 4.`keep-alive`是一个通用组件，它内部定义了一个map，缓存创建过的组件实例，它返回的渲染函数内部会查找内嵌的component组件对应组件的VNode，如果该组件在map中存在就直接返回它。由于component的is属性是个响应式数据，因此只要它变化，keep-alive的render函数就会重新执行；

### 17.如果从0到1构建一个Vue项目？

- 思路
  - 1.构建项目，脚手架创建项目基本结构；
  - 2.引入必要的插件：Vuex、vue-router、axios等；
  - 3.代码规范：prettier，eslint；
  - 4.提交规范：husky，lint-staged；
  - 5.其他常用：svg-loader，vueuse，nprogress；
  - 6.常见目录结构；

- 回答范例

  - 1.从0创建一个项目我大致会做以下事情：项目构建、引入必要插件、代码规范、提交规范、常用库和组件；
  - 2.目前vue3项目我会用vite或者create-vue创建项目；
  - 3.接下来引入必要插件：路由插件vue-router、状态管理vuex/pinia、ui库我比较喜欢element-plus和antd-vue、http工具我会选axios；
  - 4.其他比较常用的库有vueuse，nprogress，图标库可以使用vite-svg-loader
  - 5.下面是代码规范：结合prettier和eslint（用的哪一套规范，如何制定的，是否可以列举几个）
  - 6.最后是提交规范，可以使用husky，lint-staged，commitlint

  - 7.目录结构我有如下习惯：
    - `.vscode`：用来放项目中的vscode配置
    - `plugins`：用来放vite插件的plugin配置
    - `public`：用来放一些诸如页头icon之类的公共文件，会被打包到dist根目录下
    - `src`：用来放项目代码文件
    - `api`：用来放http的一些接口配置
    - `assets`：用来放一些CSS之类的静态资源
    - `components`：用来放项目通用组件
    - `layout`：用来放项目的布局
    - `router`：用来放项目的路由配置
    - `store`：用来放状态管理Pinia的配置
    - `utils`：用来放项目中的工具方法类
    - `views`：用来放项目的页面文件

### 18.实际工作中，你总结的Vue最佳实践有哪些？

- 思路：查看vue官方文档：风格指南（重点关注AB级）、最佳实践（生产部署、性能、访问、安全）
- 回答范例
  - 从编码风格、性能、安全等方面说几条：
  - 1.编码风格方面：
    - 命名组件时使用“多词"风格避免和HTML元素冲突；
    - 使用”细节化"方式定义属性而不是只有一个属性名；
    - 属性名声明时使用“驼峰命名"，模板或jsx中使用”肉串命名"；
    - 使用v-for时务必加上key，且不要跟v-if写在一起；
  - 2.性能方面：
    - 路由懒加载减少应用尺寸；
    - 利用SSR减少首屏加载时间；
    - 利用v-once渲染那些不需要更新的内容；
    - 一些长列表可以利用虚拟滚动技术避免内存过度占用；
    - 对于深层嵌套对象的大数组可以使用`shallowRef`或`shallowReactive`降低开销；
    - 避免不必要的组件抽象；
  - 3.安全：
    - 不使用不可信模板，例如使用用户输入拼接模板：template：<div>+userProvidedString +
      </div>
    - 小心使用v-html，:url，:style等，避免html、url、样式等注入
    - 4.等等…

### 19.说一说你对Vuex的理解

- 回答范例
  - 1（定义）：Vuex是一个专为Vue应用开发的`状态管理模式+库`。它采用集中式存储，管理应用的所有组件的状态，并以相应的规则保证状态`以一种可预测的方式`发生变化；
  - 2（必要性）：我们期待以一种简单的“`单向数据流`"的方式管理应用，即`状态->视图->操作`单向循环的方式；但当我们的应用遇到多个组件共享状态时，比如：多个视图依赖于同一状态或者来自不同视图的行为需要变更同一状态。此时单向数据流的简洁性很容易被破坏。因此，我们有必要把组件的共享状态抽取出来，以一个`全局单例模式`管理；通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，我们的代码将会变得更结构化且易维护；这是vuex存在的必要性，它和react生态中的redux之类是一个概念，都是为了解决这一问题。
  - 3（何时使用）：Vuex解决状态管理的同时引入了不少概念：例如`state、mutation、action`等，是否需要引入还需要根据应用的实际情况衡量一下：如果不打算开发大型单页应用，使用Vuex反而是繁琐冗余的，一个简单的store模式就足够了。但是，如果要构建一个中大型单页应用，Vuex基本是标配；
  - 4（个人使用感受）：使用稍微有些繁琐，尤其是在模块嵌套时，调用状态时的命名空间使用起来就比较容易混淆（子模块需要用点，全局状态则不需要）；

- 可能的追问：Vuex中mutation和action的区别是什么？
  -  vuex中的state数据不允许直接修改，所以引入了`mutations`用于定义方法来修改state中的数据，但是只能同步修改；如果异步修改会造成调试工具跟实际数据不对应，所以vuex又引入了`actions`，用于异步触发mutations中的方法；总的来说：`mutations`中的方法可以直接修改state数据，而`actions`是异步执行mutations中的方法，所以它都可以改数据，区别是一个是同步一个是异步。

### 20.说一说Vue从template到render的处理过程

- 问我们template到render过程，其实是问Vue`编译器`工作原理；
- 思路
  - 1.引入vue编译器概念；
  - 2.说明编译器的必要性；
  - 3.阐述编译器的工作流程；

- 回答范例
  - 1.Vue中有个独特的编译器模块，称为`"compiler"`，它的主要作用是将用户编写的template编译为js中可执行的render函数；
  - 2.之所以需要这个编译过程是为了便于前端程序员能高效的编写视图模板；相比而言，我们还是更愿意用HTML来编写视图，直观且高效。手写render函数不仅效率底下，而且失去了编译期的优化能力，因此compiler的过程是必须的；
  - 3.在Vue中编译器会先对template进行解析，这一步称为`parse`，结束之后会得到一个JS对象，我们成为抽象语法树AST，然后是对AST进行深加工的转换过程，这一步称为`transform`，最后将前面得到的AST生成（`generate`）JS代码，也就是render函数；

- 可能的追问：

  - Vue中编译器的执行时刻？
    - 根据引入Vue的运行时不同，编译器的执行时刻是不同的：如果使用webpack环境，即Vue的预打包环境，这时webpack的vue-loader会提前将模板进行编译，这时编译器的执行时刻就是在打包阶段，即预编译；如果是非运行时版本，即携带编译器的版本，这时编译器就会在运行时工作：发现一个组件有模板没有渲染函数，就会去编译模板，将其转换为渲染函数，也就是发生在组件的创建阶段。

  - React中有没有编译器？
    - react中又jsx，这不是编译器，可以理解为一种语法糖，语言本身没有变化，通过babel-loader将js变为js，因此react是没有编译器的。

### 21.说一说Vue实例在挂载过程中发生了什么

- 挂载过程中完成了两件最重要的事：初始化（App实例的创建、数据状态的初始化、选项的处理、建立响应式数据等）建立更新机制，把这两件事说清除即可
- 回答范例
  - 1.挂载过程指的是app.mount()过程，这是个初始化过程，整体上做了两件事：初始化和建立更新机制：
  - 2.初始化会创建组件实例、初始化组件状态、创建各种响应式数据；
  - 3.建立更新机制这一步会在app实例mount时立即执行一次组件更新函数，这会首次执行组件渲染函数并执行patch将前面获得Vnode转换为dom；同时首次执行渲染函数会创建它内部响应式数据和组件更新函数之间的依赖关系，也就是依赖收集的过程，会创建一个数据结构，将来数据变化时会根据这个结构找到相应的更新函数，重新执行更新函数，进而实现页面的更新，这就是所谓的更新机制的建立：源码层面的执行顺序：
    - createApp --> mount --> render --> patch --> processComponent --> mountComponent
    - mountComponent内部做三件事情：创建组件实例、初始化当前组件实例（setupComponent）、建立更新机制（setupRenderEffect），setupRenderEffect内部定义组件更新函数（componentUpdateFn），componentUpdateFn内部会继续执行渲染函数，递归执行patch，得到dom；

- 可能的追问：
  - 1.响应式数据如何建立？
  - 依赖关系如何建立？

### 22.Vue3的设计目标是什么？做了哪些优化？

- 思路
  - 从以下几方面分门别类阐述：易用性、性能、扩展性、可维护性、开发体验等

- 回答范例
  - 1.Vue3的最大设计目标是替代Vue2（皮一下），为了实现这一点，Vue3在以下几个方面做了很大改进，如：易用性、框架性能、扩展性、可维护性、开发体验等；
  - 2.易用性方面主要是API简化，比如`v-model`在Vue3中变成了Vue2中`v-model`和`sync`修饰符的结合体，用户不用区分两者不同，也不用选择困难。类似的简化还有用于渲染函数内部生成VNode的h(type，props，children)，其中props不用考虑区分属性、特性、事件等，框架替我们判断，易用性大增；
  - 3.开发体验方面，新组件 `Teleport` 传送门、`Fragments`、`Suspense`等都会简化特定场景的代码编写，`SFC Composition API` 语法糖更是极大提升我们开发体验；
  - 4.扩展性方面提升如独立的`reactivity`模块，`custom rendererAPI`等；
  - 5.可维护性方面主要是`Composition API`，更容易编写高复用性的业务逻辑。还有对TypeScript支持的提升；
  - 6.性能方面的改进也很显著，例如编译期优化、基于Proxy的响应式系统等；

- 可能的追问
  - 1.Vue3做了哪些编译优化？
  - 2.`Proxy`和`defineProperty` 有什么不同？

### 23.你了解哪些Vue性能优化方法？

- 答题思路：
  - 根据题目描述，这里主要探讨代码层面的优化；

- 回答范例：

  - 我这里主要从Vue代码编写层面说一些优化手段，例如：代码分割、服务端渲染、组件缓存、长列表优化等

  - 1.最常见的`路由懒加载`：有效拆分App尺寸，访问时才异步加载：通过vite或者webpack提供的动态加载方法import加载组件，打包时候就可以分包打包，这样就使得将来程序变得更小更快，我需要访问时才异步加载：

```js
const router = createRouter({
  // 借助webpack的import实现异步组件
  routes: [{ path: "/foo", component: () => import("./Foo.vue") }],
})
```

- 2.`keep-alive`缓存页面：避免重复创建组件实例，且能保留缓存组件的状态，比如保留之前滚动条的位置：

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component"></component>
  </keep-alive>
</router-view>
```

- 3.使用`v-show`复用DOM：避免重复创建组件：

```vue
<template>
  <div class="cell">
    <!-- ！—这种情况用v-show复用DOM，比v-if效果好 -->
    <div v-show="value" class="on">
      <Heavy :n="10000" />
    </div>
    <section v-show="!value" class="off">
      <Heavy :n="10000" />
    </section>
  </div>
</template>
```

- 4.`v-for`遍历避免同时使用`v-if`：实际上两者在Vue3与Vue2中的优先级不同，在Vue3中已经是个错误写法：

- 5.合适时机使用`v-once`和`v-memo`：
  - 如果有一个数据只显示一次，之后就不再变化了，那么可以使用`v-once`:

```vue
<!--single element-->
<span v-once>This will never change:{{ msg }}</span>
<!--the element have children-->
<div v-once>
  <h1>comment</h1>
  <p>{{ mss }}</p>
</div>
<!--component-->
<my-component v-once :comment="msg"></my-component>
<!--`v-for` directive-->
<ul>
  <li v-for="i in list" v-once>{{ i }}</li>
</ul>
```

- `v-memo`可以让我们按条件去跳过一些子树的更新，下面这个列表只会更新选中状态变化项：

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  <p>ID:{{ item.id }} - selected:{{ item.id === selected }}</p>
  <p>……more child nodes</p>
</div>
```

- 6.长列表性能优化：如果是大数据长列表，可采用虚拟滚动，只渲染少部分可视区域的内容：

```vue
<recycle-scroller 
  class="items" 
  :items="items" 
  :item-size="24"
>
  <template v-slot="{ item }">
    <FetchItemView 
      :item="item" 
      @vote="voteItem(item)" 
    />
  </template>
</recycle-scroller>
//一些开源库：
//vue-virtual-scroller
//vue-virtual-scroll-grid
```

- 7.事件的销毁：Vue 组件销毁时，会自动解绑它的全部指令及监听器相关的事件，但是仅限于组件本身的事件。因此一些自定义事件是不会取消的，因此像定时器的监听需要在卸载前手动取消；

- 8.图片懒加载
  - 对于图片过多的页面，为了加速页面加载速度，很多时候我们需要将页面内未出现在可视区域的图片先不做加载，等到滚动到可视区域后再去加载：

```vue
<img v-lazy="/static/img/1.png">
//参考项目：vue-lazyload
```

- 9.第三方插件按需引入
  - 像`element-plus`这样的第三方组件库可以按需引入避免体积太大；

- 10.子组件分割策略：较重的状态组件适合拆分，相反：不宜过度拆分组件，尤其是为了所谓的组件抽象将一些不需要渲染的组件特意抽出来，因为组件实例的消耗远大于纯dom节点；

- 11.服务端渲染（SSR）/静态站点生成（SSG），这就属于同构开发层面了，如果存在首屏渲染速度过慢的问题可以考虑SSR、SSG方案；

### 24.Vue组件为什么只能有一个根节点？

- 回答思路

  - 给一条自己的结论

  - 解释为什么会这样

  - vue3解决方法原理

### 1.v-if与v-for优先级问题

- 官方不推荐两者同时使用；

- vue2中v-for优先级高于v-if：

  - 可以借助这种优先级机制渲染部分列表项，但这样v-if将分别重复运行于每个v-for循环中，造成一定程度的性能和资源浪费，建议使用一个返回过滤后列表的computed取而代之：

    ```vue
    <!-- 不建议使用 -->
    <li v-for="(item, index) in list" :key="index" v-if="item.isActive">
      {{ item.msg }}
    </li>
    
    <!-- 计算属性返回列表 -->
    <li v-for="(item, index) in filteredList" :key="index">
      {{ item.msg }}
    </li>
    computed: {
      filteredList() {
        return this.list.filter(item => item.isActive)
      }
    }
    ```

- vue3中v-if优先级高于v-for：

  - 这时再把他们放在一起渲染部分列表项，由于v-if先执行会访问不到列表元素而报错；可以将v-for提到外层放到template容器上或者使用计算属性解决问题：

  - tips：vue2也可以外提v-for到template标签，只不过vue2中template标签不支持绑定key，需要将key绑定至真实的循环元素上，vue3则需要将key绑定到循环的template容器上;

    ```vue
    <!-- 报错 -->
    <ul>
      <li v-for="(item,index) in list" :key="index" v-if="item.isActive">{{item.msg}}</li>
    </ul>
    
    <!-- 外提v-for到template标签 -->
    <ul>
      <template v-for="(item, index) in list" :key="index">
        <li v-if="item.isActive">
          {{ item.msg }}
        </li>
      </template>
    </ul>
    ```

    

### 2.生命周期相关

- 定义：每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如数据监测，模板编译，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中会运行被称为生命周期钩子的函数，让开发者可以在特定阶段运行自己的代码。

- Vue生命周期总共分为8个阶段：创建前后、挂载前后、更新前后、销毁前后，以及一些特殊场景的生命周期，Vue3新增了3个用于调试和服务端渲染场景。

  | Vue2          | Vue3                | 描述                                     |
  | ------------- | ------------------- | ---------------------------------------- |
  | beforeCreate  | beforeCreate        | 组件实例被创建之初                       |
  | created       | created             | 组件实例已完成创建                       |
  | beforeMount   | beforeMount         | 组件挂载之前                             |
  | mounted       | mounted             | 组件挂载到实例上之后                     |
  | beforeUpdate  | beforeUpdate        | 组件数据发生变化、更新之前               |
  | updated       | updated             | 组件数据更新之后                         |
  | beforeDestroy | **beforeUnmounted** | 组件实例销毁之前                         |
  | destroyed     | **unmounted**       | 组件实例销毁之后                         |
  | activated     | activated           | keep-alive缓存的组件激活时               |
  | deactivated   | deactivated         | keep-alive缓存的组件停用时调用           |
  | errorCaptured | errorCaptured       | 捕获一个来自子孙组件的错误时被调用       |
  | -             | **renderTracked**   | 调试钩子，响应式依赖被收集时调用         |
  | -             | **renderTriggered** | 调试钩子，响应式依赖被触发时调用         |
  | -             | **serverPrefetch**  | ssr only，组件实例在服务器上被渲染前调用 |

- 结合实践

  - beforeCreate：通常用于插件开发中执行一些初始化任务（比如向App实例注入全局变量、全局属性等）；

  - created：组件初始化完毕，可以访问各种数据，获取接口数据等；

  - mounted：dom已创建，可用于获取访问数据和dom元素、访问子组件等；

  - beforeUpdate：此时view层还未更新，可用于获取更新前各种状态；

  - updated：完成view层的更新，更新后，所有状态已是最新；

  - beforeunmounted：实例被销毁前调用，可用于一些定时器或订阅的取消；

  - unmounted：销毁一个实例，可清理与其它实例的连接，解绑它的全部指令及事件监听器；

- tips1：setup和created谁先执行？为什么setup中没有beforeCreate和created？

  - setup最先执行，此时组件实例在setup内部已经创建，所以created的处理对于setup来讲明显在后面，对于开发者来说已经没有意义， 所以setup中没必要再使用beforeCreate和created。

- 官方最新生命周期示意图

- ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\lifelifecycle.png)

### 3.双向数据绑定使用和原理

- 定义：vue中双向绑定就是指v-model指令，可以绑定一个响应式数据到视图，同时视图中变化能同步改变该值。
- v-model是语法糖，作用在表单项和自定义组件上，表示某个值的输入和输出控制；使用v-model可以减少大量繁琐的事件处理代码，达到提高开发效率的目的。
- 作用在表单项上时，会根据所使用的元素自动使用对应的DOM属性和事件组合，默认情况下会指定value和input；v-model可以根据不同元素绑定不同的动态数据，且不局限于字符串类型：
  - 对于checkbox，可以使用true-value和false-value绑定动态数据；
  - 对于radio，可以使用value绑定动态数据；
  - 对于select，可以通过option的value绑定动态数据；


- v-model还可以结合修饰符做进一步操作：
  - .lazy可以将v-model操作input事件的默认行为改为操作change事件；
  - .number可以将用户输入通过parseFloat()处理为数字类型，不能处理则返回原始值；
  - .trim可以去除用户输入内容中两端的空格；

- 作用在组件上时，v-model行为有所不同：vue3中它类似于.sync修饰符，最终展开的结果为modelValue属性和update:modelValue事件；vue3中还可以用参数形式指定多个不同的绑定：例如v-model:foo和v-model:bar；

### 4.Vue中如何扩展一个组件

- 按照逻辑扩展和内容扩展来列举

  - 逻辑扩展的方法：mixins、extends、composition api
  - 内容扩展的方法：slots

- 使用方法、使用场景和问题

  - 混入：mixins是分发Vue组件中可复用功能的非常灵活的方式，混入对象可以包含任意组件的选项对象。但在使用中，由于混入的数据和方法不能明确判断来源且可能与组件内变量发生命名冲突，vue3中不再建议使用，而是引入了composition api，利用独立出来的响应式模块可以很方便的编写独立逻辑并提供响应式的数据，然后在setup选项中组合使用，增强代码的可读性和维护性，来看对比：

    ```js
    // 定义mixin对象
    const myMixin={
      created() {
        this.hello()
      },
      methods: {
        hello() {
          console.log("hello from mixin")
        }
      }
      // ...
    }
    // 局部混入:做数组项设置到mixins选项，仅作用于当前组件
    mixins:[myMixin]
    // 全局混入：慎用
    Vue.mixin(myMixin)
    ```

    ```vue
    //Vue3组合式函数
    //test.js
    import { ref, onMounted } from "vue"
    export function useMyfn() {
      // 被组合式函数封装和管理的状态
      const msg = ref("hello")
    
      onMounted(() => {
        hello()
      })
    
      function hello() {
        console.log(`${msg.value} from Myfn`)
      }
    
      return msg
    }
    
    //组件中使用
    <template>
      <div>{{msg}}</div>
    </template>
    
    <script setup>
    import { useMyfn } from "./hooks/test"
    const msg = useMyfn()
    </script>
    ```

    

  - 插槽：当有一个容器组件内容不确定，需要父组件分发扩展，就可以使用slot；

  - extends：不太常用：使一个组件可以继承另一个组件的组件选项，与mixins不同的是extends只能扩展单个选项，与同一组件的mixins发生命名冲突时它的优先级更高；

### 5.Vue子组件是否可以修改父组件的数据？

- 可以修改但不推荐：首先，文档中指出组件开发需要遵循单向数据流原则：即所有的 props 都遵循着**单向绑定**的原则，props 因父组件的更新而变化，避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。如果直接修改子组件props，vue会报错；

- 如果是鉴于以下两种需求更改prop，则建议如下：

  - **prop 被用于传入初始值；而子组件想在之后将其作为一个局部状态**：这时在子组件定义一个局部变量保存prop初始值即可：

    ```js
    const props = defineProps(['initialCounter'])
    const counter = ref(props.initialCounter)
    ```

  - **需要对传入的 prop 值做进一步的转换**：这时基于该 prop 值定义一个计算属性即可：

    ```js
    const props = defineProps(['size'])
    const normalizedSize = computed(() => props.size.trim().toLowerCase())
    ```

- 多数情况下子组件应该抛出一个事件来通知父组件做出改变，以Vue2中sync修饰符结合自定义事件为例：

  ```vue
  //父组件
  <Dialog :show.sync="show"></Dialog>
  //子组件
  <el-button @click="$emit('update:show', false)">取 消</el-button>
  ```


### 6.Vue如何做权限管理？控制到按钮级别的权限怎么做？

- 权限管理一般需求是两个：页面权限和按钮权限
- 下面从前端方案和后端方案分开阐述：
  - 前端方案会把所有路由信息在前端配置，通过路由守卫要求用户登录，用户登录后根据角色过滤出路由表。比如我会配置一个asyncRoutes数组，需要认证的页面在其路由的 **meta** 中添加一个 **roles** 字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。此过滤过程结束，剩下的路由就是该用户能访问的页面，最后通过**router.addRoutes（accessRoutes）**方式动态添加路由即可；
  - 后端方案会把所有页面路由信息存在数据库中，用户登录的时候根据其角色查询得到其能访问的所有页面路由信息返回给前端，前端再通过addRoutes动态添加路由信息

- 按钮权限的控制通常会实现一个指令，例如v-permission，将按钮要求角色通过值传给v-permission指令，在指令的moutned钩子中可以判断当前用户角色和按钮是否存在交集，有则保留按钮，无则移除按钮（是DOM操作）。

- 纯前端方案的优点是实现简单，不需要额外权限管理页面，但是维护起来问题比较大，有新的页面和角色需求就要修改前端代码重新打包部署；服务端方案就不存在这个问题，通过专门的角色和权限管理页面，配置页面和按钮权限信息到数据库，应用每次登陆时获取的都是最新的路由信息，可谓一劳永逸！
- 实现细节：服务端返回的路由信息如何添加到路由器中？

```js
// 前端组件名和组件映射表
const map = {
  // "xx":require("@/views/xx.vue") //同步方式
  "xx": () => import("@/views/xx.vue") // 异步方式 
}
// 后端返回的asyncRoutes
const asyncRoutes = [
  { path: "/xx", component: "xx" }
]
//遍历asyncRoutes，替换component
function mapComponent(asyncRoutes) {
  asyncRoutes.forEach(route => {
    route.component = map[route.component]
    if (route.children) {
      mapComponent(route.children)
    }
  })
  return asyncRoutes
}
mapComponent(asyncRoutes)
```

### 7.说一说对Vue数据响应式的理解

- 答题思路：
  - 1.啥是响应式？
  - 2.为什么vue需要响应式？
  - 3.它能给我们带来什么好处？
  - 4.vue的响应式是怎么实现的？有哪些优缺点？
  - 5.vue3中的响应式的新变化
- 回答范例：
  - 1.所谓数据响应式就是能够**使数据变化可以被检测并对这种变化做出响应**的机制；
  - 2.MVVM框架中要解决的一个核心问题是连接数据层和视图层，通过数据驱动应用，数据变化，视图更新，要做到这点的就需要对数据做响应式处理，这样一旦数据发生变化就可以立即做出更新处理；
  - 3.以vue为例说明，通过数据响应式加上虚拟DOM和patch算法，开发人员只需要操作数据，关心业务，完全不用接触繁琐的DOM操作，从而大大提升开发效率，降低开发难度；
  - 4.vue2中的数据响应式会根据数据类型来做不同处理，如果是对象则采用**Object.defineProperty（）**的方式定义**数据拦截**，当数据被访问或发生变化时，感知并作出响应；如果是数组则通过覆盖数组对象原型的7个变更方法，使这些方法可以额外的做更新通知，从而作出响应。这种机制很好的解决了数据响应化的问题，但在实际使用中也存在一些缺点：比如初始化时的递归遍历会造成性能损失；新增或删除属性时需要用户使用Vue.set/delete这样特殊的api才能生效；对于ES6中新产生的Map、Set这些数据结构不支持等问题；
  - 5.为了解决这些问题，vue3重新编写了这一部分的实现：利用ES6的**Proxy**代理要响应化的数据，它有很多好处，编程体验是一致的，不需要使用特殊api，初始化性能和内存消耗都得到了大幅改善；另外由于响应化的实现代码抽取为独立的reactivity包，使得我们可以更灵活的使用它，第三方的扩展开发起来更加灵活了；

### 8.你了解虚拟DOM吗？

- 分析
  - 现有框架几乎都引入了虚拟DOM来对真实DOM进行抽象，也就是现在大家所熟知的VNode和VDOM，那么为什么需要引入虚拟DOM呢？围绕这个疑问来解答即可！

- 思路
  - 1.vdom是什么？
  - 2.引入vdom的好处是什么？
  - 3.vdom如何生成，又如何成为真实dom？
  - 4.在后续的diff中的作用

- 回答

  - 1.概念：虚拟dom顾名思义就是虚拟的dom对象，它本身就是一个`JavaScript`对象，只不过它是通过不同的属性去描述一个视图结构，相比于真实dom只保留了核心属性，进而使后续操作更加快速；

  - 2.通过引入vdom我们可以获得如下好处：
    - 将真实元素节点抽象成VNode，有效减少直接操作dom次数，从而提高程序性能；

    - 直接操作 dom 是有限制的，比如：diff、clone等操作，一个真实元素上有许多的内容，如果直接对其进行diff操作，会去额外diff一些没有必要的内容；同样的，如果需要进行clone，那么需要将其全部内容进行复制，这也是没必要的。但是，如果将这些操作转移到 JavaScript 对象上，那么就会变得简单了；

    - 操作 dom 是比较昂贵的，频繁的dom操作容易引起页面的重绘和回流，但是通过抽象VNode进行中间处理，可以有效减少直接操作dom的次数，从而减少页面重绘和回流；

    - 方便实现跨平台

      - 同一VNode节点可以渲染成不同平台上的对应的内容，比如：渲染在浏览器是dom元素节点，渲染在Native（iOS、Android）变为对应的控件、可以实现SSR（服务端渲染）、渲染到WebGL中等等；

      - Vue3中允许开发者基于VNode实现自定义渲染器（renderer），以便于针对不同平台进行渲染；

  - 3.vdom如何生成，又如何成为真实dom？以及在diff中的作用
    - 在vue中我们常常会为组件编写模板template，这个模板会被编译器compiler编译为渲染函数（render function），在接下来的挂载（mount）过程中会调用render函数，返回的对象就是虚拟dom。但它们还不是真正的dom，会在后续的patch过程中进一步转化为真实dom：
    - ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\虚拟DOM.png)
    - 挂载过程结束后，vue程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新render，此时就会生成新的vdom，和上一次的渲染结果diff就能得到变化的地方，从而转换为最小量的dom操作，高效更新视图；

### 9.你了解Diff算法吗？

- 思路
  - 1.diff算法是干什么的
  - 2.它的必要性
  - 3.它何时执行
  - 4.具体执行方式
  - 5.拔高：说一下vue3中的优化

- 回答范例

  - 1.概念：Vue中的`diff算法`称为`patching算法`，它由Snabbdom修改而来，虚拟DOM要想转化为真实DOM就需要通过patch方法转换；
  - 2.必要性：
    - 最初Vue1.x视图中每个依赖均有更新函数对应，可以做到精准更新，因此并不需要虚拟DOM和patching算法支持，但是这样粒度过细导致Vue1.x无法承载较大应用；Vue 2.x中为了降低Watcher粒度，每个组件只有一个Watcher与之对应，此时就需要引入patching算法才能精确找到发生变化的地方并高效更新；

  - 3.执行时刻：
    - Vue中diff执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行`render函数`获得最新的虚拟DOM，然后执行patch函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的DOM操作；

  - 4.执行方式：
    - patch过程是一个递归过程，遵循`深度优先、同层比较`的策略；以vue3的patch为例：
      ①首先判断两个节点是否为相同同类节点（isSameVNodeType()，判断key、类型、标签），不同则删除重新创建；
      ②如果双方都是文本则更新文本内容；
      ③如果双方都是元素节点则递归更新子元素，同时更新元素属性；
      更新子节点时又分了几种情况：
      ①新的子节点是文本，老的子节点是数组则清空，并设置文本；
      ②新的子节点是文本，老的子节点是文本则直接更新文本；
      ③新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；
      ④新的子节点是数组，老的子节点也是数组，那么比较两组子节点；
      Vue3中引入的更新策略：编译期优化patchFlags、block等

### 10.说一说你了解的Vue3新特性

- 先说说API相关：官方文档展出的重要更新：

  - Composition API

  - SFC Composition API 语法糖 (<script setup>)

  - Teleport组件

  - Fragments组件

  - Emits选项

  - 自定义渲染器

  - SFC State-driven CSS Variables (v-bind in <style>)

  - SFC <style scoped> can now include global rules or rules that target only slotted content

  - Suspense组件

- 再说说框架特性：

  - 更快：
    - 重写虚拟DOM（编译优化内容的存储、type属性支持更加多样）
    - 编译器优化：静态提升、patchFlags、block（区块）等
    - 基于Proxy的响应式系统（了解Vue3的响应式原理）

  - 更小：更好的摇树优化
  - 更容易维护：TypeScript + 模块化
  - 更容易扩展：
    - 独立的响应式模块
    - 自定义渲染器

### 11.如何定义动态路由，如何获取传递过来的动态参数？如果让你实现一个vue路由，说一说思路

- 回答范例
  - 1.很多时候，我们需要将给定匹配模式的路由映射到同一个组件，这种情况就需要定义动态路由；
  - 2.例如，我们可能有一个User组件，它应该对所有用户进行渲染，但用户ID不同。在Vue Router中，我们可以在路径中使用一个动态字段来实现，例如：{path:'/users/:id'，component:User}，其中:id就是路径参数；
  - 3.路径参数用冒号 : 表示。当一个路由被匹配时，它的params的值将在每个组件中以`this.$route.params`的形式暴露出来；
  - 4.参数还可以有多个，例如/users/:username/posts/:postId；除了`$route.params`之外，$route对象还公开了其他有用的信息，如`$route.query`、`$route.hash`等；

- 实现一个vue路由的思路：

  - 思路分析：

    - 首先思考vue路由要解决的问题：用户点击跳转链接内容切换，页面不刷新；

    - 借助hash或者history api实现url跳转页面不刷新；

    - 同时监听hashchange事件或者popstate事件处理跳转；

    - 根据hash值或者state值从routes表中匹配对应component并渲染之；

  - 回答范例：

    - 需求分析：一个SPA应用的路由需要解决的问题是**页面跳转内容改变同时不刷新**，同时路由还需要以插件形式存在，所以：

    - 1.首先定义一个`createRouter`函数，返回路由器实例，实例内部做几件事：

      - 保存用户传入的配置项；

      - 监听hash或者popstate事件（取决于当前的模式）；

      - 回调里根据path匹配对应路由，render到`router-view`中；

    - 2.将router定义成一个Vue插件，即实现`install`方法，内部做两件事：

      - 注册两个全局组件（`app.component`）：`router-link`和`router-view`，分别实现页面跳转和内容显示；

      - 定义两个全局变量（`app.config.globalProperties`）：`$route`和`$router`，组件内可以访问的当前路由和路由器实例；

### 12.说说key的作用

- 思路分析：
  - 1.给出结论，key的作用是用于优化patch性能；
  - 2.key的必要性；
  - 3.实际使用方式；
  - 4.总结：可从源码层面描述一下vue如何判断两个节点是否相同；

- 回答范例：
  - 1.key的作用主要是为了更高效的更新虚拟DOM；
  - 2.vue在patch过程中**判断两个节点是否是相同节点是key是一个必要条件**，渲染一组列表时，key往往是唯一标识，所以如果不定义key的话，vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个patch过程比较低效，影响性能；
  - 3.实际使用中在渲染一组列表时key必须设置，而且必须是唯一标识，**应该避免使用数组索引作为key，这可能导致一些隐蔽的bug（过程中对数组进行排序等）**；vue中在使用相同标签元素过渡切换时，也会使用key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果；
  - 4.从源码中可以知道，vue判断两个节点是否相同时主要判断两者的key和元素类型等（`isSameVNodeType`），因此如果不设置key，它的值就是undefined，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的；

案例：模拟以下操作

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test1.png)

不使用key：增加3次额外的更新操作和1次E节点的创建和追加操作

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test2.png)

使用key：

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\test3.png)

### 13.说说 nextTick() 的使用和原理

- 答题思路：
  - 1.nextTick是做什么的？
  - 2.为什么需要它呢？
  - 3.开发时何时使用它？
  - 4.下面介绍一下如何使用nextTick
  - 5.原理解读，结合异步更新和nextTick生效方式

- 回答范例：
  - 1.定义：nextTick是等待下一次DOM更新刷新的工具方法；
  - 2.为什么使用：Vue有个异步更新策略，意思是如果数据变化，Vue不会立刻更新DOM，而是开启一个队列，把组件更新函数保存在队列中，在同一事件循环中发生的所有数据变更会异步的批量更新。这一策略导致我们对数据的修改不会立刻体现在DOM上，此时如果想要获取更新后的DOM状态，就需要使用nextTick；
  - 3.开发时，有两个场景我们会用到nextTick：
    - created中想要获取DOM时；
    - 响应式数据变化后获取DOM更新后的状态，比如希望获取列表更新后的高度；
  - 4.如何使用：
    - nextTick签名如下：`function nextTick(callback?:()=>void):Promise<void>`
    - 所以我们只需要在传入的回调函数中访问最新DOM状态即可，或者我们可以await nextTick()方法返回的Promise之后做这件事；
  - 5.原理（为什么在nextTick的回调函数中可以访问到DOM更新）：
    - 在Vue内部，nextTick之所以能够让我们看到DOM更新后的结果，是因为我们传入的callback会被添加到队列刷新函数（flushSchedulerQueue）的后面，这样等队列内部的更新函数都执行完毕，所有DOM操作也就结束了，callback自然能够获取到最新的DOM值；

### 14.说一说watch和computed的区别

- 思路分析：
  - 1.先看computed，watch两者定义，列举使用上的差异；
  - 2.列举使用场景上的差异，如何选择；
  - 3.使用细节、注意事项；
  - 4.vue3变化；

- 回答范例：

  - 1.computed定义：接受一个 getter 函数，返回一个只读的响应式 `ref` 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象；watch定义：侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数，可以传递对象，设置deep、immediate等选项；

  - 2.计算属性可以从组件数据派生出新数据，最常见的使用方式是设置一个函数，返回计算之后的结果，computed和methods的差异是它具备缓存性，如果依赖项不变时不会重新计算。侦听器可以侦测某个响应式数据的变化并执行副作用，常见用法是传递一个函数，执行副作用，watch没有返回值，但可以执行异步操作等复杂逻辑；
  - 3.计算属性常用场景是简化行内模板中的复杂表达式，模板中出现太多逻辑会使模板变得随肿不易维护。侦听器常用场景是状态变化之后做一些额外的DOM操作或者异步操作。选择时首先看是否需要派生出新值，一般来说能用计算属性实现的方式首选计算属性；

  - 4.vue3中watch选项发生了一些变化，例如不再能侦测一个点操作符之外的字符串形式的表达式；响应式API中新出现了watch、watchEffect可以完全替代目前的watch选项，且功能更加强大；

### 15.阐述Vue子组件和父组件创建和挂载顺序

- 回答范例

  - 1.创建过程自上而下，挂载过程自下而上；即：
    - `parent created`
    - `child created`
    - `child mounted`
    - `parent mounted`
  - 2.之所以会这样是因为Vue创建过程是一个递归过程，先创建父组件，有子组件就会创建子组件，因此创建时先有父组件再有子组件；子组件首次创建时会添加mounted钩子到队列，等到patch结束再执行它们，可见子组件的mounted钩子是先进入到队列中的，因此等到patch结束执行这些钩子时也先执行，所以是子组件先挂载；

  - Vue3初始化流程协助理解：

![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\Vue3初始化流程.png)

### 16.Vue中如何缓存组件、更新组件？

- 缓存组件使用`keep-alive`组件，这是一个非常常见且有用的优化手段，vue3中keep-alive有比较大的更新，能说的点比较多；

- 思路

  - 1.缓存用`keep-alive`，阐述它的作用与用法；
  - 2.使用细节，例如缓存指定/排除、结合router-view和transition；
  - 3.组件缓存后更新可以利用`activated`或者`beforeRouteEnter`钩子；
  - 4.原理阐述；

- 回答范例

  - 1.开发中缓存组件使用`keep-alive`，keep-alive是vue内置组件，keep-alive包裹动态组件component时，会缓存不活动的组件实例，而不是销毁它们，这样在组件切换过程中将状态保留在内存中，防止重复渲染：

  - ```vue
    <keep-alive>
      <component :is="tab"></component>
    </keep-alive>
    ```

  - 2.结合属性`include`和`exclude`可以明确指定缓存哪些组件或排除缓存指定组件；vue3中结合router-view时变化较大，之前是keep-alive包裹router-view，现在需要反过来用router-view包裹keep-alive，通过 `v-slot` 在 `RouterView` 内部使用：

  - ```vue
    //Vue2
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    //Vue3
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    ```

  - 3.缓存后如果要获取数据，解决方案可以有以下两种：

    - `beforeRouteEnter`：在有vue-router的项目，每次进入路由的时候，都会执行beforeRouteEnter：

    - ```js
      beforeRouteEnter (to, from, next) {
        next(vm=>{
          console.log(vm)
          // 每次进入路由执行
          vm.getData()
        })
      }
      ```

    - `activated`：在keep-alive缓存的组件被激活的时候，都会执行activated钩子：

    - ```js
      activated(){
        this.getData()
      }
      ```

  - 4.`keep-alive`是一个通用组件，它内部定义了一个map，缓存创建过的组件实例，它返回的渲染函数内部会查找内嵌的component组件对应组件的VNode，如果该组件在map中存在就直接返回它。由于component的is属性是个响应式数据，因此只要它变化，keep-alive的render函数就会重新执行；

### 17.如果从0到1构建一个Vue项目？

- 思路
  - 1.构建项目，脚手架创建项目基本结构；
  - 2.引入必要的插件：Vuex、vue-router、axios等；
  - 3.代码规范：prettier，eslint；
  - 4.提交规范：husky，lint-staged；
  - 5.其他常用：svg-loader，vueuse，nprogress；
  - 6.常见目录结构；

- 回答范例

  - 1.从0创建一个项目我大致会做以下事情：项目构建、引入必要插件、代码规范、提交规范、常用库和组件；
  - 2.目前vue3项目我会用vite或者create-vue创建项目；
  - 3.接下来引入必要插件：路由插件vue-router、状态管理vuex/pinia、ui库我比较喜欢element-plus和antd-vue、http工具我会选axios；
  - 4.其他比较常用的库有vueuse，nprogress，图标库可以使用vite-svg-loader
  - 5.下面是代码规范：结合prettier和eslint（用的哪一套规范，如何制定的，是否可以列举几个）
  - 6.最后是提交规范，可以使用husky，lint-staged，commitlint

  - 7.目录结构我有如下习惯：
    - `.vscode`：用来放项目中的vscode配置
    - `plugins`：用来放vite插件的plugin配置
    - `public`：用来放一些诸如页头icon之类的公共文件，会被打包到dist根目录下
    - `src`：用来放项目代码文件
    - `api`：用来放http的一些接口配置
    - `assets`：用来放一些CSS之类的静态资源
    - `components`：用来放项目通用组件
    - `layout`：用来放项目的布局
    - `router`：用来放项目的路由配置
    - `store`：用来放状态管理Pinia的配置
    - `utils`：用来放项目中的工具方法类
    - `views`：用来放项目的页面文件

### 18.实际工作中，你总结的Vue最佳实践有哪些？

- 思路：查看vue官方文档：风格指南（重点关注AB级）、最佳实践（生产部署、性能、访问、安全）
- 回答范例
  - 从编码风格、性能、安全等方面说几条：
  - 1.编码风格方面：
    - 命名组件时使用“多词"风格避免和HTML元素冲突；
    - 使用”细节化"方式定义属性而不是只有一个属性名；
    - 属性名声明时使用“驼峰命名"，模板或jsx中使用”肉串命名"；
    - 使用v-for时务必加上key，且不要跟v-if写在一起；
  - 2.性能方面：
    - 路由懒加载减少应用尺寸；
    - 利用SSR减少首屏加载时间；
    - 利用v-once渲染那些不需要更新的内容；
    - 一些长列表可以利用虚拟滚动技术避免内存过度占用；
    - 对于深层嵌套对象的大数组可以使用`shallowRef`或`shallowReactive`降低开销；
    - 避免不必要的组件抽象；
  - 3.安全：
    - 不使用不可信模板，例如使用用户输入拼接模板：template：<div>+userProvidedString +
      </div>
    - 小心使用v-html，:url，:style等，避免html、url、样式等注入
    - 4.等等…

### 19.说一说你对Vuex的理解

- 回答范例
  - 1（定义）：Vuex是一个专为Vue应用开发的`状态管理模式+库`。它采用集中式存储，管理应用的所有组件的状态，并以相应的规则保证状态`以一种可预测的方式`发生变化；
  - 2（必要性）：我们期待以一种简单的“`单向数据流`"的方式管理应用，即`状态->视图->操作`单向循环的方式；但当我们的应用遇到多个组件共享状态时，比如：多个视图依赖于同一状态或者来自不同视图的行为需要变更同一状态。此时单向数据流的简洁性很容易被破坏。因此，我们有必要把组件的共享状态抽取出来，以一个`全局单例模式`管理；通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，我们的代码将会变得更结构化且易维护；这是vuex存在的必要性，它和react生态中的redux之类是一个概念，都是为了解决这一问题。
  - 3（何时使用）：Vuex解决状态管理的同时引入了不少概念：例如`state、mutation、action`等，是否需要引入还需要根据应用的实际情况衡量一下：如果不打算开发大型单页应用，使用Vuex反而是繁琐冗余的，一个简单的store模式就足够了。但是，如果要构建一个中大型单页应用，Vuex基本是标配；
  - 4（个人使用感受）：使用稍微有些繁琐，尤其是在模块嵌套时，调用状态时的命名空间使用起来就比较容易混淆（子模块需要用点，全局状态则不需要）；

- 可能的追问：Vuex中mutation和action的区别是什么？
  -  vuex中的state数据不允许直接修改，所以引入了`mutations`用于定义方法来修改state中的数据，但是只能同步修改；如果异步修改会造成调试工具跟实际数据不对应，所以vuex又引入了`actions`，用于异步触发mutations中的方法；总的来说：`mutations`中的方法可以直接修改state数据，而`actions`是异步执行mutations中的方法，所以它都可以改数据，区别是一个是同步一个是异步。

### 20.说一说Vue从template到render的处理过程

- 问我们template到render过程，其实是问Vue`编译器`工作原理；
- 思路
  - 1.引入vue编译器概念；
  - 2.说明编译器的必要性；
  - 3.阐述编译器的工作流程；

- 回答范例
  - 1.Vue中有个独特的编译器模块，称为`"compiler"`，它的主要作用是将用户编写的template编译为js中可执行的render函数；
  - 2.之所以需要这个编译过程是为了便于前端程序员能高效的编写视图模板；相比而言，我们还是更愿意用HTML来编写视图，直观且高效。手写render函数不仅效率底下，而且失去了编译期的优化能力，因此compiler的过程是必须的；
  - 3.在Vue中编译器会先对template进行解析，这一步称为`parse`，结束之后会得到一个JS对象，我们成为抽象语法树AST，然后是对AST进行深加工的转换过程，这一步称为`transform`，最后将前面得到的AST生成（`generate`）JS代码，也就是render函数；

- 可能的追问：

  - Vue中编译器的执行时刻？
    - 根据引入Vue的运行时不同，编译器的执行时刻是不同的：如果使用webpack环境，即Vue的预打包环境，这时webpack的vue-loader会提前将模板进行编译，这时编译器的执行时刻就是在打包阶段，即预编译；如果是非运行时版本，即携带编译器的版本，这时编译器就会在运行时工作：发现一个组件有模板没有渲染函数，就会去编译模板，将其转换为渲染函数，也就是发生在组件的创建阶段。

  - React中有没有编译器？
    - react中又jsx，这不是编译器，可以理解为一种语法糖，语言本身没有变化，通过babel-loader将js变为js，因此react是没有编译器的。

### 21.说一说Vue实例在挂载过程中发生了什么

- 挂载过程中完成了两件最重要的事：初始化（App实例的创建、数据状态的初始化、选项的处理、建立响应式数据等）建立更新机制，把这两件事说清除即可
- 回答范例
  - 1.挂载过程指的是app.mount()过程，这是个初始化过程，整体上做了两件事：初始化和建立更新机制：
  - 2.初始化会创建组件实例、初始化组件状态、创建各种响应式数据；
  - 3.建立更新机制这一步会在app实例mount时立即执行一次组件更新函数，这会首次执行组件渲染函数并执行patch将前面获得Vnode转换为dom；同时首次执行渲染函数会创建它内部响应式数据和组件更新函数之间的依赖关系，也就是依赖收集的过程，会创建一个数据结构，将来数据变化时会根据这个结构找到相应的更新函数，重新执行更新函数，进而实现页面的更新，这就是所谓的更新机制的建立：源码层面的执行顺序：
    - createApp --> mount --> render --> patch --> processComponent --> mountComponent
    - mountComponent内部做三件事情：创建组件实例、初始化当前组件实例（setupComponent）、建立更新机制（setupRenderEffect），setupRenderEffect内部定义组件更新函数（componentUpdateFn），componentUpdateFn内部会继续执行渲染函数，递归执行patch，得到dom；

- 可能的追问：
  - 1.响应式数据如何建立？
  - 依赖关系如何建立？

### 22.Vue3的设计目标是什么？做了哪些优化？

- 思路
  - 从以下几方面分门别类阐述：易用性、性能、扩展性、可维护性、开发体验等

- 回答范例
  - 1.Vue3的最大设计目标是替代Vue2（皮一下），为了实现这一点，Vue3在以下几个方面做了很大改进，如：易用性、框架性能、扩展性、可维护性、开发体验等；
  - 2.易用性方面主要是API简化，比如`v-model`在Vue3中变成了Vue2中`v-model`和`sync`修饰符的结合体，用户不用区分两者不同，也不用选择困难。类似的简化还有用于渲染函数内部生成VNode的h(type，props，children)，其中props不用考虑区分属性、特性、事件等，框架替我们判断，易用性大增；
  - 3.开发体验方面，新组件 `Teleport` 传送门、`Fragments`、`Suspense`等都会简化特定场景的代码编写，`SFC Composition API` 语法糖更是极大提升我们开发体验；
  - 4.扩展性方面提升如独立的`reactivity`模块，`custom rendererAPI`等；
  - 5.可维护性方面主要是`Composition API`，更容易编写高复用性的业务逻辑。还有对TypeScript支持的提升；
  - 6.性能方面的改进也很显著，例如编译期优化、基于Proxy的响应式系统等；

- 可能的追问
  - 1.Vue3做了哪些编译优化？
  - 2.`Proxy`和`defineProperty` 有什么不同？

### 23.你了解哪些Vue性能优化方法？

- 答题思路：
  - 根据题目描述，这里主要探讨代码层面的优化；

- 回答范例：

  - 我这里主要从Vue代码编写层面说一些优化手段，例如：代码分割、服务端渲染、组件缓存、长列表优化等

  - 1.最常见的`路由懒加载`：有效拆分App尺寸，访问时才异步加载：通过vite或者webpack提供的动态加载方法import加载组件，打包时候就可以分包打包，这样就使得将来程序变得更小更快，我需要访问时才异步加载：

```js
const router = createRouter({
  // 借助webpack的import实现异步组件
  routes: [{ path: "/foo", component: () => import("./Foo.vue") }],
})
```

- 2.`keep-alive`缓存页面：避免重复创建组件实例，且能保留缓存组件的状态，比如保留之前滚动条的位置：

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component"></component>
  </keep-alive>
</router-view>
```

- 3.使用`v-show`复用DOM：避免重复创建组件：

```vue
<template>
  <div class="cell">
    <!-- ！—这种情况用v-show复用DOM，比v-if效果好 -->
    <div v-show="value" class="on">
      <Heavy :n="10000" />
    </div>
    <section v-show="!value" class="off">
      <Heavy :n="10000" />
    </section>
  </div>
</template>
```

- 4.`v-for`遍历避免同时使用`v-if`：实际上两者在Vue3与Vue2中的优先级不同，在Vue3中已经是个错误写法：

- 5.合适时机使用`v-once`和`v-memo`：
  - 如果有一个数据只显示一次，之后就不再变化了，那么可以使用`v-once`:

```vue
<!--single element-->
<span v-once>This will never change:{{ msg }}</span>
<!--the element have children-->
<div v-once>
  <h1>comment</h1>
  <p>{{ mss }}</p>
</div>
<!--component-->
<my-component v-once :comment="msg"></my-component>
<!--`v-for` directive-->
<ul>
  <li v-for="i in list" v-once>{{ i }}</li>
</ul>
```

- `v-memo`可以让我们按条件去跳过一些子树的更新，下面这个列表只会更新选中状态变化项：

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  <p>ID:{{ item.id }} - selected:{{ item.id === selected }}</p>
  <p>……more child nodes</p>
</div>
```

- 6.长列表性能优化：如果是大数据长列表，可采用虚拟滚动，只渲染少部分可视区域的内容：

```vue
<recycle-scroller 
  class="items" 
  :items="items" 
  :item-size="24"
>
  <template v-slot="{ item }">
    <FetchItemView 
      :item="item" 
      @vote="voteItem(item)" 
    />
  </template>
</recycle-scroller>
//一些开源库：
//vue-virtual-scroller
//vue-virtual-scroll-grid
```

- 7.事件的销毁：Vue 组件销毁时，会自动解绑它的全部指令及监听器相关的事件，但是仅限于组件本身的事件。因此一些自定义事件是不会取消的，因此像定时器的监听需要在卸载前手动取消；

- 8.图片懒加载
  - 对于图片过多的页面，为了加速页面加载速度，很多时候我们需要将页面内未出现在可视区域的图片先不做加载，等到滚动到可视区域后再去加载：

```vue
<img v-lazy="/static/img/1.png">
//参考项目：vue-lazyload
```

- 9.第三方插件按需引入
  - 像`element-plus`这样的第三方组件库可以按需引入避免体积太大；

- 10.子组件分割策略：较重的状态组件适合拆分，相反：不宜过度拆分组件，尤其是为了所谓的组件抽象将一些不需要渲染的组件特意抽出来，因为组件实例的消耗远大于纯dom节点；

- 11.服务端渲染（SSR）/静态站点生成（SSG），这就属于同构开发层面了，如果存在首屏渲染速度过慢的问题可以考虑SSR、SSG方案；

### 24.Vue组件为什么只能有一个根节点？

- 回答思路

  - 给一条自己的结论

  - 解释为什么会这样

  - vue3解决方法原理

- 范例
  - vue2中组件确实只能有一个根，写多根会报错，但vue3中组件已经可以多根节点了；
  - 之所以需要这样是因为vdom是一颗单根树形结构，`patch` 方法在遍历的时候从根节点开始遍历，它要求只有一个根节点。组件也会转换为一个vdom，自然应该满足这个要求；
  - vue3中之所以可以写多个根节点，是因为引入了`Fragment`的概念，这是一个抽象的节点，如果发现组件是多根的，就创建一个`Fragment`节点，把多个根节点作为它的children。将来`patch`的时候，如果发现是一个`Fragment`节点，则直接遍历children创建或更新。

### 25.你使用过Vuex的module吗？

- 思路
  - 1.概念和必要性
  - 2.怎么拆
  - 3.使用细节
  - 4.优缺点

- 范例
  - 1.当项目规模变大之后，单独一个store对象会过于庞大臃肿，通过modules模块方式可以拆分开来便于维护；
  - 2.可以按之前规则单独编写子模块代码，然后在主文件中通过modules选项组织起来：`createStore（{modules:{...}}）`
  - 3.不过使用时要注意访问子模块状态时需要加上注册时模块名：`store.state.a.xxx`，但同时 `getters`、`mutations`和`actions`又在全局空间中，使用方式和之前一样。如果要做到完全拆分，需要在子模块加上`namespace`选项，此时再访问它们的选项就要加上命名空间前缀；
  - 4.很显然，模块的方式可以拆分代码，但是缺点也很明显，就是使用起来比较繁琐复杂，容易出错。而且类型系统支持很差，不能给我们带来帮助。`pinia`显然在这方面有了很大改进，是时候切换过去了；

- 可能的追问：你用过pinia吗，都做了哪些改善？

### 26.为什么要使用路由懒加载？

- 这是一道应用题。当打包应用时，JavaScript包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问时才加载对应组件，这样就会更加高效；

```js
// 将
// import UserDetails from "./views/UserDetails"
// 替换为
const UserDetails = () => import("./views/UserDetails")

const router = createRouter({
  // ...
  routes: [{ path: "/user/:id", component: UserDetails }],
})
```

- 思路
  - 1.必要性
  - 2.何时用
  - 3.怎么用
  - 4.使用细节

- 回答范例
  - 1.当打包构建应用时，JavaScript包会变得非常大，影响页面加载。利用路由懒加载我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样会更加高效，是一种优化手段；
  - 2.一般来说，对所有的路由都使用动态导入是个好主意；
  - 3.给`component`选项配置一个返回Promise组件的函数就可以定义懒加载路由。通常结合webpack提供的动态导入方法`import`使用：
    `{path:'/users/:id',component:()=>import('./views/UserDetails')}`
  - 4.结合注释`()=>import(/*webpackChunkName:"group-user" */ './UserDetails.vue')`可以做webpack代码分块；
    vite中结合`rollupOptions`定义分块；
  - 5.这里注意其实懒加载的写法是告诉打包器我要异步加载路由，但不是异步组件，路由中不能写异步组件，组件中使用异步组件是没问题的；

- 知其所以然
  - `component`（和`components`）配置如果接收一个返回 Promise 组件的函数，Vue Router只会在第一次进入页面时才会获取这个函数，然后使用缓存数据；

### 27.ref和reactive有何差异？

- 回答思路
  - 1.两者概念；
  - 2.两者使用场景；
  - 3.两者异同；
  - 4.使用细节；
  - 5.原理；

- 回答范例
  - 1.ref 接收内部值（inner value）返回响应式`Ref对象`，reactive返回响应式代理对象；
  - 2.从定义上看ref通常用于处理单值的响应式，reactive用于处理对象类型的数据响应式；
  - 3.两者均是用于构造响应式数据，但是ref主要解决原始值的响应式问题；
  - 4.ref返回的响应式数据在JS中使用需要加上`.value`才能访问其值，在视图中使用会自动解包，不需要`.value`；ref也可以接收对象或数组等非原始值，但内部依然是reactive实现响应式；reactive内部如果接收Ref对象会自动解包；使用展开运算符`（…）`展开reactive返回的响应式对象会失去响应性，可以结合`toRefs()`将值转换为Ref对象之后再展开；
  - 5.reactive内部使用`Proxy`代理传入对象并拦截该对象各种操作（trap），从而实现响应式；ref内部封装一个`Reflmpl`类，并设置`get value/set value`，拦截用户对值的访问，从而实现响应式；

### 28.watch和watchEffect有何异同？

- 思路
  - 1.给出两者定义；
  - 2.给出场景上的不同；
  - 3.给出使用方式和细节；
  - 4.原理阐述；

- 范例
  - `watchEffect`立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数；`watch`是
    侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数；

  - `watchEffect(effect)`是一种特殊`watch `，传入的函数既是依赖收集的数据源，也是回调函数。如果我们不关心响应式数据变化前后的值，只是想拿这些数据做些事情，那么`watchEffect`就是我们需要的。`watch`更底层，可以接收多种数据源，包括用于依赖收集的`getter函数`，因此它完全可以实现`watchEffect`的功能，同时由于可以指定getter函数，依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时我们会使用watch；

  - 在使用细节上，`watchEffect`在使用时，传入的函数会立刻执行一次。 `watch`默认情况下并不会执行回调函数，除非我们手动设置`immediate`选项；

  - 从实现上来说，`watchEffect(fn)`相当于`watch(fn,fn,{immediate:true})`

  - 底层来说：watchEffect和watch都是借助doWatch函数，只不过watch需要传入第二个回调cb，而watchEffect不需要传：

    ```tsx
    //watchEffect
    export function watchEffect(
      effect:WatchEffect,
      options?:WatchOptionsBase
    ):WatchStopHandle{
      return doWatch(effect,null,options)
    }
    //watch
    export function watch<T = any，Immediate extends Readonly<boolean> = false>(
      source: T | watchSource<T>,
      cb: any,options?:watchOptions<Immediate>
    ):watchStopHandle {
      return doWatch(source as any,cb, options)
    }
    //很明显，watchEffect就是一种特殊的watch实现
    ```


### 29.SPA和SSR有何区别？

- 我们现在编写的Vue、React和Angular应用大多数情况下都会在一个页面中，点击链接跳转页面通常是内容切换而非页面跳转，由于良好的用户体验逐渐成为主流的开发模式。但同时也会有首屏加载时间长，SEO不友好的问题，因此有了SSR，这也是为什么面试中会问到两者的区别；
- 思路分析
  - 1.两者概念；
  - 2.两者优缺点分析；
  - 3.使用场景差异；
  - 4.其他选择；

- 回答范例
  - 1.`SPA（Single Page Application）`即单页面应用。一般也称为客户端渲染`（Client Side Render）`，简称CSR。`SSR（Server Side Renler）`即服务端渲染。一般也称为多页面应用`（Mulpile Page Application）`，简称MPA；
  - 2.`SPA`应用只会首次请求html文件，后续只需要请求JSON数据即可，因此用户体验更好，节约流量，服务端压力也较小。但是首屏加载的时间会变长，而且SEO不友好。为了解决以上缺点，就有了`SSR`方案，由于HTML内容在服务器一次性生成出来，首屏加载快，搜索引擎也可以很方便的抓取页面信息。但同时`SSR`方案也会有性能，开发受限等问题；
  - 3.在选择上，如果我们的应用存在首屏加载优化需求，SEO需求时，就可以考虑`SSR`；
  - 4..但并不是只有这一种替代方案，比如对一些不常变化的静态网站，SSR反而浪费资源，我们可以考虑预渲染`（prerender）`方案：具体是通过插件将SPA程序中的一部分预渲染为HTML文件直接加载。另外`nuxt.js/next.js`中给我们提供了`SSG（Static Site Generate）`静态网站生成方案也是和好的静态站点解决方案，结合一些CI手段，可以起到很好的优化效果，且能节约资源；
  - 5.了解SSR和SPA在实现上的区别：

- SSR：一次请求一次响应就看到页面：
  - ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\24.png)

- SPA：至少发送两次请求看到首页数据：
  - ![](C:\Users\Mocheng\Desktop\Study\03每天一道面试题\img\24-2.png)

### 30.vue-loader是什么，它有什么作用？

- 思路
  - vue-loader是什么东西；
  - vue-loader的作用；
  - vue-loader何时生效；
  - vue-loader如何工作；

- 回答范例
  - 1.`vue-loader`是用于处理单文件组件（SFC，Single-File Component）的webpack loader；
  - 2.因为有了`vue-loader`，我们就可以在项目中编写SFC格式的Vue组件，我们可以把代码分割为<template>、<script>和<style>，代码会异常清晰。结合其他loader我们还可以用Pug编写<template>，用SASS编写<style>，用TS编写<script>。我们的<style>还可以单独作用当前组件；
  - 3.webpack打包时，会以loader的方式调用`vue-loader`，因此它会在打包时去执行；
  - 4.`vue-loader`被执行时，它会对SFC中的每个语言块用单独的loader链处理，最后将这些单独的块装配成最终的组件模块；

### 31.你用过自定义指令吗？

- 分析：这是一道API题，我们可能写的自定义指令少，但是我们用的多呀，多举几个例子就行；
- 使用：

```js
// Vue2
directives: {
  focus: {
    inserted(el, binding, vnode) {
      el.focus()
    }
  }
}
// Vue2全局注册
Vue.directive("focus", {
  inserted(el, binding, vnode) {
    el.focus()
  },
})
// Vue3 setup
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
// Vue3全局注册
app.directive("focus", {
  mounted: (el) => {
    el.focus()
  },
})
```

- 思路
  - 1.定义；
  - 2.何时用；
  - 3.如何用；
  - 4.常用指令；
  - 5.vue3变化；

- 回答范例
  - 1.Vue有一组默认指令，比如`v-model`或`v-for`，同时Vue也允许用户注册自定义指令来扩展Vue能力；
  - 2.自定义指令主要完成一些可复用低层级DOM操作；
  - 3.使用自定义指令分为定义、注册和使用三步：
    - 定义自定义指令有两种方式：对象和函数形式，前者类似组件定义，有各种生命周期；后者只会在`mounted`和`updated`时执行；
    - 注册自定义指令类似组件，可以使用`app.directive()`全局注册，或者使用`{directives:{xxx}`局部注册；
    - 使用时在注册名称前加上`v-`即可，比如`v-focus`；
  - 4.我在项目中常用到一些自定义指令，例如：
    - 复制粘贴v-copy
    - 长按v-longpress
    - 防抖v-debounce
    - 图片懒加载v-lazy
    - 按钮权限v-premission
    - 页面水印v-waterMarker
    - 拖拽指令v-draggable
  - 5.vue3中指令定义发生了比较大的变化，主要是钩子的名称保持和组件一致，这样开发人员容易记忆，不易犯错。另外在V3.2之后，可以在setup中以一个小写v开头方便的定义自定义指令了；

### 32.$attrs和$listeners是做什么的以及它们的使用场景

- 分析

  - API考察，但$attrs和$listeners是比较少用的边界知识，而且vue3有变化，$listeners已经移除，还是有细节可说的；

- 思路

  - 1.这两个api的作用；
  - 2.使用场景分析；
  - 3.使用方式和细节；
  - 4.vue3变化；
- 范例
  - 1.我们可能会有一些属性和事件没有在props中定义，这类称为非属性特性，结合`v-bind`指令可以直接透传给内部的子组件；
  - 2.这类“属性透传”常常用于包装高阶组件时往内部传递属性，常用于爷孙组件之间传参。比如我在扩展A组件时创建了组件B，然后在组件C中使用B，此时C组件传递的属性中只有props里面声明的属性是给B使用的，其他的都是A需要的，此时就可以利用`v-bind="$attrs"`透传下去；
  - 3.最常见用法是结合v-bind做展开；`$attrs`本身不是响应式的，除非访问的属性本身是响应式对象；
  - 4.vue2中使用$listeners传递事件，vue3中已移除，均合并到`$attrs`中，使用起来更简单了；

- 原理
  - 查看透传属性foo和普通属性bar，发现vnode结构完全相同，这说明Vue3中将分辨两者的工作由框架完成，而非用户指定：

```vue
<template>
  <h1>{{msg}}</h1>
  <comp foo="foo" bar="bar"></comp>
</template>

<template>
  <div>
    {{$attrs.foo}} {{bar}}
  </div>
</template>

<script setup>
defineProps({
  bar: String
})
</script>

_createVNODE(Comp,{
  foo:"foo",
  bar:"bar"
})
```



### 33.v-once的使用场景有哪些？

分析

- `v-once`是Vue中内置指令，很有用的API，在优化方面经常会用到，不过小伙伴们平时可能容易忽略它；

体验

- 仅渲染元素和组件一次，并且跳过未来更新，直接从缓存中获取保存的状态：

- ```vue
  <!-- single element -->
  <span v-once>This will never change:{{msg}}</span>
  
  <!-- the element have children -->
  <div v-once>
    <h1>Comment</h1>
    <p>{{msg}}</p>
  </div>
  
  <!-- component -->
  <my-component v-once :comment="msg"></my-component>
  
  <!-- 'v-for' directive -->
  <ul>
    <li v-for="i in list" v-once>{{}}</li>
  </ul>
  ```

思路
- 1.`v-once`是什么；
- 2.什么时候使用；
- 3.如何使用；
- 4.扩展`v-memo`；
- 5.探索原理；

回答范例
- 1.`v-once`是vue的内置指令，作用是仅渲染指定组件或元素一次，并跳过未来对其的更新；
- 2.如果我们有一些元素或者组件在初始化渲染之后不再需要变化，这种情况下适合使用`v-once`，这样哪怕这些数据变化，vue也会跳过更新，是一种代码优化手段；
- 3.我们只需要作用的组件或元素上加上`v-once`指令即可；
- 4.vue3.2之后，又增加了`v-memo`指令，可以有条件缓存部分模板并控制它们的更新，可以用在长列表的更新，说控制力更强了；
- 5.其原理是编译器发现元素上面有`v-once`时，会将首次计算结果存入缓存对象，组件再次渲染时就会从缓存获取，从而避免再次计算；

原理

```js
<template>
  <h1>{{msg}}</h1>
</template>
<script setup>
import { ref } from "vue"
const msg = ref("Hello,world!")
</script>

//编译
return (_ctx, _cache) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    //从缓存获取vnode
    _cache[0] || (
      _setBLockTracking(-1),
      _cache[0] = _createElementVNode("h1", null, [
        createTextVNode(_toDispLaystring(msg.value), 1/*TEXT*/)
      ]),
      -setBLockTracking(1),
      _cache[0]
    ),
    // ...
  ])
  )
}
```

### 34.什么是递归组件

- 分析
  - 递归组件我们用的比较少，但是在`Tree、Menu`这类组件中会被用到；
- 体验
  - 组件通过组件名称引用它自己，这种情况就是递归组件

- ```vue
  <template>
    <li>
      <div>{{model.name}}</div>
      <ul v-show="isOpen" v-if="isFolder">
        <!--注意这里：组件递归渲染了它自己-->
        <TreeItem 
          class="item" 
          v-for="model in model.children" 
          :model="model">
        </TreeItem>
      </ul>
    </li>
  </template>
  <script>
  export default {
    name: 'TreeItem'
    //…
  }
  </script>
  ```

- 思路

  - 1.下定义；
  - 2.使用场景；
  - 3.使用细节；
  - 4.原理阐述；

- 回答范例

  - 1.如果某个组件通过组件名称引用它自己，这种情况就是递归组件；

  - 2.实际开发中类似`Tree、Menu`这类组件，它们的节点往往包含子节点，子节点结构和父节点往往是相同的。这类组件的数据往往也是树形结构，这种都是使用递归组件的典型场景；

  - 3.使用递归组件时，由于我们并未也不能在组件内部导入它自己，所以需要设置组件`name`属性，用来查找组件定义，如果使用SFC，则可以通过SFC文件名推断。组件内部通常也要有递归结束条件，比如`model.children` 这样的判断；

  - 4.查看生成的渲染函数可知，递归组件查找时会传递一个布尔值给`resolveComponent`，这样实际获取的组件就是当前组件本身；

  - ```vue
    //范例
    //父组件
    <template>
      <h1>{{msg}}</h1>
      <Tree :model="model"></Tree>
    </template>
    
    <script setup>
    import { ref, reactive } from "vue"
    import Tree from '@/components/Tree.vue'
    const msg = ref("递归组件")
    const model = {
      label: "node-1",
      children: [
        { label: "node-1-1" },
        { label: "node-1-2" },
      ]
    }
    </script>
    //递归组件
    <template>
      <div>{{model.label}}</div>
      <Tree v-for="(item, index) in model.children" :key="index" :model="item"></Tree>
    </template>
    
    <script setup>
    import { ref, reactive } from "vue"
    defineProps({ model: Object })
    </script>
    ```

    

### 35.什么是异步组件？

- 体验

  - 在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件；

  - ```js
    import { defineAsyncComponent } from 'vue';
    const AsyncComp = defineAsyncComponent(() => {
      // 加载函数返回Promise
      return new Promise((resolve, reject) => {
        // 从服务器获取组件
        resolve(/** 获取的组件 **/)
      })
    })
    
    // 借助打包工具实现ES模块动态导入
    const AsyncComp = defineAsyncComponent(() => import("./components/MyComp.vue"))
    ```

- 思路
  - 1.异步组件作用；
  - 2.何时使用异步组件；
  - 3.使用细节；
  - 4.和路由懒加载的不同；
- 范例
  - 1.在大型应用中，我们需要分割应用为更小的块，并且在需要组件时再加载它们；
  - 2.我们不仅可以在路由切换时懒加载组件，还可以在页面组件中继续使用异步组件，从而实现更细的分割粒度；
  - 3.使用异步组件最简单的方式是直接给 `defineAsyncComponent` 指定一个loader函数，结合ES模块动态导入函数`import`可以快速实现。我们甚至可以指定`loadingComponent`和`errorComponent`选项从而给用户一个很好的加载反馈；另外Vue3中还可以结合`Suspense`组件使用异步组件；
  - 4.异步组件容易和路由懒加载混淆，实际上不是一个东西。异步组件不能被用于定义懒加载路由上，处理它的是vue框架，而处理路由组件加载的是vue-router；但是可以在懒加载的路由组件中继续使用异步组件；

- 原理

  - `defineAsyncComponent` 是一个工厂函数，返回一个包装组件。包装组件根据加载器的状态（异步组件加载器或者异步组件定义）决定渲染什么内容

  - ```ts
    //源码
    export function defineAsyncComponent<
      T extends Component = { new (): ComponentPublicInstance }
    >(source: AsyncComponentLoader<T> | AsyncComponentOptions<T>): T {
      if (isFunction(source)) {
        source = { loader: source }
      }
    
      const {
        loader,
        loadingComponent,
        errorComponent,
        delay = 200,
        timeout, // undefined = never times out
        suspensible = true,
        onError: userOnError
      } = source
      ...
      }
    ```

### 36.如何处理Vue项目中的错误？

- 分析

  - 这是一个综合应用题目，在项目中我们常常需要将App的异常上报，此时错误处理就很重要了；这里要区分错误的类型，进而针对性做收集。然后将收集到的错误信息上报服务器；

- 思路

  - 1.首先区分错误类型；
  - 2.如何根据错误的不同类型做相应处理；
  - 3.收集的错误如何上报给服务器；

- 范例

  - 1.应用中的错误类型通常分为`接口异常`和`代码逻辑异常`；
  - 2.我们需要根据不同错误类型做相应处理：接口异常是我们请求后端接口过程中发生的异常，可能是请求失败，也可能是请求获得了服务器响应，但是返回的是错误状态。以Axios为例，这类异常我们可以通过封装Axios，在拦截器中统一处理整个应用中的请求错误。代码逻辑异常是我们编写的前端代码中存在逻辑上的错误造成的异常，Vue应用中最常见的方式是使用全局错误处理函数`app.config.errorHandler` 收集错误；
  - 3.收集到错误之后，需要统一处理这些异常：分析错误，获取需要的错误信息和数据。这里该有效区分错误类型，如果是请求错误，需要上报接口信息，参数，状态码等；对于前端逻辑异常，获取错误名称和详情即可。另外还可以收集应用名称、环境、版本、用户信息，所在页面等。这些信息可以通过 vuex或pinia存储的全局状态和路由信息获取；

- 实践

- ```js
  // 处理接口异常
  // 响应拦截器
  requests.interceptors.response.use(
      (res) => {
          return res.data
      },
      (error) => {
          // 存在response说明服务器有响应
          if (error.response) {
              let response = error.response
              if (response.status >= 400) {
                  // 服务器异常
                  handleError(response, 1)
              } else {
                  handleError(null, 2)
              }
          }
          return Promise.reject(new Error(error))
      }
  )
  
  // 错误处理程序
  function handleError(error, type) {
      if (type == 1) {
          // 处理接口异常，从config字段中获取请求信息
          let { url, method, params, data } = error.config
          let err_data = {
              url,
              method,
              params: { query: params, body: data },
              error: error.data.message || JSON.stringify(error.data),
          }
      } else {
          // ...
      }
  }
  
  // 处理代码逻辑异常
  // Vue全局捕获错误信息
  app.config.errorHandler = (err, instance, info) => {
      let errData
      if (err instanceof Error) {
          let { name, message } = err
          errData = {
              type: name,
              error: message,
          }
      } else {
          errData = {
              type: "other",
              error: JSON.stringify(err),
          }
      }
      console.log("errData===", errData)
  }
  ```

### 37.如何从0实现一个Vuex库？

- 思路分析
  - 这个题目很有难度，首先思考vuex解决的问题：存储用户全局状态并提供管理状态的API；
  - vuex需求分析；
  - 如何实现这些需求；

- 回答范例
  - 1.官方说vuex是一个状态管理模式和库，并确保这些状态以可预期的方式变更。可见要实现一个vuex：
    - 要实现一个`store`存储全局状态
    - 要提供修改状态所需APl:`commt(type，payload)`，`dispatch(type，payload)`
  - 2.实现store时，可以定义`Store`类，构造函数接收选项`options`，设置属性`state`对外暴露状态，提供`commit`和`dispatch`修改属性state；这里需要设置state为响应式对象，同时将Store定义为一个Vue插件；
  - 3.`commit(type，payload)`方法中可以获取用户传入mutations并执行它，这样可以按用户提供的方法修改状态；`dispatch(type，payload)`类似，但需要注意它可能是异步的，需要返回一个Promise给用户以处理异步结果；

- 实现

- ```js
  class Store {
  	constructor(options){
  		this.state=reactive(options.state)
  		this.options=options
  	}
  	commit(type,payload){
  		this.options.mutations[type].call(this,this.state,payload)
  	}
  }
  ```

### 38.vuex中mutations和actions有何区别？

- 体验：
- 看下面的的例子："action"类似于"mutation"，不同在于：
  - `action`提交的是`mutation`，而不具备直接修改状态的能力；
  - `action`可以包含任意异步操作；

- ```js
  import { createStore } from 'vuex'
  
  export default createStore({
    state: {
      count: 0
    },
    mutations: {
      INCREMENT (state) {
        state.count++
      }
    },
    actions: {
      increment ({ commit }) {
        commit('INCREMENT')
      }
    }
  })
  ```

- 答题思路
  - 1.给出两者概念说明区别
  - 2.举例说明应用场景
  - 3.使用细节不同
  - 4.简单阐述实现上差异

- 回答范例
  - 1.官方文档说：更改Vuex的store中的状态的唯一方法是提交`mutation`，`mutation`非常类似于事件：每个`mutation`都有一个字符串的类型（type）和一个回调函数（handler）。`action`类似于mutation，不同在于：`action`可以包含任意异步操作，但它不能直接修改状态，也需要提交`mutation`才行；
  - 2.因此，开发时，包含异步操作或者复杂业务组合时应使用`action`；需要直接修改状态则提交`mutation`；但由于`dispatch`和`commit`是两个API，容易引起混淆，实践中也会采用统一使用`dispatch action`的方式；
  - 3.调用`dispatch`和`commit`两个API时几乎完全一样，但是定义两者时却不甚相同，`mutation`的回调函数接收的参数是state对象；action则是与Store实例具有相同方法和属性的上下文context对象，因此一般会解构它为`{commit，dispatch，state}`，从而方便编码。另外dispatch会返回Promise实例便于处理内部异步结果；
  - 4.实现上`commit(type)`方法相当于调用`options.mutations[type](state)`；`dispatch(type)`方法相当于调用`options.actions[type](store)`，这样就很容易理解两者使用上的不同了；

- 简单的源码实现

- ```js
  class Store {
    constructor(options) {
      this.state = options.state
      this.options = options
    }
    commit(type, payload) {
      // commit传入的上下文和参数1都是state对象
      this.options.mutations[type].call(this.state, this.state, payload)
    }
    dispatch(type, payload) {
      this.options.actions[type].call(this, this, payload)
    }
  }
  ```

### 39.使用Vue渲染大量数据时应该如何优化，请说说思路

- 分析
  - 企业级项目中渲染大量数据的情况比较常见，因此这是一道非常好的综合实践题目；既然说思路，就可以分不同情况说说解决方法；
- 思路
  - 1.描述大数据量带来的问题
  - 2.分不同情况做不同处理
  - 3.总结一下

- 回答
  - 1.在大型企业级项目中经常需要渲染大量数据，此时很容易出现卡顿的情况。比如大数据的表格、树等；
  - 2.处理时要根据情况做不同的处理：
    - 避免大数据量：可以采取分页的方式获取；
    - 避免渲染大量数据：可以使用`vue-virtual-scroller`等虚拟滚动方案，只渲染视口范围内的数据；
    - 避免更新：如果数据不需要更新，可以使用`v-once`方式只渲染一次；
    - 优化更新：如果避免不了更新，可以通过`v-memo`缓存子树，有条件更新，提高复用，避免不必要更新；
    - 按需加载数据：可以采用`懒加载`方式，在用户需要的时候再加载数据，比如tree组件子树的懒加载；
  - 总之，还是要看具体需求，首先从设计上避免大数据获取和渲染；实在需要这样做可以采用虚表的方式优化渲染数量；最后优化更新，如果不需要更新可以使用v-once避免更新，需要更新可以使用v-memo进一步优化大数据更新性能；除此之外可以采用的是交互方式优化，无线滚动、懒加载等方案；

### 40.如何监听vuex状态变化？

- vuex数据状态是响应式的，所以状态变视图跟着变，但是有时还是需要知道数据状态变了从而做一些事情，既然状态都是响应式的，那自然可以使用`watch`，另外vuex也提供了订阅的API:`store.subscribe()`
- 思路
  - 总述知道的方法；
  - 分别阐述用法；
  - 选择和场景；

- 回答范例
  - 我知道几种方法：
    - 可以通过`watch`选项或者`watch`方法监听状态；
    - 可以使用vuex提供的API：`store.subscribe()`；
  - watch选项方式，可以以字符串形式监听`$store.state.xx`；subscribe方式，可以调用`store.subscribe(cb)`，回调函数接收mutation对象和state对象，这样可以进一步判断`mutation.type`是否是期待的那个，从而进一步做后续处理；
  - 总的来说，watch方式简单好用，且能获取变化前后值，首选；subscribe方法会被所有commit行为触发，因此还需要判断mutation.type，用起来略繁琐，一般用于vuex插件中；

- 具体使用

- ```js
  //Vue2
  watch: {
    "$store.state.test.count": {
      immediate: true,
      handler(val) {
        console.log(val)
      }
    }
  }
  //Vue3
  const store = useStore()
  
  watch(
    store.state,
    (val) => {
      console.log(val.count)
    },
    { immediate: true }
  )
  //store.subscribe
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type == "test/INCREMENT") {
        console.log(state.test.count)
      }
    })
  }
  ```

### 41.router-link和router-view的工作原理

- 分析
  - vue-router中两个重要组件`router-link`和`router-view`，是实现SPA的关键；
- 思路
  - 1.总述两者作用；
  - 2.阐述整体流程；
  - 3.分析两个组件实现方式；
- 回答范例
  - vue-router中有两个重要组件`router-link`和`router-view`，分别起到路由导航和组件内容渲染的作用；
  - 整体流程：vue-router会监听`popstate`事件，点击`router-link`之后页面不会刷新，而是拿出当前path去和routes中path匹配，获得匹配组件之后，由于`router-view`会对其产生依赖，最终会得到匹配的组件并将其渲染出来；
  - 具体的：`router-link`实现时默认会生成a标签，点击后会取消默认跳转行为；转而执行一个`navigate`方法，在方法内部修改一下正在访问的地址，进而重新匹配出一个路由即`injectedRoute`，与此同时会`pushstate`以激活事件处理程序，在处理程序内部重新赋值`injectedRoute`；又因为`router-view`的渲染函数依赖这个路由，它会根据该路由获取要渲染的组件并最终重新渲染它；

### 42.Vue3性能提升体现在哪些方面？

- 分析
  - vue3在设计时有几个目标：更小、更快、更友好，这些改进多数和性能相关，因此可以围绕介绍；
- 思路
  - 总述和性能相关的新特性；
  - 逐个说细节；
  - 能说点原理更佳；
- 回答范例
  - 我会分别从代码、编译和打包三个方面介绍vue3性能方面的提升
  - 代码层面性能优化主要体现在全新的响应式API，基于Proxy的实现，使得初始化时间和内存占用均大幅改进；
  - 编译层面做了更多编译优化处理，比如静态提升、动态内容标记（patch flag）、事件缓存，区块等，可以在patch过程中有效跳过大量的diff过程；
  - 打包时更好的支持tree-shaking，因此整体体积更小，加载更快；

- 补充
- 为什么基于Proxy的响应式会更快
  - Proxy是ES6标准原生支持，在初始化时会进行懒处理，不会做对象的深层次嵌套，只有用户访问时才进行拦截，因此初始化时间和内存占用都会更小；
  - 另外Vue3中依赖收集过程中会使用WeakMap、Map和Set保存响应式数据和副作用之间的依赖关系，更加轻量；

### 43.Vue3为什么要用Proxy代替defineProperty？

- 分析
  - Vue3中最重大的更新之一就是响应式模块reactivity的重写。主要就是用`Proxy`替换`defineProperty 实现响应式；此变化主要是从性能方面考量；
- 思路
  - 属性拦截的几种方式；
  - defineProperty的问题；
  - Proxy的优点；
  - 其他考量
- 回答范例
  - js中做属性拦截常见的方式有三个：`defineProperty`，`getter/setter`和`Proxy`；
  - Vue2中使用defineProperty的原因是，当时还没有Proxy，只能用这种方式。由于该APl存在一些局限性，比如对于数组的拦截有问题，为此vue需要专门为数组响应式做一套实现。另外不能拦截那些新增、删除属性，所以就得额外实现$set、$delete；最后defineProperty方案在初始化时就需要深度递归遍历待处理的对象才能对它进行完全拦截，明显增加了初始化的时间；
  - 以上两点在Proxy出现之后就可以迎刃而解，不仅可以对数组实现拦截，还能对Map、Set实现拦截；另外Proxy的拦截也是懒处理行为，如果用户没有访问嵌套对象，那么也不会实施拦截，这就让初始化的速度和内存占用都改善了；
  - 当然Proxy是有兼容性问题的，IE完全不支持，所以如果需要兼容IE就不能使用vue3；

- 原理

- ```js
  //Proxy属性拦截的原理：利用get、set、deleteProperty实现
  function reactive(obj){
  	return new Proxy(obj,{
  		get(target,key){},
  		set(target,key,val){}
  		deleteProperty(target,key){}
  	})
  }
  
  //Object.defineProperty属性拦截原理：利用get、set实现
  function defineReactive(obj,key,val){
  	Object,defineProperty(obj,key){
  		get(key){},
  		set(key,val){}
  	}
  }
  ```

### 44.history模式和hash模式有何区别？

- 分析
  - vue-router有3个模式，其中两个更为常用，那便是history和hash；两者差别主要在显示形式和部署上；
- 体验
  - vue-router4.x中设置模式的 方式已经改变

- ```vue
  const router=createRouter({
  	history: createWebHashHistory()  //hash模式
  	history: createWebHistory()  //history模式
  	history: createMemoryHistory()  //memory模式
  })
  //三者使用起来是一样的
  <router-link to="/about"></router-link>
  ```

- 思路

  - 总述两者区别;
  - 详细阐述使用细节;
  - 实现方式;

- 回答范例

  - vue-router有3个模式，其中history和hash更为常用。两者差别主要在显示形式和部署上；

  - hash模式在地址栏显示的时候是以哈希的形式显示：#/xxx，这种方式使用和部署都比较简单；history模式url看起来更优雅美观，但是应用在部署时需要做特殊配置，web服务器需要做回退处理，否则会出现刷新页面404的问题；

  - 在实现上不管哪种模式，最终都是通过监听popstate事件触发路由跳转处理，url显示不同只是显示效果上的差异；

- history模式nginx配置

- ```js
  server{
  	listen 80;
  	server_name xxx.com;
  	
  	location/admin{
  		root/Users/abc/www/admin;
  		index index.html;
  		try_files $uri $uri/ /admin/index.html;
  	}
  }
  ```

### 45.在什么场景下要使用嵌套路由？

- 分析

  - 应用的有些界面是由多层级组件组合而来的，这种情况下，url各部分通常对应某个嵌套的组件，这时就可以通过vue-router的嵌套路由配置来表达这种关系

- 思路

  - 概念和使用场景；
  - 使用方式；
  - 实现原理；

- 回答范例

  - 平时开发中，应用的有些界面是由多层级组件组合而来的，这种情况下，url各部分通常对应某个嵌套的组件，vue-router中可以使用嵌套路由配置来表达这种关系；
  - 表现形式是在两个路由间切换时，它们有公用的视图内容。此时通常提取一个父组件，内部需要变更的位置放上`<router-view>`，从而形成物理上的嵌套，和逻辑上的嵌套对应起来，即定义嵌套路由时使用`children`属性组织嵌套关系；
  - 原理上是在router-view组件内部判断其所处嵌套层级的深度，将这个深度作为匹配组件数组matched的索引，进而获取对应渲染组件并将其渲染；

- 原理

  - router-view获取自己所在的深度：默认0，加1之后传给后代，同时根据深度获取匹配路由：

- ```js
      //源码
      const injectedDepth = inject(viewDepthKey, 0)
      // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
      // that are used to reuse the `path` property
      const depth = computed<number>(() => {
        let initialDepth = unref(injectedDepth)
        const { matched } = routeToDisplay.value
        let matchedRoute: RouteLocationMatched | undefined
        while (
          (matchedRoute = matched[initialDepth]) &&
          !matchedRoute.components
        ) {
          initialDepth++
        }
        return initialDepth
      })
      const matchedRouteRef = computed<RouteLocationMatched | undefined>(
        () => routeToDisplay.value.matched[depth.value]
      )
  
      provide(
        viewDepthKey,
        computed(() => depth.value + 1)
      )
  ```

### 46.页面刷新后vuex的state数据丢失怎么解决？

- 分析

  - 这是一道应用题目，很容易想到使用1ocalStorage或数据库存储还原状态；但是如何优雅编写代码还是能体现认知水平；

- 体验

- ```js
  // 可以从`localStorage`中获取作为状态初始值：
  state() {
    return {
      count: localStorage.getItem("count") || 0,
    }
  }
  
  // 业务代码中，提交修改状态同时保存最新值：虽说实现了，但是每次还要手动刷新localStorage不太优雅：
  store.commit("increment")
  localStorage.setItem("count", store.state.count)
  
  // 通常进行一步封装，将操作内聚在store中
  // utils/useCount.js
  export function getCount() {
    return localStorage.getItem("count")
  }
  
  export function setCount(val) {
    localStorage.setItem("count", val)
  }
  
  //store/index.js
  state() {
    return {
      count: getCount() || 0,
    }
  },
  mutations: {
    increment(state) {
      state.count++
      setCount(state.count)
    },
  },
  ```

- 思路

  - 问颗描述；
  - 解决方法；
  - 谈个人理解；
  - 三方库原理探讨；

- 回答范例

  - vuex只是在内存保存状态，刷新页面后状态必然会丢失，如果想要持久化就要把状态保存起来；
  - localStorage就很合适，提交mutation的时候同时存入localStorage，store中把值取出作为state的初始值即可；
  - 但这里有两个问题，首先不是所有状态都需要持久化，如果需要保存的状态很多，编写的代码就不够优雅；此外每个提交的地方都要单独做保存处理；这里就可以利用vuex提供的`subscribe`方法做提交时的统一的处理；甚至可以封装一个vuex插件以便复用；
  - 类似的插件有vuex-persist、vuex-persistedstate，内部的实现就是通过订阅mutation变化做统一处理，通过插件的选项控制哪些状态需要持久化；

- 扩展：subscribe使用

- ```js
  store.subscribe(({ type, payload }, state) => {
    if (type === "increment") {
      localStorage.setItem("count", state.count)
    }
  })
  ```

### 47.你觉得Vuex有什么缺点？

- 体验

  - 使用模块：用起来比较繁琐，使用模式也不统一，基本上得不到类型系统的任何支持：

- ```js
  const store=createStore({
  	modules:{
          a:moduleA
      }
  })
  store.state.a  //-→要带上moduleA的key，内嵌模块的话会很长，不得不配合mapState使用
  store.getters.c  //-→moduleA里的getters，没有namespaced时又变成了全局的
  store.getters['a/c']  //-→有namespaced时要加path，使用模式又和state不一样
  store.commit('d')  //-→没有namespaced时变成了全局的，能同时触发多个子模块中同名mutation
  store.commit('a/d')  //-→有namespaced时要加path，配合mapMutations使用感觉也没简化
  ```

- 思路

  - 先夸再贬；
  - 使用感受；
  - 解决方案；

- 回答范例

  - vuex利用响应式，使用起来已经相当方便快捷了；但是在使用过程中感觉模块化的使用过于复杂，容易出错，还要经常查看文档
  - 比如：访问state时要带上模块key，内嵌模块的话会很长，不得不配合mapState使用，模块加不加namespaced区别也很大：如果不加，getters，mutations，actions这些默认是全局，加上之后则必须用字符串类型的path来匹配，使用模式不统一，容易出错；另外Vuex对ts的支持也不友好，在使用模块时没有代码提示；
  - 之前Vue2项目中用过vuex-module-decorators的解决方案，虽然类型支持上有所改善，但又要学一套新东西，增加了学习成本；pinia出现之后使用体验好了很多，Vue3+pinia会是更好的组合；

- 模块化原理

  - 下面我们来看看vuex中store.state.x.y这种嵌套的路径是怎么搞出来的：
  - 首先是子模块安装过程：父模块状态`parentState`上面设置了子模块名称moduleName，值为当前模块state对象。放在上面的例子中相当于：`store.state[ 'x' ]=modulex.state`；此过程是递归的，那么store.state.x.y安装时就是：`store.state[ 'x' ][ 'y' ]=moduleY.state`；

  - ![](C:\Users\Mocheng\Desktop\Study\02面试总结\03每天一道面试题\img\vuex模块化原理.png)

### 48.Composition APl 与 Options API 有什么不同

- 分析

  - ﻿﻿composition API是vue3最重要更新之一；

  - ﻿它具有一系列优点，针对Options APl暴露的一些问题量身打造；

  - ﻿是vue3推荐的写法，掌握它对掌握好Vue3至关重要；

  - ﻿灵感源于react hooks， 又青出于蓝；

- 体验

  - options api：

- ```vue
  <template>
    <h1>{{ count }}</h1>
    <button @click="increment">click</button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      increment() {
        this.count++
      }
    },
    mounted() {
      console.log(`The initial count is ${this.count}`)
    }
  }
  </script>
  ```

  - composition api：更好的逻辑复用和更灵活的代码组织

- ```vue
  <template>
    <h1>{{ count }}</h1>
    <button @click="increment">click</button>
  </template>
  
  <script setup>
  import { useCount } from "../hooks/useCount"
  const { count, increment } = useCount()
  </script>
  
  // useCount.js
  import { ref } from "vue"
  export function useCount() {
    const count = ref(0)
    const increment = () => {
      count.value++
    }
    return {
      count,
      increment,
    }
  }
  ```

- 思路

  - ﻿总述不同点；

  - ﻿开发动机；

  - ﻿如何选择；

- 回答范例

  - `Composition API`是一组API，包括：`Reactivity APl`、生命周期钩子、依赖注入，使用户可以通过导入函数方式编写vue组件，使得组件的可复用性、可维护性和可读性更强；而`Options API`则通过声明组件选项的对象形式编写组件；

  - `Composition API`最主要作用是能够简洁、高效的复用逻辑；解决了过去`options API`中mixins的各种缺点（命名冲突、来源不明）；另外`Composition API`具有更加敏捷的代码组织能力，很多用户喜欢`options API`，认为所有东西都有固定位置的选项放置代码，但是单个组件增长过大之后这反而成为限制，一个逻辑关注点分散在组件各处，形成代码碎片，维护时需要反复横跳，而`Composition API`则可以将它们有效组织在一起；最后`composition API`拥有更好的类型推断，对ts支持更友好， `options API`在设计之初并未考虑类型推断因素，虽然官方为此做了很多复杂的类型体操，确保用户可以在使用`options API`时获得类型推断，然而还是没办法用在mixins和provide/inject上；

  - vue3首推`Composition API`，但是这会让我们在代码组织上多花点心思，因此在选择上，如果我们项目中只有一些低复杂度的场景， `options API`仍是一个好选择；而对于那些大型，高扩展，强维护的项目上，`composstion API` 会获得更大收益；

- 追问：

  -  Composition API能否和Options API一起使用？

    - 可以，你可以在一个选项式 API 的组件中通过`setup()`选项来使用组合式 API；

  - [和React Hooks的对比]: https://cn.vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks

