import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap() // 存放依赖收集的关系

export const createDep = (cleanup, key) => {
  const dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = key // 自定义的为了标识这个映射表是给哪个属性服务的
  return dep
}

export function track (target, key) {
 // activeEffect有这个属性，说明这个key是effect访问的，没有说明在外部访问

 if (activeEffect) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    // depsMap.set(key, new Map())
    depsMap.set(key, dep = createDep(() => depsMap.delete(key), key)) // 后面用于清理不需要的属性
  }
  // 将当前的effect放入到dep(映射表)中，后续可以根据值的变化触发此dep中存放的effect
  trackEffect(activeEffect, dep)
 }
}
export function trigger (target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  let dep = depsMap.get(key)
  if (dep) {
    triggerEffects(dep)
  }
}
 /**
 * Map: {
  * obj: {
  *   属性： Map{
  *           effect, effect
*           }
*     }
  *}
 * { name: '1', age: 10}
 * age: {
 * effect
 * }
 * name: {
 * effect, effect
 * }
 */