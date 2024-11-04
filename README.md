# 在外层安装依赖需要添加W
yarn add typescript -D -W

# 生成tsconfig.json
npx tsc --init

# 安装rollup打包的相关依赖
yarn add rollup rollup-plugin-typeacript2
@rollup/plugin-node-resolve @rollup/plugin-json execa -D -W

### 打包
格式自定义： buildOptions


pnpm install @vue/shared --workspace --filter @vue/reactivity