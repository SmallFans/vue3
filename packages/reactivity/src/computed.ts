import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";
/**
 * 描述实现原理
 * 1. 计算属性维护了一个dirty属性，默认是true
 * 2. 计算属性也是一个effect，依赖的属性会收集这个计算属性，
 *    当前值变化后，会让computedEffect里面dirty变为true
 * 3. 计算属性具备收集能力，可以收集对应的effect，依赖的值变化后会触发effect重新执行
 */
/**
 * 
 */
class ConputedRefImpl {
  public _value;
  public effect;
  constructor(getter, public setter) {
    // 我们需要创建一个effect来关联当前计算属性的dirty属性
    this.effect = new ReactiveEffect(
      () => getter(this._value), 
      () => {
        // 计算属性依赖的值变化，我们应该触发渲染
        triggerRefValue(this)
      })
  }
  get value () { // 让计算属性收集对应的effect
    if (this.effect.dirty) {
      // 默认取值一定是脏的，但是执行一次run后就不脏了
      this._value = this.effect.run()
      trackRefValue(this)
      // 如果当前在effect中访问了计算属性，计算属性可以收集这个effect
    }
    return this._value
  }
  set value (v) {
    this.setter(v)
  }
}
export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions)
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => {}
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set
  }
  return new ConputedRefImpl(getter, setter)
}