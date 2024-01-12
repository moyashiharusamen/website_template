/** ============================================================
 *  @fileoverview アコーディオンを制御するJS
 *  ============================================================ */

import Events from 'eventemitter3';
import { without } from 'lodash';
import Toggle from './Toggle';

/**
 * @class Accordion
 */
export default class Accordion {
  events: Object;
  toggles: Toggle[];

  /**
   * @property {string} ブロック名
   */
  static baseName: string = 'accordion';

  /**
   * 現在の HTML ページ内にあるすべての Accordion ブロックをインスタンス化する
   */
  static createAll(name: string = Accordion.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      new Accordion(element, name);
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
    const base = <HTMLElement>element;

    /**
     * @type {HTMLElement} トグルさせる要素
     */
    const item = base.getElementsByClassName(`${baseName}Item`);

    this.events = new Events.EventEmitter();

    /**
     * @type {Toggle[]} Toggle のインスタンス群
     */
    this.toggles = [...item].map(element => new Toggle(element, `${baseName}Item`));

    this.bindEvents();
  }

  /**
   * イベントのバインド登録
   * @return {Void}
   */
  bindEvents() {
    this.toggles.forEach(toggle => toggle.on('toggle', () => this.onOpen(toggle)));
  }

  /**
   * Toggle のいずれかが開かれたら、それ以外の Toggle を閉じる
   * @param {Object} toggle  'open' イベントが発生した（いま開かれた） Toggle インスタンス
   * @return {Void}
   */
  onOpen(toggle: object) {
    without(this.toggles, toggle).forEach((_toggle: any) => _toggle.close());
  }
}
