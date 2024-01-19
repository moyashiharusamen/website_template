/** ============================================================
 *  @fileoverview トグルを制御するJS
 *  ============================================================ */

import Events from 'eventemitter3';
import { isBoolean } from 'lodash';

/**
 * @class Toggle
 */
export default class Toggle extends Events {
  base: HTMLElement;
  details: any;
  body: HTMLElement;
  button: HTMLElement;
  animationTiming: Object;
  closingAnimationKeyframes: Function;
  openingAnimationKeyframes: Function;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'toggle';

  /**
   * 現在の HTML ページ内にあるすべての Toggle ブロックをインスタンス化する
   */
  static createAll(name: string = Toggle.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      return new Toggle(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string = Toggle.baseName) {
    super();

    const baseName = name;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLElement} detail 要素
     */
    this.details = <HTMLElement>base.querySelector(`.${baseName}__details`);

    /**
     * @type {HTMLElement} トグルの開閉される本体要素
     */
    this.body = <HTMLElement>base.querySelector(`.${baseName}__body`);

    /**
     * @type {HTMLElement} トグルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {Object} トグルの開閉をアニメーションさせるタイミングの設定
     */
    this.animationTiming = {
      duration: 400,
      easing: 'ease-in-out',
    };

    /**
     * @type {Function} トグルを閉じるアニメーションのキーフレーム
     */
    this.closingAnimationKeyframes = (content: HTMLElement) => [
      {
        height: content.offsetHeight + 'px',
        opacity: 1,
      },
      {
        height: 0,
        opacity: 0,
      },
    ];

    /**
     * @type {Function} トグルを開くアニメーションのキーフレーム
     */
    this.openingAnimationKeyframes = (content: HTMLElement) => [
      {
        height: 0,
        opacity: 0,
      },
      {
        height: content.offsetHeight + 'px',
        opacity: 1,
      },
    ];

    this.bindEvents();
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.button.addEventListener('click', e => {
      e.preventDefault();

      // 連打対策
      if (this.details.dataset.animationStatus === 'running') return;

      this.emit('toggle', this);
      this.toggle();
    });
  }

  /**
   * トグルの開閉
   * @param {boolean} shouldOpen  開閉状態を明示する場合は真偽値を与える。引数なしのときは開閉状態のトグルになる。
   * @return {Accordion}
   */
  toggle(shouldOpen: boolean = false) {
    this.isOpened = Boolean(shouldOpen) ? shouldOpen : !this.isOpened;

    return this;
  }

  /**
   * 開閉状態、 true なら「開いている」
   * @returns {boolean}
   */
  get isOpened() {
    return this.details.open;
  }

  set isOpened(isOpened: boolean) {
    if (!isBoolean(isOpened)) return;
    this.isOpened ? this.close() : this.open();
  }

  /**
   * トグルを開く
   * @return {Void}
   */
  open() {
    const openingAnimation = this.body.animate(
      this.openingAnimationKeyframes(this.body),
      this.animationTiming
    );

    this.details.setAttribute('open', 'true');
    this.details.dataset.animationStatus = 'running';
    openingAnimation.onfinish = () => {
      this.details.dataset.animationStatus = '';
    };
  }

  /**
   * トグルを閉じる
   * @return {Void}
   */
  close() {
    const closingAnimation = this.body.animate(
      this.closingAnimationKeyframes(this.body),
      this.animationTiming
    );

    this.details.dataset.animationStatus = 'running';
    closingAnimation.onfinish = () => {
      this.details.removeAttribute('open');
      this.details.dataset.animationStatus = '';
    };
  }
}
