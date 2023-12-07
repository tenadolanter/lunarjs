import { resolve } from 'path'
export default () =>  {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'lunarjs',
        fileName: 'lunarjs',
      },
      outDir: "lib",
    },
  }
}