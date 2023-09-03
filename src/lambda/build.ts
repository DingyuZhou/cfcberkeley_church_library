import { Command } from 'commander'
import { build } from 'esbuild'
import path from 'path'
import { zip } from 'zip-a-folder'

import sequelizePlugin from './sequelizePlugin'

const program = new Command('build-lambda')
  .option('--file-path <filePath>', 'The main file path is used to build the build file')
  .option('--external [name...]', 'Add external packages')
  .option('--zip-file-name <zipFileName>', 'Output ZIP file name', 'build.zip')
  .parse(process.argv)

const { filePath, external, zipFileName } = program.opts() as {
  filePath: string
  external: string[]
  zipFileName: string
}

;(async () => {
  const outdir = path.resolve(__dirname, 'build')

  const plugins = [sequelizePlugin]

  await build({
    plugins,
    entryPoints: [path.resolve(filePath)],
    external,
    platform: 'node',
    target: 'node16.20',
    bundle: true,
    write: true,
    outfile: path.resolve(outdir, './index.js'),
  })
  await zip(outdir, path.resolve(__dirname, `${zipFileName}`))
})()
