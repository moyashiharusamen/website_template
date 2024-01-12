module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro, *.scss, *.js, *.ts, *.vue',
      options: {
        parser: 'astro',
      },
    },
  ],
  // 行末にセミコロン
  semi: true,
  // アロー関数の引数のカッコを可能な限り省略する
  arrowParens: "avoid",
  // 長い行の折り返し位置
  printWidth: 100,
  // インデントのサイズ
  tabWidth: 2,
  // 改行コードの指定
  endOfLine: "lf",
  // 属性の改行
  singleAttributePerLine: true,
  // シングルクォーテーションで囲む
  singleQuote: true,
};
