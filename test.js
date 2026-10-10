  document.addEventListener('DOMContentLoaded', function() {
    const drawer = document.getElementById('CartDrawer');
    const overlay = document.getElementById('CartDrawerOverlay');
    const closeBtn = document.getElementById('CartDrawerClose');
    const itemsContainer = document.getElementById('CartDrawerItems');
    const subtotalEl = document.getElementById('CartDrawerSubtotal');
    const freeShippingEl = document.getElementById('CartDrawerFreeShipping');
    
    // Config
    const freeShippingThreshold = 9990000; // in cents ($99,900)

    function formatMoney(cents) {
      // Simple COP formatter (no decimals)
      return '$' + (cents / 100).toLocaleString('es-CO');
    }

    function openDrawer() {
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Update Drawer UI
    function renderDrawer(cart) {
      updateHeaderCartCount(cart.item_count);
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
      if (cart.item_count === 0) {
        itemsContainer.innerHTML = '<p class="cart-drawer__empty">Tu carrito está vacío.</p>';
        subtotalEl.innerText = formatMoney(0);
        freeShippingEl.style.display = 'none';
        return;
      }

      // Render items
      let html = '';
      cart.items.forEach((item, index) => {
        let imageHtml = item.image ? `<img src="${item.image}" alt="${item.product_title}" class="cart-drawer__item-img">` : '';
        let variantHtml = (item.variant_title && item.variant_title !== 'Default Title') ? `<div class="cart-drawer__item-variant">${item.variant_title}</div>` : '';
        
        html += `
          <div class="cart-drawer__item">
            ${imageHtml}
            <div class="cart-drawer__item-details">
              <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
              ${variantHtml}
              <div class="cart-drawer__item-price">${formatMoney(item.final_price)}</div>
              <div class="cart-drawer__qty">
                <button type="button" class="drawer-qty-minus" data-line="${index + 1}">-</button>
                <input type="number" value="${item.quantity}" readonly>
                <button type="button" class="drawer-qty-plus" data-line="${index + 1}">+</button>
              </div>
            </div>
            <button type="button" class="cart-drawer__item-remove" data-line="${index + 1}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `;
      });
      itemsContainer.innerHTML = html;
      subtotalEl.innerText = formatMoney(cart.total_price);

      // Render Free Shipping Bar
      freeShippingEl.style.display = 'block';
      if (cart.total_price < freeShippingThreshold) {
        let missing = freeShippingThreshold - cart.total_price;
        let pct = (cart.total_price * 100.0) / freeShippingThreshold;
        if (pct > 100) pct = 100;
        freeShippingEl.innerHTML = `
          <p style="margin-top: 0; margin-bottom: 0.75rem; font-size: 0.9rem; color: #1e293b; text-align: center; line-height: 1.3;">
            ¡Casi lo logras! Te faltan solo <strong>${formatMoney(missing)}</strong> para <strong>ENVÍO GRATIS</strong>. ⚡
          </p>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: #06b6d4; border-radius: 99px; transition: width 0.3s ease;"></div>
          </div>
        `;
      } else {
        freeShippingEl.innerHTML = `
          <p style="margin: 0; font-size: 0.9rem; color: #059669; text-align: center; font-weight: 600;">
            ¡Misión cumplida! 🎉 Has desbloqueado el <strong>ENVÍO GRATIS</strong>.
          </p>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-top: 0.5rem;">
            <div style="width: 100%; height: 100%; background: #10b981; border-radius: 99px;"></div>
          </div>
        `;
      }

      bindDrawerEvents();
    }

    function fetchCartAndRender() {
      fetch(window.Shopify.routes.root + 'cart.js')
        .then(res => res.json())
        .then(cart => {
          renderDrawer(cart);
        });
    }

    function updateCartLine(line, quantity) {
      fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity })
      })
      .then(res => res.json())
      .then(cart => {
        renderDrawer(cart);
      });
    }

    function bindDrawerEvents() {
      document.querySelectorAll('.drawer-qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
          let line = this.getAttribute('data-line');
          let currentQty = parseInt(this.nextElementSibling.value);
          updateCartLine(line, currentQty - 1);
        });
      });
      document.querySelectorAll('.drawer-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
          let line = this.getAttribute('data-line');
          let currentQty = parseInt(this.previousElementSibling.value);
          updateCartLine(line, currentQty + 1);
        });
      });
      document.querySelectorAll('.cart-drawer__item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
          let line = this.getAttribute('data-line');
          updateCartLine(line, 0);
        });
      });
    }

    // Intercept all "Add to cart" forms globally
    document.addEventListener('submit', function(e) {
      if (e.target && e.target.getAttribute('action') && e.target.getAttribute('action').includes('/cart/add')) {
        e.preventDefault();
        
        // Find submit button and add loading state
        let submitBtn = e.target.querySelector('[type="submit"]');
        let originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.innerHTML = 'Agregando...';
          submitBtn.disabled = true;
        }

        let formData = new FormData(e.target);

        fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          // Reset button
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
          // Fetch updated cart and open drawer
          fetchCartAndRender();
          openDrawer();
        })
        .catch(error => {
          console.error('Error:', error);
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        });
      }
    });

  });
