const esbuild = require('esbuild')
const packagejson = require('./package.json')
const { globPlugin } = require('esbuild-plugin-glob')

const sharedConfig = {
	loader: {
		'.tsx': 'tsx',
		'.ts': 'tsx',
	}, //文件映射对应的文件处理loader
	outbase: './', // 选项用于指定输出文件的基本目录
	bundle: true, // 输出单个文件
	minify: true, // 是否压缩
	jsxFactory: 'createElement',
	jsxFragment: 'Fragment',
	target: ['esnext'],
	logLevel: 'debug',
	external: [...Object.keys(packagejson.peerDependencies || {})],
}

esbuild
	.build({
		...sharedConfig,
		entryPoints: ['./src/index.ts'],
		outdir: 'dist/cjs',
		format: 'cjs',
		banner: {
			// js: 'const { createElement, Fragment } = require(\'react\');\n',
		},
	})
	.catch(() => process.exit(1))

esbuild
	.build({
		...sharedConfig,
		entryPoints: [
			'./src/index.ts',
			// 'src/components/**/index.tsx',
			// 'src/lib/stitches.config.ts',
			// 'src/lib/globalStyles.ts',
		],
		outdir: 'dist/esm',
		splitting: true,
		format: 'esm',
		banner: {
			// js: 'import { createElement, Fragment } from \'react\';\n',
		},
		plugins: [globPlugin()],
	})
	.catch(() => process.exit(1))
