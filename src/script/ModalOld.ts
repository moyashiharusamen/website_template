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
  modalBody: HTMLElement;
  button: HTMLElement;
  buttonClose: HTMLElement;
  focusableElement: Array<HTMLElement>;
  firstFocusableElement: HTMLElement;
  lastFocusableElement: HTMLElement;
  modalOverlay: HTMLDivElement;
  openClass: string;
  windowYPosition: number;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'modalOld';

  /**
   * @type {string} フォーカス可能と判断する対象となる要素名
   */
  static focusableElementList: string =
    'a[href], area[href], input, select, textarea, button, output, video, audio, object, embed, iframe, [tabindex], [onclick]';

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
     * @type {HTMLElement} モーダルの開閉される本体要素
     */
    const modalBody = (this.modalBody = <HTMLElement>base.querySelector(`.${baseName}__body`));

    /**
     * @type {HTMLElement} モーダルの開閉を制御するボタン要素
     */
    this.button = <HTMLElement>base.querySelector(`.${baseName}__button`);

    /**
     * @type {HTMLElement} モーダルを閉じるボタン要素
     */
    this.buttonClose = <HTMLElement>base.querySelector(`.${baseName}__button__close`);

    /**
     * @type {NodeList} モーダル内のフォーカス可能な要素群
     */
    this.focusableElement = (() => {
      const elementList: Array<any> = [];
      modalBody
        .querySelectorAll(Modal.focusableElementList)
        .forEach(element => elementList.push(element));
      if (elementList.length === 0) elementList.push(this.modalBody);
      return elementList;
    })();

    /**
     * @type {HTMLElement} モーダル内のフォーカス可能な要素群の中の最初の要素
     */
    this.firstFocusableElement = <HTMLElement>this.focusableElement[0];

    /**
     * @type {HTMLElement} モーダル内のフォーカス可能な要素群の中の最後の要素
     */
    this.lastFocusableElement = <HTMLElement>(
      this.focusableElement[this.focusableElement.length - 1]
    );

    /**
     * @type {HTMLElement} モーダル内の透過背景要素
     */
    this.modalOverlay = <HTMLDivElement>document.createElement('div');
    this.modalOverlay.classList.add(`${baseName}__overlay`);
    this.modalBody.appendChild(this.modalOverlay);

    /**
     * @type {string} モーダルが開いたときに付与される class 属性名
     */
    this.openClass = '-is-modal-open';

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
    this.modalBody.setAttribute('role', 'dialog');
    this.modalBody.setAttribute('aria-modal', 'true');
    this.modalBody.setAttribute('aria-hidden', 'true');

    if (this.focusableElement.length === 0) this.modalBody.setAttribute('tabindex', '0');
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.button.addEventListener('click', () => this.toggle());
    this.buttonClose.addEventListener('click', () => this.toggle(false));
    this.modalOverlay.addEventListener('click', () => this.toggle(false));
    this.base.addEventListener('keyup', e => {
      if (
        (e.key === 'Escape' || e.key === 'Esc') &&
        this.modalBody.getAttribute('aria-hidden') === 'false'
      ) {
        this.toggle(false)
      }
    });
    this.base.addEventListener('keydown', e => {
      if (e.code === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === this.firstFocusableElement) {
            e.preventDefault();
            this.lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === this.lastFocusableElement) {
            e.preventDefault();
            this.firstFocusableElement.focus();
          }
        }
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
    return this.modalBody.getAttribute('aria-hidden') !== 'true';
  }

  set isOpened(isOpened: boolean) {
    if (isBoolean(isOpened)) {
      this.modalBody.setAttribute('aria-hidden', `${!isOpened}`);
      this.button.setAttribute('aria-expanded', `${isOpened}`);

      if (isOpened) {
        this.modalBody.classList.add('-from-show');
        this.windowYPosition = window.scrollY;
        this.body.classList.add(this.openClass);
        this.body.style.top = `${-this.windowYPosition}px`;
        this.modalBody.setAttribute('tabindex', '0');
        requestAnimationFrame(() => this.modalBody.classList.remove('-from-show'));
        this.firstFocusableElement.focus();
      } else if (!isOpened) {
        this.modalBody.classList.add('-to-hide');
        this.body.classList.remove(this.openClass);
        this.body.style.top = '';
        this.modalBody.removeAttribute('tabindex');
        window.scrollTo(0, this.windowYPosition);
        this.modalBody.addEventListener('transitionend', () => {
          this.modalBody.classList.remove('-to-hide');
        }, { once: true });
        this.button.focus();
      }
    }
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
