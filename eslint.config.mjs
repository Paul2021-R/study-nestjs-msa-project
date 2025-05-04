// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // TypeScript 엄격한 규칙 비활성화
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      
      // 'any' 타입과 관련된 안전하지 않은 작업 규칙 비활성화
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      
      // 프로미스 및 기타 비동기 관련 규칙 비활성화
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/await-thenable": "off",
      
      // 추가적인 개발 편의를 위한 규칙 비활성화
      "@typescript-eslint/restrict-template-expressions": "off", 
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/ban-types": "off",
      
      // 경고로 설정하여 눈에 띄되 빨간 줄로 표시되지 않도록
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "warn"
    },
  },
);