import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";
import { ReactiveFlags } from "./constans";

export function reactive (target) {
  return createActiveObject(target)
}

// 用于记录我们的代理后的结果，可以复用
const reactiveMap = new WeakMap()

function createActiveObject(target) {
  // 响应式对象必须是对象才可以
  if (!isObject(target)) {
    return target;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) { // 已经被代理过不再代理
    return target
  }
  // 取缓存
  const exitsProxy = reactiveMap.get(target)
  if (exitsProxy) { // 保证不被重复代理
    return exitsProxy
  }
  let proxy = new Proxy(target, mutableHandlers)

  // 根据对象缓存代理后的结果
  reactiveMap.set(target, proxy)
  return proxy
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}