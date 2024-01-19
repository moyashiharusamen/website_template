module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order",
  ],
  ignoreFiles: ["src/style/global/mixin/*.scss"],
  rules: {
    "selector-class-pattern": null, // BEM 用にケバブケース以外も許容したいため
    "order/properties-order": null,
    "alpha-value-notation": "number",
    "function-name-case": null,
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "each", "for"]
      }
    ]
  },
  customSyntax: 'postcss-html',
};
