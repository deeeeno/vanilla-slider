export default class ImageSlider {
  #currentPosition = 0; // 현재 몇 번쨰 슬라이드인지

  #slideNumber = 0; // 슬라이더 개수

  #slideWidth = 0; // 슬라이더 너비

  #autoPlayIntervalId;

  #isAutoPlay = false;

  sliderWrapEl;

  sliderListEl;

  nextBtnEl;

  prevBtnEl;

  indicatorWrapEl;

  controlWrapEl;

  constructor() {
    this.assignElement();
    this.initSlideNumber();
    this.initSlideWidth();
    this.initSliderListWidth();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
    this.initAutoPlay();
  }

  assignElement() {
    this.sliderWrapEl = document.getElementById('slider-wrap');
    this.sliderListEl = this.sliderWrapEl.querySelector('#slider');
    this.nextBtnEl = this.sliderWrapEl.querySelector('#next');
    this.prevBtnEl = this.sliderWrapEl.querySelector('#previous');
    this.indicatorWrapEl = this.sliderWrapEl.querySelector('#indicator-wrap');
    this.controlWrapEl = this.sliderWrapEl.querySelector('#control-wrap');
  }

  initSlideNumber() {
    this.#slideNumber = this.sliderListEl.querySelectorAll('li').length;
  }

  initSlideWidth() {
    this.#slideWidth = this.sliderListEl.clientWidth;
  }

  initSliderListWidth() {
    this.sliderListEl.style.width = `${this.#slideWidth * this.#slideNumber}px`;
  }

  initAutoPlay() {
    this.#autoPlayIntervalId = setInterval(this.moveToRight.bind(this), 3000);
    this.#isAutoPlay = true;
  }

  addEvent() {
    this.nextBtnEl.addEventListener('click', this.moveToRight.bind(this));
    this.prevBtnEl.addEventListener('click', this.moveToLeft.bind(this));
    this.indicatorWrapEl.addEventListener(
      'click',
      this.onClickIndicator.bind(this),
    );
    this.controlWrapEl.addEventListener(
      'click',
      this.onClickAutoPlay.bind(this),
    );
  }

  moveToRight() {
    this.#currentPosition += 1;
    if (this.#currentPosition === this.#slideNumber) this.#currentPosition = 0;

    this.setSliderLeft();
    this.setIndicator();

    if (this.#isAutoPlay) {
      clearInterval(this.#autoPlayIntervalId);
      this.initAutoPlay();
    }
  }

  moveToLeft() {
    this.#currentPosition -= 1;
    if (this.#currentPosition === -1)
      this.#currentPosition = this.#slideNumber - 1;

    this.setSliderLeft();
    this.setIndicator();
  }

  createIndicator() {
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#slideNumber; i += 1) {
      const li = document.createElement('li');
      li.dataset.index = i;
      docFragment.appendChild(li);
    }
    this.indicatorWrapEl.querySelector('ul').appendChild(docFragment);
  }

  setIndicator() {
    this.indicatorWrapEl.querySelector('li.active')?.classList.remove('active');
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add('active');
  }

  setSliderLeft() {
    this.sliderListEl.style.left = `-${
      this.#currentPosition * this.#slideWidth
    }px`;
  }

  onClickIndicator(e) {
    const idx = e.target.dataset?.index;
    if (idx === undefined) return;
    this.#currentPosition = parseInt(idx);
    this.setIndicator();
    this.setSliderLeft();
  }

  onClickAutoPlay() {
    this.#isAutoPlay = !this.#isAutoPlay;
    this.controlWrapEl.classList.toggle(
      'play',
      !this.controlWrapEl.classList.contains('play'),
    );
    this.controlWrapEl.classList.toggle(
      'pause',
      !this.controlWrapEl.classList.contains('pause'),
    );

    this.#isAutoPlay === true
      ? this.initAutoPlay()
      : clearInterval(this.#autoPlayIntervalId);
  }
}
