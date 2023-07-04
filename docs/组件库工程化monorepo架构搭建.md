## Vue3组件库Monorepo架构搭建 

### pnpm构建monorepo

#### pnpm初始化

全局安装pnpm并初始化

~~~shell
yarn add pnpm -g
pnpm init
~~~

#### workspace协议配置工作区

在根目录下创建 `pnpm-workspace.yaml`，配置文件指定仓库中项目

~~~yaml
packages:
  - play # 存放组件测试的代码
  - docs # 存放组件文档
  - packages/* # packages 目录下都是组件包
~~~

> 为什么配置workspace？ 

配置packages告诉pnpm哪些子项目包含在pnpm工作区。配置该属性后，pnpm会在工作区的根目录下创建 `.node_modules/.pnpm` 文件夹，下面存放所有子项目的依赖，避免重复安装相同依赖。

> pnpm如何避免安装重复依赖

当多个子项目需要相同的依赖时，pnpm会在虚拟根目录中的`.pnpm`文件夹中创建一个共享的依赖关系，形成 `@包名 + 内部依赖 +  版本信息` 的扁平化目录

这个目录下的文件实际上是一个软链接（类似windows下的快捷方式），指向实际的依赖关系所在的位置，而不是在当前项目中复制该依赖项。

#### 仓库内的包互相调用

在 packages 目录中又可以放很多包的项目目录，比如，组件包目录：components、主题包目录：theme-chalk、工具包目录：utils 等。然后每一个包目录里面也需要一个 package.json 文件进行声明这是一个 NPM 包目录。所以我们需要进入每个包目录进行初始一个 package.json 文件。初步搭建的项目结构如下所示。

~~~
├── README.md
├── package.json
├── packages
│   ├── components
│   │   └── package.json
│   ├── theme-chalk
│   │   └── package.json
│   └── utils
│       └── package.json
├── play
├── docs
└── pnpm-workspace.yaml
~~~

因为`@msk/components` 、`@msk/theme-chalk` 、`@msk/utils`这几个包要互相进行调用呢，就需要把它们安装到仓库根目录下的 node_modules 目录中。

在根目录下执行下面命令，`-w` 表示安装到共公模块的 packages.json 中，也就是根目录下的 packages.json。

~~~bash
pnpm install @msk/components -w
pnpm install @msk/theme-chalk -w
pnpm install @msk/utils -w
~~~

安装后根目录下的 packages.json：

~~~json
"dependencies": {
    "@msk/components": "workspace:^1.0.0",
    "@msk/theme-chalk": "workspace:^1.0.0",
    "@msk/utils": "workspace:^1.0.0"
  }
~~~

`workspace:*` 将来发布的时候会被转换成具体的版本号。

## 利用 `pnpm create vite` 创建play的开发环境

后续我们在 packages 目录下的 components 目录编写的组件希望在 play 中直接进行运行的。那么我们就需要在 play 目录下创建一个开发环境，可以正常引用 components 目录中组件，运行并查看组件编写是否正常。那么我们就直接使用 Vite 来创建一个项目就可以了。

在根目录下，创建了一个 Vue3 + TS 的项目，通过`create vite`的命令能快速创建项目，其原理在`create-vite-analysis` 仓库中。

~~~bash
pnpm create vite play --template vue-ts
~~~

接下来进入play目录，`pnpm install`安装依赖。最后我们可以在 play 目录下运行 `npm run dev` 运行 play 项目，但这样每次运行都需要进入到 play 目录下的话，太麻烦了，我们希望在根目录下就可以运行 play 项目，我们可以在根目录的 package.json 文件的 scripts 选项进行以下配置：

~~~json
{
  "dev": "pnpm -C play dev",
}
~~~

`-C play` 命令表示在play目录下运行指令
## TS的monorepo设置

初衷：使用monorepo划分了不同模块，但最终进行生产编译打包的时候，我们是不希望对测试模块的文件进行打包的，所以我们需要在 TypeScript 编译进行划分模块，让生产的时候只进行核心模块进行编译打包。
### TS初始化配置

因为 vue 、 typescript 和 @types/node 只是开发环境需要的，所以安装的时候需要添加一个 -D 参数表示安装到开发环境

~~~bash
pnpm install vue typescript @types/node -D -w
~~~

我们想要在校验代码可以按照一些规则来解析我们的语法，给我们更友好的提示。通过`pnpm tsc --init`

安装了 typescript 后，在 node_modules 目录下 bin 目录里面就会存在一个 tsc 的命令，这个命令，就可以帮我们进行初始化，使用 `pnpm tsc --init` 那么执行这个命令，生成`tsconfig.json`。

### TS的 Project References

> 通过 tsconfig.json 的 `references` 属性，我们可以进一步划分组件库，使其更合理并提高编译性能。

tsconfig.json 文件的 `references` 属性用于将 TypeScript 程序项目分割成更小的组成部分，提高类型检查和编译速度。我们的组件库采用 monorepo 方式管理，将项目拆分成组件部分（packages）、展示部分（play）和测试部分（tests）。测试和展示部分依赖组件部分，但它们之间没有关联。因此，只有发生变化的部分需要重新编译，未发生变化的部分不需要编译。

~~~json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.web.json" }, // 组件包部分
    { "path": "./tsconfig.play.json" }, // 组件 play 部分
    { "path": "./tsconfig.vitest.json" } // 组件测试部分
  ]
}
~~~

每个引用的 path 属性可以指向包含 tsconfig.json 文件的目录，也可以指向配置文件本身。经过上面的设置，在TS层将组件库分成三个部分。通过具体配置文件进行具体每个部分的 TypeScript 编译项设置。而每个部分都有一些公共的配置项，所以我们又可以把公共的配置项进行抽离设置到一个公众配置文件中，再通过 `extends` 进行引用，这样一来就可以大大减少相同的配置代码。

**公共配置项：`tsconfig.base.json`**

~~~json
{
  "compilerOptions": {
    "outDir": "dist", // 指定输出目录
    "target": "es2018", // 目标语言的版本
    "module": "esnext", // 生成代码的模板标准
    "baseUrl": ".", // 解析非相对模块的基地址，默认是当前目录
    "sourceMap": false, // 是否生成相应的Map映射的文件，默认：false
    "moduleResolution": "node", // 指定模块解析策略，node或classic
    "allowJs": false, // 是否允许编译器编译JS，JSX文件
    "strict": true, // 是否启动所有严格检查的总开关，默认：false，启动后将开启所有的严格检查选项
    "noUnusedLocals": true, // 是否检查未使用的局部变量，默认：false
    "resolveJsonModule": true, // 是否解析 JSON 模块，默认：false
    "allowSyntheticDefaultImports": true, // 是否允许从没有默认导出的模块中默认导入，默认：false
    "esModuleInterop": true, // 是否通过为所有导入模块创建命名空间对象，允许CommonJS和ES模块之间的互操作性，开启改选项时，也自动开启allowSyntheticDefaultImports选项，默认：false
    "removeComments": false, // 删除注释
    "rootDir": ".", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "types": [],
    "paths": { // 路径映射，相对于baseUrl
      "@msk/*": ["packages/*"]
    }
  }
}
~~~

**组件包ts配置项：**

+ 通过 `include` 指定需要编译和类型检查的文件夹。
+ 通过 `exclude` 排除不需要编译和类型检查的文件。

> 如何实现ts编译优化

`"composite": true` 是一个 TypeScript 编译选项，用于实现编译优化。当设置为 true 后，TypeScript 将执行增量编译，即生成 `.d.ts` 和 `.tsbuildinfo` 文件。其中，.tsbuildinfo 文件记录了每个文件的哈希值，下次编译会比较文件的哈希值，如果没有变化，则不进行重新编译。这样就能提高编译性能。

~~~json
{
  "extends": "./tsconfig.base.json", // 引用公共配置
  "compilerOptions": {
    "composite": true, // 是否开启项目编译，开启该功能，将会生成被编译文件所在的目录，同时开启declaration、declarationMap和incremental，默认：false
    "jsx": "preserve", // 指定JSX代码生成用于的开发环境
    "lib": ["ES2018", "DOM", "DOM.Iterable"], // 指定项目运行时使用的库
    "types": ["unplugin-vue-define-options"], // 用来指定需要包含的模块，并将其包含在全局范围内
    "skipLibCheck": true // 是否跳过声明文件的类型检查，这可以在编译期间以牺牲类型系统准确性为代价来节省时间，默认：false
  },
  "include": ["packages",],// 使用 include 来指定应从绝对类型中使用哪些类型
  "exclude": [ // 提供用于禁用 JavaScript 项目中某个模块的类型获取的配置
    "node_modules",
    "**/dist",
    "**/__tests__/**/*",
    "**/gulpfile.ts",
    "**/test-helper",
    "packages/test-utils",
    "**/*.md"
  ]
}
~~~

