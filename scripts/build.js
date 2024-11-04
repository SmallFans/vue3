// 打包monorepro
const fs = require('fs');
const execa = require('execa')


// 1. 获取 打包目录 注意文件夹才打包
const dirs = fs.readdirSync('packages').filter(p => {
  if (!fs.statSync(`packages/${p}`).isDirectory()) {
    return false
  }
  return true
})
// 2 进行打包 并行打包
async function build (target) {
  // -c表示执行rollup配置，环境变量
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {stdio: 'inherit'}) // 子进程的输出在父进程中输出
 // 返回promise
}
async function runParaller (dirs, itemfn) {
  let result = []
  for (let item of dirs) {
    result.push(itemfn(item))
  }
  return Promise.all(result) // 存放打包的promise，等待执行完毕，调用成功
}

runParaller(dirs, build).then(() => {
  console.log('chenggong')
})
console.log(dirs)