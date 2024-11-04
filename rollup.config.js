// 1. 引入相关依赖
import ts from 'rollup-plugin-typescript2' // 解析ts
import json from '@rollup/plugin-json'
import resovlePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path'
console.log('---------')
// 2. 获取文件打包路径
let packagesDir = path.resolve(__dirname, 'packages')

// 2.1获取需要打包的包
// let packageDir = path.resolve(packagesDir, process.env.TRAGET)
console.log(666)