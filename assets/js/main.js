import { basketContainer, eraseBasket, createBasket } from './basket.js';

const cartCounterLabel = document.querySelector('#cart-counter-label');
const contentContainer = document.querySelector('#content-container');
const basketCartBtn = document.querySelector('.page-header__cart-btn');

let cartCounter = 0;
let goodsInBasketArr = null;
let cartPrice = 0;
let restoreHTML = null;

const cartCounterLabelPrint = (c) =>
  c > 0
    ? (cartCounterLabel.innerHTML = `${c}`)
    : (cartCounterLabel.style.display = 'none');

const incrementCounter = () => {
  cartCounterLabelPrint(++cartCounter);
  if (cartCounter === 1) cartCounterLabel.style.display = 'block';
};

const getMockData = (t) =>
  +t.parentElement.previousElementSibling.innerHTML.replace(
    /^\$(\d+)\s\D+(\d+).*$/i,
    '$1.$2'
  );

const getPrice = (t, price) => Math.round((price + getMockData(t)) * 100) / 100;

const getGoodsName = (t) =>
  t.parentElement.parentElement.querySelector('.item-title').innerHTML;

const disableControls = (t, fn) => {
  t.disabled = true;
  contentContainer.removeEventListener('click', fn);
};

const enableControls = (t, fn) => {
  t.disabled = false;
  contentContainer.addEventListener('click', fn);
};

const writeGoodsToBasket = (t, arr) => {
  let goodsID = null;
  let goods = {
    goodsName: getGoodsName(t),
    goodsCode: getGoodsName(t),
    price: getMockData(t),
    count: 1,
    sum: getMockData(t),
  };
  if (arr !== null) {
    let i = 0;

    while (goodsID === null && i < arr.length) {
      arr[i].goodsCode === getGoodsName(t) ? (goodsID = i) : i++;
    }
    if (goodsID === null) arr.push(goods);
    else {
      arr[goodsID].count++;
      arr[goodsID].sum =
        Math.round((arr[goodsID].sum + arr[goodsID].price) * 100) / 100;
    }
  } else arr = [goods];

  return arr;
};

const createBasketWork = (c, pArr) => {
  createBasket(c, pArr);
  const basketBtn = document.querySelector('#btn-container');
  basketBtn.addEventListener('click', basketBtnHandler);
  basketContainer.addEventListener('click', delGoodsHandler);
};

const btnClickHandler = (e) => {
  const target = e.target;
  const interval = 500;

  if (target && target.matches('.item-actions__cart')) {
    if (basketContainer !== null) eraseBasket();

    incrementCounter();

    goodsInBasketArr = writeGoodsToBasket(target, goodsInBasketArr);

    cartPrice = getPrice(target, cartPrice);
    restoreHTML = target.innerHTML;
    target.innerHTML = `Added ${cartPrice.toFixed(2)} $`;
    disableControls(target, btnClickHandler);

    setTimeout(() => {
      target.innerHTML = restoreHTML;

      enableControls(target, btnClickHandler);
    }, interval);
  }
};

const basketBtnHandler = (e) => {
  const target = e.target;

  if (target) {
    eraseBasket();
    if (!target.classList.contains('basket__btn-continue')) {
      if (target.classList.contains('basket__btn-order')) {
      }
      cartPrice = 0;
      goodsInBasketArr = null;
      cartCounter = 0;
      cartCounterLabelPrint(cartCounter);
    }
  }
};

const delGoodsHandler = (e) => {
  const target = e.target;

  if (target && target.matches('.basket__item-del')) {
    let b = true;
    let i = 0;

    while (b && i < goodsInBasketArr.length) {
      if (goodsInBasketArr[i].goodsCode === target.parentElement.dataset.code) {
        cartPrice -= goodsInBasketArr[i].sum;
        cartCounter -= goodsInBasketArr[i].count;

        goodsInBasketArr.splice(i, 1);
        b = false;
      } else i++;
    }
    eraseBasket();
    createBasketWork(cartCounter, goodsInBasketArr);
    cartCounterLabelPrint(cartCounter);
  }
};

const basketClickHandler = (e) => {
  const target = e.target;
  if (target) {
    createBasketWork(cartCounter, goodsInBasketArr);
  }
};
export const InitShop = () => {
  contentContainer.addEventListener('click', btnClickHandler);
  basketCartBtn.addEventListener('click', basketClickHandler);
};
