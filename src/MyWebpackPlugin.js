 const { execSync } = require('child_process')

class MyWebpackPlugin {
  apply(compiler) {
    this.buildFile({
      compiler: compiler,
      command: 'git rev-parse HEAD',
      replacePattern: /\[git-revision-hash\]/gi,
      asset: 'COMMITHASH',
    })
    this.buildFile({
      compiler: compiler,
      command: 'git rev-parse --abbrev-ref HEAD',
      replacePattern: /\[git-revision-branch\]/gi,
      asset: 'BRANCH',
    })
    this.buildFile({
      compiler: compiler,
      command: 'git log -1 --format=%cI',
      replacePattern: /\[git-revision-last-commit-datetime\]/gi,
      asset: 'LASTCOMMITDATETIME',
    })
  }
  buildFile({ compiler, command, replacePattern, asset }) {
    let data = ''
    // webpack编译阶段
    compiler.hooks.compilation.tap('GitRevisionWebpackPlugin', compilation => {
      /**
       * 在所有模块和块（chunks）被确定后，但在生成最终输出之前
       * 对模块和块进行优化，如代码分割、内联、模块合并等
       * 你可以使用 optimizeTree 钩子来修改模块树，例如改变模块的加载顺序，或者添加、删除或替换模块。这通常涉及到对编译后的模块结构进行更深层次的调整，以实现特定的优化目标
       * */ 
      compilation.hooks.optimizeTree.tapAsync('optimize-tree', (_, __, callback) => {
        const res = execSync(command).toString()
        data = res
        callback()
      })
      /**
       * 生成的资源路径时触发
       * 当你你在模块中导入静态资源（如图片、字体文件等），Webpack 会通过这个钩子来决定如何处理这些资源的路径
       * 利用 assetPath 钩子来修改资源的输出路径，例如，如果你想更改图片的输出目录或文件名，你可以在插件中使用这个钩子。
      */
      compilation.hooks.assetPath.tap('GitRevisionWebpackPlugin', (assetPath, chunkData) => {
        const path = typeof assetPath === 'function' ? assetPath(chunkData) : assetPath

        if (!data) return path
        const p = path.replace(replacePattern, data)
        console.log(p, replacePattern, data, 'p')
        return p
      })
      /**
       * 生成的资产（assets）已经写入磁盘或准备写入时触发的
       * 此阶段主要处理对生成的资产进行后处理，如压缩、签名、修改文件名等
       *  */  
      compilation.hooks.processAssets.tap('GitRevisionWebpackPlugin', assets => {
        assets[asset] = {
          source: function() {
            return data
          },
          size: function() {
            return data ? data.length : 0
          },
          buffer: function() {
            return Buffer.from(data)
          },
          map: function() {
            return {}
          },
          sourceAndMap: function() {
            return { source: data, map: {} }
          },
          updateHash: function() {},
        }
      })
    })
  }
  commitHash() {
    const hash = execSync("git rev-parse HEAD").toString()
    return hash
  }

  branch() {
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString()
    return branch
  }

  version() {
    const version = execSync("git describe --always").toString()
    return version
  }
  lastcommitdatetime() {
    const lastCommitTime = execSync("git log -1 --format=%cI").toString()
    return lastCommitTime
  }
}

module.exports = MyWebpackPlugin