**组件展示 play 部分配置项 tsconfig.play.json 文件：**

~~~json
{
  "extends": "./tsconfig.web.json",
  "compilerOptions": {
    "allowJs": true, // 是否允许编译器编译JS，JSX文件
    "lib": ["ESNext", "DOM", "DOM.Iterable"] // 指定项目运行时使用的库
  },
  "include": [ // 使用 include 来指定应从绝对类型中使用哪些类型
    "packages",
    "typings/components.d.ts",
    "typings/env.d.ts",

    // playground
    "play/main.ts",
    "play/env.d.ts",
    "play/src/**/*"
  ]
}
~~~

### 组件库TS的类型检查

Element Plus 组件库是采用 `rollup-plugin-esbuild` 来进行打包的，此插件的基本原理就是结合使用 `ESBuild` 和 `Rollup` 来编译 `ESNext` 和 `TypeScript` 代码，而 ESbuild 在编译的时候是不会进行 TypeScript 的类型检查的，所以我们需要在编译之前就进行 TypeScript 的类型检查。

1. 纯ts文件

`tsc --noEmit` 命令来进行类型检查，`tsc --noEmit` 的意思就是只进行 TypeScript 的语法检测，而不会进行编译。

在`package.json`下配置：

tsc的 `-p` 表示指定配置文件

