/** ============================================================
 *  @fileoverview スクロースして画面内に入ったら表示用のクラスを付与するJS
 *  ============================================================ */

/**
 * @class TextTransition
 */
export default class TextTransition {
  /**
   * @property {string} ブロック名
   */
  static baseName = 'textTransition';

  /**
   * 現在の HTML ページ内にあるすべての TextTransition ブロックをインスタンス化する
   */
  static createAll(name: string = TextTransition.baseName) {
    [...document.getElementsByClassName(`${name}`)].forEach((element: Object) => {
      new TextTransition(element);
    });
  }

  baseName: string;
  base: HTMLElement;
  items: HTMLCollection;
  windowScrollPosition: number;
  passedClass: string;
  observer: Object;

  /**
   * インスタンスを生成
   * @param {HTMLElement} element 基底要素ノード
   */
  constructor(element: Object) {
    const baseName = (this.baseName = TextTransition.baseName);

    /**
     * @type {HTMLElement} 基底要素ノード
     */
    const base = (this.base = <HTMLElement>element);

    /**
     * @type {HTMLCollection} フェードインさせる要素群
     */
    const items = (this.items = <HTMLCollection>base.getElementsByClassName(`${baseName}__item`));

    /**
     * @type {number} window のスクロール位置
     */
    this.windowScrollPosition = window.scrollY;

    /**
     * @type {string} 通過した要素に設定したいブロック名の文字列
     */
    const passedClass = (this.passedClass = 'passedTextTransition');

    /**
     * @type {number} アニメーションの時間
     */
    const transitionDuration = Number(this.base.dataset.duration) || 400;

    // IntersectionObserver のオプション
    const options = {
      root: null,
      rootMargin: '-10% 0px',
      threshold: 0,
    };

    /**
     * @type {Function} 交差したときに呼び出す関数
     * @return {Void}
     * @param {IntersectionObserverEntry[]} entries
     */
    const doWhenIntersect = function (entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          let i = 0;

          base.classList.add(passedClass);
          const timer = setInterval(() => {
            items[i].classList.add(passedClass);
            if (i === items.length - 1) {
              clearInterval(timer);
              return;
            }
            i++;
          }, transitionDuration);
        }
      });
    };

    const observer = (this.observer = new IntersectionObserver(doWhenIntersect, options));
    observer.observe(base);
    this.addClassIfBelowTarget();
  }

  /**
   * ターゲットより下の位置にあるならクラスを加える
   * @return {Void}
   */
  addClassIfBelowTarget() {
    const elementPositionBottom = this.base.getBoundingClientRect().top + this.base.offsetHeight;

    // 要素の下が window の上よりも下にあるならクラスを付与
    if (elementPositionBottom < this.windowScrollPosition) {
      [...this.items].forEach((element: Element) => element.classList.add(this.passedClass));
    }
  }
}
