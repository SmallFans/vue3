# 一、设计思想
### 1. 命令式和生命式的区别
声明式框架关注结果，命令式代码封装到vuejs中，过程靠vuejs实现

### 2. 虚拟DOM 可跨平台

### 3. 区分编译时和运行时
专门写个编译时可以将模版编译成虚拟DOM（在构建时进行编译性能更高）

> 1.vue3.0注重模块拆分，模块之间耦合度低通过<br/> 2.通过构建工具Tree-shaking机制实现按需引入，组合式API<br/>3.允许自定义渲染器，扩展更方便<br/>4.采用RFC

# 二、vue3架构
* compiler-dom 【1.针对浏览器的编译模块】
* compiler-core 【2.与平台无关的编译器核心】
* compiler - sfc 【针对单文件解析】
* compiler-ssr【针对服务器渲染的编译模块】
* reactivity【3.响应式系统】
* template-explorer【用于调试编译器输出的开发工具】
* vue-compat【迁移构建、用于兼容vue2】
* runtime-core【与平台无关的运行时核心】
* runtime-dom【针对浏览器的运行时，报错DOM API、属性、事件处理】
* runtime-test【用于测试的运行时】
* server-renderer【用于服务器渲染】
* shared【多个包之间共享的内容】
* vue【完整版本，包括运行时和编译器】
* ref-transform【试验性语法，ref转换器】
* size-check【用来测试代码体积】