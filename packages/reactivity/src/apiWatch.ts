import { isFunction, isObject } from "@vue/shared"
import { ReactiveEffect } from "./effect"
import { isReactive } from "./reactive"
import { isRef } from "./ref"

/**
 * watch(state, // new ReactiveEffect(getter, scheduler)
 * function (oldValue, newValue) {}, 
 * {deep: false}
 * )
 */
export function watch (source, cb, options = {} as any) {
  return doWatch(source, cb, options)
}
// 没有cb就是watchEffect
export function watchEffect(source, options ={}) {
  return doWatch(source, null, options as any)
}
function traverse (source, depth, currentDepth = 0, seen = new Set()) {
  if (!isObject(source)) {
    return source
  }
  if (depth) {
    if (currentDepth >= depth) {
      return currentDepth
    }
    currentDepth++ // 根据deep属性来看是否是深度
  }
  if (seen.has(source)) {
    return source
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, seen)
  }
  return source // 遍历就会触发每个属性的get
}

function doWatch(source, cb, { deep, immediate }) {
  // source -> getter
  const reactiveGetter = (source) => traverse(source, deep === false ? 1 : undefined)
  // 产生一个可以给ReactiveEffect来使用的getter,需要对这个对象进行取值操作，会关联当前的ReactiveEffect
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isFunction(source)) {
    getter = source
  }
  
  let oldValue;
  let clean;
  const onCleanuo = (fn) => {
    clean = () => {
      fn();
      clean = undefined
    }
  }
  const job = () => {
   if (cb) {
    const newValue = effect.run()
    if (clean) {
      clean()
    }
    cb(newValue, oldValue, onCleanuo)
    oldValue = newValue
   } else {
    effect.run()
   }
  }
  const effect = new ReactiveEffect(getter, job)
  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    // watchEffect
    effect.run() // 直接执行
  }
  const unwatch = () => {
    effect.stop()
  }
  return unwatch
}
// watchEffect --- effect -> reactiveEffect(getter, scheduler)