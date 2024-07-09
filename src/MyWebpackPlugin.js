 const { execSync } = require('child_process')

class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('GitRevisionWebpackPlugin', compilation => {
      // 提交记录
      const hash = execSync("git rev-parse HEAD")
      console.log(hash, 'hash')
    })
    
  }
}

module.exports = MyWebpackPlugin