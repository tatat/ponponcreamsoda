import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

const eslintConfig = [
  {
    ignores: ['.next/', 'out/', 'build/', 'coverage/', 'tmp/', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      '@next/next/no-img-element': 'off',
      'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    },
  },
]

export default eslintConfig
