/** ============================================================
 *  @fileoverview 慣性スクロールを制御するJS
 *  ============================================================ */

import Lenis from '@studio-freight/lenis';

/**
 * @class MomentumScrolling
 */
export default class MomentumScrolling {
  base: HTMLElement;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'momentumScrolling';

  /**
   * 現在の HTML ページ内にあるすべての MomentumScrolling ブロックをインスタンス化する
   */
  static createAll(name: string = MomentumScrolling.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      new MomentumScrolling(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string) {
    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * イージング関数
     * @see https://easings.net/ja
     * @param {number} x アニメーションの進行度（正規化された0から1までの値）
     * @return {number} イージングを適用した後の進行度（正規化された0から1までの値）
     */
    const easeOutQuart = (x: number) => {
      return 1 - Math.pow(1 - x, 4);
    };
    const options = {
      lerp: 0.1, // 慣性の強さ
      duration: 1, // スクロールアニメーションの時間
      easing: easeOutQuart, // イージング関数
    }
    const lenis = new Lenis(options);

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    this.setAttr();
    this.bindEvents();
  }

  /**
   * 属性の初期設定
   * @return {Void}
   */
  setAttr() {}

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
  }
}
