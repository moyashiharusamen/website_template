/** ============================================================
 *  @fileoverview モーダルを制御するJS
 *  ============================================================ */

import { isBoolean, isString } from 'lodash';

/**
 * @class Modal
 */
export default class Modal {
  base: HTMLElement;
  body: HTMLBodyElement;
  modalBody: HTMLDialogElement;
  button: HTMLElement;
  buttonClose: HTMLElement;
  modalOverlay: HTMLDivElement;
  activeButtonClass: string;
  openClass: string;
  windowYPosition: number;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'modal';

  /**
   * 現在の HTML ページ内にあるすべての Modal ブロックをインスタンス化する
   */
  static createAll(name: string = Modal.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      new Modal(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string) {
    const baseName = name;

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLBodyElement} HTML の body 要素
     */
    this.body = <HTMLBodyElement>document.querySelector('body');

    /**
     * @type {HTMLDialogElement} モーダルの開閉される本体要素
     */
      this.modalBody = <HTMLDialogElement>base.querySelector(`.${baseName}__body`);

    /**
     * @type {HTMLElement} モーダルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {HTMLElement} モーダルを閉じるボタン要素
     */
    this.buttonClose = <HTMLElement>base.querySelector(`.${baseName}__button__close`);

    /**
     * @type {HTMLElement} モーダル内の透過背景要素
     */
    this.modalOverlay = <HTMLDivElement>document.createElement('div');
    this.modalOverlay.classList.add(`${baseName}__overlay`);
    this.modalBody.appendChild(this.modalOverlay);

    /**
     * @type {string} 押下されたボタンを示す class 属性名
     */
    this.activeButtonClass = '-is-active-button';

    /**
     * @type {string} モーダルが開いたときに付与される class 属性名
     */
    this.openClass = 'is-modal-open';

    /**
     * @type {number} window の縦軸位置が入る
     */
    this.windowYPosition = 0;

    /**
     * @type {string} ユニークな ID
     */
    this.uuid = `${baseName}__${crypto.randomUUID()}`;

    this.setAttr();
    this.bindEvents();
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
    this.button.addEventListener('click', (e: any) => {
      e.target.classList.add('-is-active');
      this.toggle();
    });
    this.buttonClose.addEventListener('click', () => this.toggle(false));
    this.modalOverlay.addEventListener('click', () => this.toggle(false));
    window.addEventListener('keydown', e => {
      if (
        (e.key === 'Escape' || e.key === 'Esc') &&
        this.modalBody.getAttribute('data-active') === 'true'
      ) {
        e.preventDefault();
        this.toggle(false);
      }
    });
  }

  /**
   * モーダルの開閉
   * @param {boolean} shouldOpen  開閉状態を明示する場合は真偽値を与える。引数なしのときは開閉状態のモーダルになる。
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
    return this.modalBody.open;
  }

  set isOpened(isOpened: boolean) {
    if (isBoolean(isOpened)) {
      this.button.setAttribute('aria-expanded', `${isOpened}`);

      isOpened ? this.modalOpen() : this.modalClose();
    }
  }

  /**
     * モーダルを開く
     * @return {Void}
     */
  modalOpen() {
    this.modalBody.showModal();
    requestAnimationFrame(() => {
      this.modalBody.setAttribute('data-active', 'true');
    });

    // Y 軸位置固定
    this.windowYPosition = window.scrollY;
    this.body.classList.add(this.openClass);
    this.body.style.top = `${-this.windowYPosition}px`;
  }

  /**
     * モーダルを閉じる
     * @return {Void}
     */
  modalClose() {
    this.modalBody.setAttribute('data-active', 'false');
    if (getComputedStyle(this.modalBody).getPropertyValue('transition') === 'none') {
      this.modalBody.close();
    } else {
      this.modalBody.addEventListener('transitionend', () => {
        this.modalBody.close();
      }, { once: true });
    }

    // Y 軸位置固定解除
    this.body.classList.remove(this.openClass);
    this.body.style.top = '';
    window.scrollTo({top: this.windowYPosition, left :0, behavior: 'instant'});
  }

  /**
   * @type {string} インスタンスの固有 ID
   */
  get uuid() {
    return this.modalBody.getAttribute('id') || '';
  }

  set uuid(uuid: string) {
    if (isString(uuid)) {
      this.button.setAttribute('aria-controls', uuid);
      this.modalBody.setAttribute('id', uuid);
    }
  }
}
