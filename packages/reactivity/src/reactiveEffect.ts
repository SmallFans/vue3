import { activeEffect } from "./effect";

export function track (target, key) {
 // activeEffect有这个属性，说明这个key是effect访问的，没有说明在外部访问

 if (activeEffect) {
  console.log(key, activeEffect)
 }
}
/**
 * { name: '1', age: 10}
 * age: {
 * effect
 * }
 * name: {
 * effect, effect
 * }
 */