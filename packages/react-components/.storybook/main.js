module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.cjs'];
    return config;
  },
};
