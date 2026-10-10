const fs = require('fs');
let content = fs.readFileSync('sections/cart.liquid', 'utf-8');

// 1. CSS changes
content = content.replace(/padding: 1\.75rem;/g, 'padding: 1.25rem;');
content = content.replace(/margin-bottom: 1\.5rem;/g, 'margin-bottom: 0.85rem;');
content = content.replace(/padding-bottom: 1rem;/g, 'padding-bottom: 0.75rem;');
content = content.replace(/min-height: 80px;/g, 'min-height: 44px;');
content = content.replace(/padding: 1rem;/g, 'padding: 0.85rem;'); // for checkout btn

// 2. HTML changes (Free shipping bar)
// Replace the whole free-shipping-progress div content
const oldShippingRegex = /<div class="free-shipping-progress"[\s\S]*?<\/div>\s*<div class="cart-subtotal-row">/;
const newShipping = `<div class="free-shipping-progress" style="margin-bottom: 0.85rem; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                {% if cart.total_price < free_shipping_threshold %}
                  {% assign amount_missing = free_shipping_threshold | minus: cart.total_price %}
                  {% assign progress_percentage = cart.total_price | times: 100.0 | divided_by: free_shipping_threshold %}
                  {% if progress_percentage > 100 %}{% assign progress_percentage = 100 %}{% endif %}
                  
                  <p style="margin-top: 0; margin-bottom: 0.5rem; font-size: 0.85rem; color: #1e293b; text-align: center; line-height: 1.2;">
                    Faltan <strong>{{ amount_missing | money }}</strong> para <strong>ENVÍO GRATIS</strong> ⚡
                  </p>
                  <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                    <div style="width: {{ progress_percentage }}%; height: 100%; background: #06b6d4; border-radius: 99px; transition: width 0.3s ease;"></div>
                  </div>
                {% else %}
                  <p style="margin: 0; font-size: 0.85rem; color: #059669; text-align: center; font-weight: 700;">
                    ¡🎉 Tienes ENVÍO GRATIS!
                  </p>
                  <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-top: 0.5rem;">
                    <div style="width: 100%; height: 100%; background: #10b981; border-radius: 99px;"></div>
                  </div>
                {% endif %}
              </div>
            {% endif %}

            <div class="cart-subtotal-row">`;

content = content.replace(oldShippingRegex, newShipping);

fs.writeFileSync('sections/cart.liquid', content);
