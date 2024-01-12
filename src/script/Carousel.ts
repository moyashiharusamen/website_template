/** ============================================================
 *  @fileoverview カルーセルを制御するJS
 *  ============================================================ */

import { Splide } from '@splidejs/splide';

/**
 * @class Carousel
 */

export default class Carousel {
  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'carousel';

  /**
   * 現在の HTML ページ内にあるすべての Carousel ブロックをインスタンス化する
   */
  static createAll(name: string = Carousel.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach(() => {
      new Carousel();
    });
  }

  /**
   * インスタンスを生成
   */
  constructor() {
    const splide = new Splide('.splide', {
      padding: '20px',
      lazyLoad: 'nearby',
      type: 'loop',
    });
    splide.mount();
  }
}
