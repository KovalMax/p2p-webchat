'use strict';
import run from '@rollup/plugin-run';
import {terser} from 'rollup-plugin-terser';

const dev = process.env.NODE_ENV !== 'production';
export default {
    input: 'server.js',
    output: [
        // {
        //     file: 'dist/bundle.min.js',
        //     format: 'umd',
        //     name: 'version',
        //     globals: {
        //         'socket.io': 'SocketIO'
        //     },
        //     plugins: [terser()]
        // },
        {
            file: 'dist/bundle.js',
            format: 'cjs'
        },
    ],
    plugins: [
        dev && run(),
    ],
    external: ['socket.io', 'express']
};