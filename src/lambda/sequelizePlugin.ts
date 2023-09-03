import { PluginBuild } from 'esbuild'
import fs from 'fs'

const sequelizePlugin = {
  name: 'sequelize',

  setup(build: PluginBuild) {
    build.onLoad(
      {
        filter:
          /sequelize(\/dist)?\/lib\/dialects\/abstract\/connection-manager\.js/,
      },
      ({ path: filePath }) => {
        const contents = fs
          .readFileSync(filePath, 'utf-8')
          .replace(
            /return require\(moduleName\);/,
            "return moduleName === 'pg' ? require('pg') : require(moduleName)",
          )

        return {
          contents,
          loader: 'js',
        }
      },
    )
  },
}

export default sequelizePlugin
