import { isObject } from "@vue/shared"
import { track, trigger } from "./reactiveEffect"
import { reactive } from "./reactive"

// proxy需要搭配Reflect使用
export const mutableHandlers:ProxyHandler<any> = {
  // receiver 代理对象
  get (target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 当取值的时候，应该让响应式属性 和effect映射起来
    // return target[key]
    // 依赖收集 activeEffect 与key 建立关系
    track(target, key) // 收集这个对象上的这个属性，和effect关联在一起
    let res = Reflect.get(target, key, receiver)
    if (isObject(res)) {
      return reactive(res)
    }
    return res
  },
  set (target, key, value, receiver) {
    // 找到属性 让对应的effect重新执行
    let oldValue = target[key]
    let result = Reflect.set(target, key, value, receiver)
    // 触发更新
    trigger(target, key, value, oldValue)
    return Reflect.set(target, key, value, receiver)
  }
}
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive" // 基本上唯一
}

