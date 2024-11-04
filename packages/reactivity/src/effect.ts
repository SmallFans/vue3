export function effect (fn, option?) {
  // 创建一个响应式effect，数据变化后重新执行

  // 创建一个effect，只要依赖的属性变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()

  return _effect
}
export let activeEffect;
class ReactiveEffect {
  active = true; // 创建的effect是响应式的
  // fn用户编写的函数
  // 如果fn中依赖的数据发生变化后，需要重新调用 -> run
  constructor(public fn, public scheduler) {

  }
  run () {
    if (!this.active) {
      return this.fn()
    }
    let lastEffect = activeEffect
    try {
      // 让fn执行
      activeEffect = this
      // 依赖收集 state.name
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }
  stop () {
    this.active = false
  }
}