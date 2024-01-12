module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:astro/recommended"],
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"]
      }
    }
  ]
};
