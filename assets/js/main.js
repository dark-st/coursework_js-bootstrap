const cartCounterLabel = document.querySelector('#cart-counter-label');
const contentContainer = document.querySelector('#content-container');
const basketCartBtn = document.querySelector('.page-header__cart-btn');
const headerNavbar = document.querySelector('.page-header__navbar');

let cartCounter = 0;
let goodsInBasketArr = null;
let cartPrice = 0;
let restoreHTML = null;
let basketContainer = null;
let basketBtnContainer;

const createElement = ({ type, attrs, container = null }) => {
  const el = document.createElement(type);

  for (let key in attrs) {
    if (key === 'innerText') el.innerHTML = attrs[key];
    else if (key.indexOf('data') === 0)
      el.setAttribute(`data-${key.slice(4)}`, attrs[key]);
    else el.setAttribute(key, attrs[key]);
  }

  if (container) container.append(el);

  return el;
};

const createBasketContainer = (c) => {
  basketContainer = createElement({
    type: 'div',
    attrs: { class: 'well basket__container' },
    container: headerNavbar,
  });
  createElement({
    type: 'p',
    attrs: { innerText: `Сейчас в корзине ${c} товаров` },
    container: basketContainer,
  });
};

const createBasketBtn = (cn, container) => {
  basketBtnContainer = createElement({
    type: 'div',
    attrs: { class: 'basket__btn-container', id: 'btn-container' },
    container,
  });
  createElement({
    type: 'button',
    attrs: {
      class: 'btn btn-primary basket__btn-continue',
      id: 'btn-next',
      type: 'button',
      innerText: 'Продолжить покупки',
    },
    container: basketBtnContainer,
  });
  if (cn > 0) {
    createElement({
      type: 'button',
      attrs: {
        class: 'btn btn-primary basket__btn-clear',
        type: 'button',
        innerText: 'Очистить корзину',
      },
      container: basketBtnContainer,
    });
    createElement({
      type: 'button',
      attrs: {
        class: 'btn btn-primary basket__btn-order',
        type: 'submit',
        innerText: 'Оформить заказ',
      },
      container: basketBtnContainer,
    });
  }
};

const createBasketList = (container, arr) => {
  let sum = 0;

  arr.forEach((el) => {
    let basketItem = createElement({
      type: 'div',
      attrs: {
        class: 'basket__item-container',
        datacode: `${el.goodsCode}`,
      },
      container,
    });

    createElement({
      type: 'span',
      attrs: { innerText: `${el.goodsName}  ` },
      container: basketItem,
    });
    createElement({
      type: 'span',
      attrs: {
        class: 'basket__item-count',
        innerText: `- ${el.count} шт  `,
      },
      container: basketItem,
    });
    createElement({
      type: 'span',
      attrs: { innerText: `цена ${el.price.toFixed(2)}$  ` },
      container: basketItem,
    });
    createElement({
      type: 'span',
      attrs: { innerText: `сумма: ${el.sum.toFixed(2)}$` },
      container: basketItem,
    });
    createElement({
      type: 'i',
      attrs: { class: 'fas fa-times basket__item-del' },
      container: basketItem,
    });

    sum += el.sum;
  });
  createElement({
    type: 'div',
    attrs: {
      class: 'basket__total',
      innerText: `Всего в корзине товаров на сумму ${sum.toFixed(2)}$`,
    },
    container,
  });
};

const createStyle = () => {
  createElement({
    type: 'style',
    attrs: {
      innerText: `
      .page-header__navbar {
        position: relative;
      }
      
      .basket__container {
        background-color: rgb(150, 200, 241);
        position: absolute;
        padding: 10px;
        bottom: 0;
        right: 0;
        transform: translateY(100%);
        z-index: 1000;
        border: 1px solid #2d8df3;
        border-radius: 4px;
      }
      .basket__container p {
        text-align: center;
        font-size: 18px;
      }
      .basket__total {
        margin: 10px auto 10px auto;
        text-align: center;
        font-size: 18px;
      }
      .basket__btn-container {
        display: flex;
        gap: 10px;
      }
      .basket__item-container {
        display: flex;
        gap: 10px;
        justify-content: space-evenly;
        border-bottom: 1px solid #007bff;
      }
      .basket__item-del {
        display: block;
        background-color: crimson;
        border: 1px solid black;
        padding: 5px 3px 0 3px;
        cursor: pointer;
        font-size: 10px;
        border-radius: 2px;
      }`,
    },
    container: document.head,
  });
};

const eraseBasket = () => {
  basketContainer.remove();
  basketContainer = null;
};

const createBasket = (cn, goodsArr) => {
  createBasketContainer(cn);
  if (cn > 0) createBasketList(basketContainer, goodsArr);
  createBasketBtn(cn, basketContainer);
  createStyle();
};

const createBasketWork = (c, pArr) => {
  createBasket(c, pArr);
  const basketBtn = document.querySelector('#btn-container');
  basketBtn.addEventListener('click', basketBtnHandler);
  basketContainer.addEventListener('click', delGoodsHandler);
};

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

contentContainer.addEventListener('click', btnClickHandler);
basketCartBtn.addEventListener('click', basketClickHandler);
