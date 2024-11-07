import { DirtyLevels } from "./constans"

export function effect (fn, options?) {
  // 创建一个响应式effect，数据变化后重新执行

  // 创建一个effect，只要依赖的属性变化了就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()
  if (options) {
    // 用户传递的覆盖掉内置的，例如scheduler
    Object.assign(_effect, options)
  }
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect // 可以在run方法上获取到effect的引用
  return runner // 外界可以自己让其重新run
}
export let activeEffect;
function preCleanEffect (effect) {
  effect._depsLength = 0
  effect._trackId++; // 每次执行id 都是+1，如果当前同一个effect执行，id就相同
}
function postCleanEffect (effect) {
  if (effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      cleanDepEffect(effect.deps[i], effect) // 删除映射表中对应的effect
    }
    effect.deps.length = effect._depsLength // 更新依赖列表的长度
  }
}
export class ReactiveEffect {
  _trackId = 0; // 用于记录当前effect执行了几次
  active = true; // 创建的effect是响应式的
  deps = []; 
  _dirtyLevel = DirtyLevels.Dirty
  _running = 0
  _depsLength = 0
  // fn用户编写的函数
  // 如果fn中依赖的数据发生变化后，需要重新调用 -> run
  constructor(public fn, public scheduler) {

  }
  public get dirty () {
    return this._dirtyLevel === DirtyLevels.Dirty
  }
  public set dirty (v) {
    this._dirtyLevel = v ? DirtyLevels.Dirty : DirtyLevels.NoDirty
  }
  run () {
    this._dirtyLevel = DirtyLevels.NoDirty
    if (!this.active) {
      return this.fn()
    }
    let lastEffect = activeEffect
    try {
      // 让fn执行
      activeEffect = this
      // effect重新执行前，需要将上一次的依赖情况 effect.deps清除
      preCleanEffect(this)
      this._running++
      return this.fn() // 依赖收集 state.name
    } finally {
      this._running--
      postCleanEffect(this)
      activeEffect = lastEffect
    }
  }
  stop () {
    if (this.active) {
      this.active = false
      postCleanEffect(this)
      preCleanEffect(this)
    }
  }
}
function cleanDepEffect (dep, effect) {
  dep.delete(effect)
  if (dep.size == 0) {
    dep.cleanup() // 如果map为空则删除这个属性
  }

}
// 1. _trackId 用于记录执行次数（防止一个属性在当前effect中多次依赖收集）只收集一次
// 2. 拿到上一次依赖的最后一个和这次的比较
// { flag, name }
export function trackEffect(effect, dep) {
  // 需要重新的去收集依赖， 将不需要的移除掉
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId) // 更新id
    let oldDep = effect.deps[effect._depsLength]
    if (oldDep !== dep) { // 如果没有存过
      if (oldDep) {
        // 删除掉老的
        cleanDepEffect(oldDep, effect)
      }
      effect.deps[effect._depsLength++] = dep // 永远按照本次最新的来存放
    } else {
      effect._depsLength++
    }
  }
  // 还想让effect和dep关联起来
  // effect.deps[effect._depsLength++] = dep
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    // 当前这个值是不脏的，但是触发更新需要将值变为脏值
    // 属性依赖了计算属性，需要让计算属性的dirty再变为true
    if (effect._dirtyLevel < DirtyLevels.Dirty) {
      effect._dirtyLevel = DirtyLevels.Dirty
    }
    if (!effect._running) {
      if (effect.scheduler) {
        effect.scheduler()
      }
    }
  }
}