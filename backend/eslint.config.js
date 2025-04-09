import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";


export default defineConfig([
	{ files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"],
		rules: {
			'indent': ['error', 'tab'],
			'semi': ['error', 'always'],
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
		}, },
	{ files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
]);