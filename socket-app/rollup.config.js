'use strict';
import run from '@rollup/plugin-run';

const dev = process.env.NODE_ENV !== 'production';
export default {
    input: 'server.js',
    output: [
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