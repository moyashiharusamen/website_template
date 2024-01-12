/** ============================================================
 *  @fileoverview トグルを制御するJS
 *  ============================================================ */

import Events from 'eventemitter3';
import { isBoolean, isString } from 'lodash';

/**
 * @class Toggle
 */
export default class Toggle extends Events {
  base: HTMLElement;
  body: HTMLElement;
  button: HTMLElement;
  buttonMark: HTMLElement;

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
     * @type {HTMLElement} トグルの開閉される本体要素
     */
    this.body = <HTMLElement>base.querySelector(`.${baseName}__body`);

    /**
     * @type {HTMLElement} トグルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {HTMLElement} ボタン内にあるマーク部分要素
     */
    this.buttonMark = <HTMLElement>base.querySelector(`.${baseName}__button__mark`);

    /**
     * @type {string} ユニークな ID
     */
    this.uuid = `${baseName}__${crypto.randomUUID()}`;

    this.bindEvents();
    this.setAttr();
  }

  /**
   * 属性の初期設定
   * @return {Void}
   */
  setAttr() {
    this.button.setAttribute('aria-expanded', 'false');
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.button.addEventListener('click', e => {
      e.preventDefault();
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
   * トグルを開く
   * @return {Void}
   */
  close() {
    this.body.setAttribute('aria-hidden', 'true');
    this.button.setAttribute('aria-expanded', 'false');
    this.buttonMark.textContent = '開く';
  }

  /**
   * @type {string} インスタンスの固有 ID
   */
  get uuid() {
    return this.body.getAttribute('id') || '';
  }

  set uuid(uuid: string) {
    if (isString(uuid)) {
      this.button.setAttribute('aria-controls', uuid);
      this.body.setAttribute('id', uuid);
    }
  }

  /**
   * 開閉状態、 true なら「開いている」
   * @returns {boolean}
   */
  get isOpened() {
    return this.body.getAttribute('aria-hidden') !== 'true';
  }

  set isOpened(isOpened: boolean) {
    if (isBoolean(isOpened)) {
      this.body.setAttribute('aria-hidden', `${!isOpened}`);
      this.button.setAttribute('aria-expanded', `${isOpened}`);
      this.buttonMark.textContent = isOpened ? '閉じる' : '開く';
    }
  }
}
