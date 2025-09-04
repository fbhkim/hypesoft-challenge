module.exports = {
  presets: [
    ['next/babel'],
    ['@babel/preset-typescript', { allowNamespaces: true }],
  ],
  plugins: [],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
    },
  },
};
