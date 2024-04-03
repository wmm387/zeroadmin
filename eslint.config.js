import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
  },
  {
    rules: {
      'no-console': 'warn',
      'style/brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true,
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'style/arrow-parens': 'off',
      'curly': 'off',
      'antfu/if-newline': 'off',
      'antfu/top-level-function': 'off',
      'unicorn/prefer-number-properties': 'off',
    },
  },
)
