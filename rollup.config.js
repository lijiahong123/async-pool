import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from "@rollup/plugin-terser";
import { main } from './package.json'
export default {
    input: './src/index.js',
    output: {
        file: main,
        format: 'umd',
        name: 'asyncPool'
    },
    plugins: [
        nodeResolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
}