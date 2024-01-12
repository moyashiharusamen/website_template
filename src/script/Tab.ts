/** ============================================================
 *  @fileoverview タブパネルを制御するJS
 *  ============================================================ */

/**
 * @class Tab
 */

export default class Tab {
  baseName: string;
  base: HTMLElement;
  buttonWrap: HTMLElement;
  buttons: HTMLCollection;
  bodies: HTMLCollection;

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'tab';

  /**
   * 現在の HTML ページ内にあるすべての Tab ブロックをインスタンス化する
   */
  static createAll(name: string = Tab.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      new Tab(element, name);
    });
  }

  /**
   * インスタンスを生成
   * @param {Object} element 基底要素ノード、またはそれを探すための文字列
   * @param {string} name 設定したいブロック名
   */
  constructor(element: Object, name: string) {
    const baseName = (this.baseName = name);

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLElement} タブを制御するボタンを内包するラッパー要素
     */
    this.buttonWrap = <HTMLElement>base.querySelector(`.${baseName}__button__wrap`);

    /**
     * @type {HTMLCollection} タブを制御するボタン要素
     */
    this.buttons = <HTMLCollection>base.getElementsByClassName(`${baseName}__button`);

    /**
     * @type {HTMLCollection} タブボタンで表示非表示される要素
     */
    this.bodies = <HTMLCollection>base.getElementsByClassName(`${baseName}__body`);

    this.bindEvents();
    this.setAttr();
  }

  /**
   * 属性の初期設定
   * @return {Void}
   */
  setAttr() {
    let defaultDisplayNumber: number;
    this.buttonWrap.setAttribute('role', 'tablist');
    [...this.bodies].forEach((body: Element, i) => {
      body.setAttribute('role', 'tabpanel');
      body.setAttribute('id', `${this.baseName}_${i + 1}`);

      if (body.getAttribute('aria-hidden') === 'false') defaultDisplayNumber = i;
    });
    [...this.buttons].forEach((button: Element, i) => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', `${this.baseName}_${i + 1}`);

      if (defaultDisplayNumber === i) {
        button.setAttribute('aria-selected', 'true');
        button.setAttribute('tabindex', '0');
      } else {
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    [...this.buttons].forEach((button) => {
      button.addEventListener('click', e => {
        if (!(e.target instanceof HTMLElement)) return;
        const target= e.target;
        if (target.getAttribute('aria-selected') === 'true') return;

        this.toggle(target, false);
      });

      button.addEventListener('keydown', e => this.keyCtrl(e));
    });
  }

  /**
   * タブの開閉
   * @return {Void}
   */
  toggle(target: HTMLElement, inputKeyboard: boolean) {
    const currentTargetID = target.getAttribute('aria-controls');
    const targetElement = <HTMLElement>(
      this.base.querySelector(`.${this.baseName}__body[id='${currentTargetID}'`)
    );

    if (targetElement.getAttribute('aria-hidden') === 'false') return;

    [...this.buttons].forEach((button: Element) => {
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('tabindex', '-1');
    });
    target.setAttribute('aria-selected', 'true');
    target.setAttribute('tabindex', '0');
    [...this.bodies].forEach((body: Element) => {
      body.setAttribute('aria-hidden', 'true');
    });
    targetElement.setAttribute('aria-hidden', 'false');

    if (inputKeyboard) target.focus();
  }

  /**
   * タブボタンをキーボードで操作したときの挙動の制御
   * @return {Void}
   */
  keyCtrl(e: any) {
    let target;
    const currentTarget = e.target;

    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowDown' || e.key === 'Down') {
      target = currentTarget.nextElementSibling;

      // 次のタブがなければ最初のタブへ
      if (!target) target = this.buttons[0];
    } else if (e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'ArrowUp' || e.key === 'Up') {
      // 'left arrow key & up arrow key'
      target = currentTarget.previousElementSibling;

      // 前のタブがなければ最後のタブへ
      if (!target) target = this.buttons[this.buttons.length - 1];
    }

    if (
      e.key === 'ArrowLeft' ||
      e.key === 'Left' ||
      e.key === 'ArrowUp' ||
      e.key === 'Up' ||
      e.key === 'ArrowRight' ||
      e.key === 'Right' ||
      e.key === 'ArrowDown' ||
      e.key === 'Down'
    ) {
      e.preventDefault();
      this.toggle(target, true);
    }
  }
}
