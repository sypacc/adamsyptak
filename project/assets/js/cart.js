(function () {
  'use strict';

  var CART_KEY = 'tw-cart';

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY));
      if (raw && typeof raw === 'object') {
        return { items: raw.items || [], reservation: raw.reservation || null };
      }
    } catch (e) { /* ignore */ }
    return { items: [], reservation: null };
  }

  function save(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  var cart = load();

  function notify() {
    save(cart);
    render();
    window.dispatchEvent(new CustomEvent('tw-cart-changed', { detail: cart }));
  }

  function addMerchItem(item) {
    var existing = cart.items.filter(function (i) { return i.id === item.id; })[0];
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    notify();
  }

  function removeMerchItem(id) {
    cart.items = cart.items.filter(function (i) { return i.id !== id; });
    notify();
  }

  function setReservation(res) {
    cart.reservation = res;
    notify();
  }

  function clearReservation() {
    if (!cart.reservation) return;
    cart.reservation = null;
    notify();
  }

  function clearAll() {
    cart.items = [];
    cart.reservation = null;
    notify();
  }

  function count() {
    var n = cart.items.reduce(function (sum, i) { return sum + i.qty; }, 0);
    if (cart.reservation) n += 1;
    return n;
  }

  function total() {
    var t = cart.items.reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
    if (cart.reservation) t += cart.reservation.price;
    return t;
  }

  // -------------------------------------------------- //
  // UI                                                   //
  // -------------------------------------------------- //
  var badge = document.getElementById('cartBadge');
  var trigger = document.getElementById('cartTrigger');
  var backdrop = document.getElementById('cartBackdrop');
  var modal = document.getElementById('cartModal');
  var closeBtn = document.getElementById('cartClose');
  var reservationSection = document.getElementById('cartReservationSection');
  var reservationLines = document.getElementById('cartReservationLines');
  var merchSection = document.getElementById('cartMerchSection');
  var merchLines = document.getElementById('cartMerchLines');
  var emptyNote = document.getElementById('cartEmptyNote');
  var totalEl = document.getElementById('cartTotal');
  var checkoutBtn = document.getElementById('cartCheckout');

  function fmt(n) { return n.toLocaleString('cs-CZ') + ' Kč'; }

  function render() {
    if (!badge) return;

    var n = count();
    badge.textContent = String(n);
    badge.hidden = n === 0;

    reservationSection.hidden = !cart.reservation;
    reservationLines.innerHTML = '';
    if (cart.reservation) {
      var r = cart.reservation;
      var line = document.createElement('div');
      line.className = 'cart-line';
      line.innerHTML =
        '<div class="cart-line-info"><p>' + r.durationLabel + '</p>' +
        '<p class="cart-line-meta">' + r.dateLabel + (r.timeLabel ? ' · ' + r.timeLabel : '') + '</p></div>' +
        '<p class="cart-line-price">' + fmt(r.price) + '</p>';
      reservationLines.appendChild(line);
    }

    merchSection.hidden = cart.items.length === 0;
    merchLines.innerHTML = '';
    cart.items.forEach(function (item) {
      var line = document.createElement('div');
      line.className = 'cart-line';
      line.innerHTML =
        '<div class="cart-line-info"><p>' + item.name + '</p>' +
        '<p class="cart-line-meta">' + item.qty + '× ' + fmt(item.price) + '</p></div>' +
        '<p class="cart-line-price">' + fmt(item.qty * item.price) + '</p>' +
        '<button type="button" class="cart-line-remove" aria-label="Odebrat">×</button>';
      line.querySelector('.cart-line-remove').addEventListener('click', function () {
        removeMerchItem(item.id);
      });
      merchLines.appendChild(line);
    });

    var isEmpty = cart.items.length === 0 && !cart.reservation;
    emptyNote.hidden = !isEmpty;
    totalEl.hidden = isEmpty;
    checkoutBtn.hidden = isEmpty;
    if (!isEmpty) totalEl.innerHTML = '<span>Celkem</span><strong>' + fmt(total()) + '</strong>';
  }

  function open() {
    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  if (trigger) {
    trigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
    checkoutBtn.addEventListener('click', function () {
      // TODO: napojit skutečnou platební bránu / e-shop checkout.
      checkoutBtn.textContent = 'Odesíláno…';
      checkoutBtn.disabled = true;
      setTimeout(function () {
        clearAll();
        checkoutBtn.textContent = 'Přejít k platbě →';
        checkoutBtn.disabled = false;
        close();
      }, 700);
    });
  }

  render();

  window.TWCart = {
    addMerchItem: addMerchItem,
    removeMerchItem: removeMerchItem,
    setReservation: setReservation,
    clearReservation: clearReservation,
    getCart: function () { return cart; }
  };
})();
