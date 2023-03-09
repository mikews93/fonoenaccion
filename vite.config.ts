import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import viteCompression from 'vite-plugin-compression';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		plugins: [viteCompression(), viteCommonjs(), tsconfigPaths(), react()],
		server: {
			port: 80,
		},
		preview: {
			port: 8080,
		},
		build: {
			manifest: true,
		},
		optimizeDeps: {
			esbuildOptions: {
				plugins: [
					esbuildCommonjs([
						'@uppy/core',
						'@uppy/drop-target',
						'@uppy/xhr-upload',
						'@uppy/react',
						'@uppy/file-input',
						'clipboard-copy',
						'@uppy/progress-bar',
						'mime-match',
						'Restricter',
					]),
				],
			},
		},
	});
};
