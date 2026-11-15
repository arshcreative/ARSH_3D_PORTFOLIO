import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    envDir: '../',  // Directory where the env file is located
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Public path (what's after the domain)
    server:
    {
        // https: true,
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
        open: true // Open in browser
    },
    build:
    {
        rolldownOptions: {
            input: {
                island: fileURLToPath(new URL('./sources/index.html', import.meta.url)),
                portfolio: fileURLToPath(new URL('./sources/portfolio.html', import.meta.url))
            }
        },
        outDir: '../dist' , // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false // Add sourcemap
    },
    plugins:
    [
        wasm(),
        restart({ restart: [ '../static/**', ] }), // Restart server on static file change
        nodePolyfills(),
        // basicSsl()
    ]
}