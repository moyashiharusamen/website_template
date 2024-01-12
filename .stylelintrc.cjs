module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order",
    "stylelint-config-prettier-scss"
  ],
  ignoreFiles: ["src/style/global/mixin/*.scss"],
  rules: {
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["include", "mixin", "each", "for"]
      }
    ]
  }
};