~~~json
{
  "scripts":{
   	"typecheck:node": "tsc -p tsconfig.node.json --noEmit",
	}
}
~~~

2. 单文件组件

使用 `vue-tsc` 工具进行类型检查。基于 `volar` 的 Vue3 命令行类型检查工具，我们也是可以在执行 `vue-tsc --noEmit` 时使用命令行参数--project（或-p）指定配置文件进行配置需要检查的内容和方式。

~~~json
{
  "scripts": {
  "typecheck:web": "vue-tsc -p tsconfig.web.json --composite false --noEmit",
  "typecheck:play": "vue-tsc -p tsconfig.play.json --composite false --noEmit",
	}
}
~~~

--composite false 不进行增量编译，增量编译指的是生成 .d.ts 和 tsconfig.tsbuildinfo 文件，使用 vue-tsc 法语检查时不能设置为 true。

--noEmit 不进行编译，只进行语法检测。

--composite false --noEmit 不进行编译，也不进行增量编译，只进行语法检测。

--composite false 只能设置为 false，不能设置为 true。

### 串行/并行执行脚本

上面进行 TypeScript 类型检查的时候在 `package.json` 的 `script` 中配置了多个模块的命令，如果需要同时全部执行所有的命令，我们需要进行以下的设置：

`"runall":"pnpm run typecheck:web && pnpm run typecheck:play && pnpm run typecheck:node && pnpm run typecheck:vitest"`，通过 && 符号来串行执行脚本。

使用`npm-run-all`工具，可以更优雅地实现并行执行脚本。

~~~bash
pnpm install npm-run-all -D -w
~~~

安装后，重新设置并行的script：`"typecheck": "run-p typecheck:web typecheck:play typecheck:node typecheck:vitest",`

---

至此一个通过 pnpm 方式配置的 monorepo 组件库基础环境就搭建好了。

工程化：以工具为实现媒介进行规范工作流程：组件库的文件组织架构规范、TS编译和类型检查流程、工具链的统一。