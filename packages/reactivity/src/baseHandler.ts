// proxy需要搭配Reflect使用
export const mutableHandlers:ProxyHandler<any> = {
  // receiver 代理对象
  get (target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 当取值的时候，应该让响应式属性 和effect映射起来
    // return target[key]
    // 依赖收集
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    // 找到属性 让对应的effect重新执行
    // 触发更新
    return Reflect.set(target, key, value, receiver)
  }
}
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive" // 基本上唯一
}