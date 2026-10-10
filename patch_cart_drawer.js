    function updateHeaderCartCount(count) {
      let cartLink = document.querySelector('.header__icon-link.cart-link');
      if (cartLink) {
        let countEl = cartLink.querySelector('.cart-count');
        if (count > 0) {
          if (!countEl) {
            countEl = document.createElement('span');
            countEl.className = 'cart-count';
            cartLink.insertBefore(countEl, cartLink.firstChild);
          }
          countEl.innerText = count;
        } else {
          if (countEl) {
            countEl.remove();
          }
        }
      }
    }
