(function () {
  'use strict';

  if (!window.TWCart) return;

  document.querySelectorAll('.merch-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.TWCart.addMerchItem({
        id: btn.getAttribute('data-merch-id'),
        name: btn.getAttribute('data-merch-name'),
        price: parseInt(btn.getAttribute('data-merch-price'), 10)
      });

      var original = btn.textContent;
      btn.textContent = 'Přidáno ✓';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 1000);
    });
  });
})();
