import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // General override for TypeScript files to allow 'any'
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: [
      'app/components/CopilotActionHandler.tsx',
      'app/components/ExampleConfigs.tsx',
      'app/components/ToolCallRenderer.tsx',
    ],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];

export default eslintConfig;
