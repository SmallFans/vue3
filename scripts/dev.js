// node dev.js (要打包的名字 -f 打包的格式) === argv.splice(2)
import minimist from "minimist";
import path, { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire} from 'module'
import esbuild from 'esbuild'
// node中的命令函数参数通过process来获取process.argv
const args = minimist(process.argv.splice(2))

const target = args._[0] || "reactivity" // 打包哪个文件
const format = args.f || "iife" // 打包后的模块化规范

// esm使用commonjs变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)


// node模块中esm模块没有__dirname
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(`../packages/${target}/package.json`)
// 根据需要进行打包
esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true, // reactivity -> shared 会打包到一起
  platform: "browser", // 打包后给浏览器使用
  sourcemap: true,
  format, // cjs esm iife
  globalName: pkg.buildOptions?.name // iife使用全局名字
}).then((ctx) => {
  console.log('start')
  return ctx.watch()
})