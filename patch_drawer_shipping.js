const fs = require('fs');
let content = fs.readFileSync('snippets/cart-drawer.liquid', 'utf-8');

const regex = /freeShippingEl\.innerHTML = `[\s\S]*?`;/g;
let matches = [...content.matchAll(regex)];

if (matches.length >= 2) {
  // First match is the missing amount
  content = content.replace(matches[0][0], `freeShippingEl.innerHTML = \`
          <p style="margin-top: 0; margin-bottom: 0.5rem; font-size: 0.85rem; color: #1e293b; text-align: center; line-height: 1.2;">
            Faltan <strong>\${formatMoney(missing)}</strong> para <strong>ENVÍO GRATIS</strong> ⚡
          </p>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
            <div style="width: \${pct}%; height: 100%; background: #06b6d4; border-radius: 99px; transition: width 0.3s ease;"></div>
          </div>
        \`;`);
        
  // Second match is the success message
  content = content.replace(matches[1][0], `freeShippingEl.innerHTML = \`
          <p style="margin: 0; font-size: 0.85rem; color: #059669; text-align: center; font-weight: 700;">
            ¡🎉 Tienes ENVÍO GRATIS!
          </p>
          <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-top: 0.5rem;">
            <div style="width: 100%; height: 100%; background: #10b981; border-radius: 99px;"></div>
          </div>
        \`;`);
}
fs.writeFileSync('snippets/cart-drawer.liquid', content);
