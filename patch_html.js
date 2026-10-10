const fs = require('fs');
let content = fs.readFileSync('sections/cart.liquid', 'utf-8');

// Replace checkout button to include lock icon
content = content.replace(
  /<button type="submit" name="checkout" class="cart-checkout-btn">\s*Proceder al Pago\s*<\/button>/,
  `<button type="submit" name="checkout" class="cart-checkout-btn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    Proceder al Pago
  </button>`
);

// Replace default payment icons with trust-payments snippet
content = content.replace(
  /{%- unless shop\.enabled_payment_types == empty -%}[\s\S]*?{%- endunless -%}/,
  "{% render 'trust-payments' %}"
);

fs.writeFileSync('sections/cart.liquid', content);
