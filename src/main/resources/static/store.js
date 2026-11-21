const products = [
    { id: 'tee', name: 'Everyday Cotton Tee', category: 'Clothes', cents: 1990, sale: true,
        description: 'A soft cotton tee in forest green with a relaxed fit and a classic crew neck.' },
    { id: 'sweater', name: 'Ribbed Crew Jumper', category: 'Clothes', cents: 4590,
        description: 'A warm brick-red jumper with a ribbed neck, hem and cuffs.' },
    { id: 'shirt', name: 'Linen Blend Shirt', category: 'Clothes', cents: 3990,
        description: 'A light blue linen-blend shirt with a relaxed shape and a button front.' },
    { id: 'scarf', name: 'Soft Knit Scarf', category: 'Clothes', subcategory: 'Accessories', cents: 2200,
        description: 'A soft lilac knit scarf for cooler days.' },
    { id: 'socks', name: 'Cotton Crew Socks', category: 'Clothes', subcategory: 'Accessories', cents: 990, sale: true,
        description: 'Two pairs of comfortable cotton crew socks in warm, muted colours.' },
    { id: 'mug', name: 'Glazed Stoneware Mug', category: 'Home goods', subcategory: 'Kitchen & dining', cents: 1250,
        description: 'A blue glazed stoneware mug with a wide handle. Holds 350 ml.' },
    { id: 'throw', name: 'Woven Cotton Throw', category: 'Home goods', subcategory: 'Living', cents: 3490, sale: true,
        description: 'A checked cotton throw with a warm ochre finish and fringed edges.' },
    { id: 'bowl', name: 'Stoneware Serving Bowl', category: 'Home goods', subcategory: 'Kitchen & dining', cents: 2490,
        description: 'A glazed stoneware bowl for sharing salads, fruit or snacks.' },
    { id: 'towel', name: 'Striped Tea Towel', category: 'Home goods', subcategory: 'Kitchen & dining', cents: 890,
        description: 'A cotton tea towel with soft green stripes and a hanging loop.' },
    { id: 'cushion', name: 'Textured Cushion', category: 'Home goods', subcategory: 'Living', cents: 2990,
        description: 'A textured cushion in a warm terracotta shade for a cosy sofa.' }
];

const pages = {
    '#location': {
        title: 'Location',
        content: `
            <h2>BrightShop Example Store</h2>
            <address>12 Market Street<br>Amsterdam<br>Netherlands</address>
            <p>Visit our example store for clothes and home goods.</p>
            <p><a href="#opening-times">See opening times</a></p>`
    },
    '#history': {
        title: 'Our story',
        content: `
            <p>In this demo, BrightShop began as a small neighbourhood shop in 2014,
                offering practical clothes and thoughtful pieces for the home.</p>
            <p>Its fictional collection has since grown to bring everyday essentials
                to customers across Europe.</p>`
    },
    '#opening-times': {
        title: 'Opening times',
        content: `
            <p>Example opening hours for the BrightShop store:</p>
            <table class="hours">
                <caption class="sr-only">Example store opening times</caption>
                <tbody>
                    <tr><th scope="row">Monday - Friday</th><td>09:00 - 18:00</td></tr>
                    <tr><th scope="row">Saturday</th><td>10:00 - 17:00</td></tr>
                    <tr><th scope="row">Sunday</th><td>Closed</td></tr>
                </tbody>
            </table>
            <p><a href="#location">See our example location</a></p>`
    },
    '#contact': {
        title: 'Contact',
        content: `
            <p>These example details do not reach a real customer service team.</p>
            <p><strong>Email:</strong> hello@brightshop.example<br>
                <strong>Phone:</strong> +31 (0)20 000 0000</p>
            <p>Looking for a quick answer? Visit our <a href="#faq">FAQ</a>.</p>`
    },
    '#faq': {
        title: 'Frequently asked questions',
        content: `
            <details class="faq-item">
                <summary>Can I place an order?</summary>
                <p>No. This is a demo storefront; checkout and payments are not available.</p>
            </details>
            <details class="faq-item">
                <summary>Does my cart stay saved?</summary>
                <p>Your cart is saved in this browser on this device. It is not shared with a store.</p>
            </details>
            <details class="faq-item">
                <summary>Where can I find the returns policy?</summary>
                <p>See the example <a href="#refunds">returns and refunds</a> page.</p>
            </details>`
    },
    '#refunds': {
        title: 'Returns and refunds',
        content: `
            <p>This example policy is for the demo only. The site cannot accept returns
                or issue refunds.</p>
            <h2>Example return window</h2>
            <p>In this example, customers have 30 days after delivery to return unused items.</p>
            <h2>Example refund</h2>
            <p>A refund would be issued to the original payment method after the return is checked.</p>
            <p>Questions? See our example <a href="#contact">contact details</a>.</p>`
    }
};

const store = document.querySelector('#store');
const feedback = document.querySelector('#feedback');
const storageKey = 'brightshop-cart';
const categories = ['All', 'Clothes', 'Accessories', 'Home goods', 'Kitchen & dining', 'Living'];
const cart = readCart();
let category = 'All';

function readCart() {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return {};

    let quantities;
    try {
        quantities = JSON.parse(saved);
    } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        console.warn('BrightShop could not read the saved cart.', error);
        return {};
    }
    return Object.fromEntries(products.flatMap(({ id }) => {
        const quantity = quantities?.[id];
        return Number.isInteger(quantity) && quantity > 0 && quantity <= 99 ? [[id, quantity]] : [];
    }));
}

const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const formatPrice = cents => currency.format(cents / 100);

const productLink = product => `#product/${product.id}`;
const art = product => `<svg class="art ${product.id}" viewBox="0 0 200 150" aria-hidden="true"><use href="#${product.id}"></use></svg>`;
const sale = product => product.sale ? '<span class="sale-tag">Sale</span>' : '';

function shopView() {
    const selection = products.filter(product =>
        category === 'All' || product.category === category || product.subcategory === category);
    return `
        <section class="hero">
            <p class="eyebrow">The everyday collection</p>
            <h1>Good things for everyday life</h1>
            <p>Shop easy layers and simple comforts for your home.</p>
        </section>
        <h2>Shop the collection</h2>
        <div class="filters" role="group" aria-label="Product category">
            ${categories.map(value => `<button class="filter" type="button" data-category="${value}"
                aria-pressed="${value === category}">${value}</button>`).join('')}
        </div>
        <div class="grid">
            ${selection.map(product => `
                <article class="card">
                    ${art(product)}
                    <div class="card-body">
                        <p class="category">${product.category}</p>
                        <h2><a href="${productLink(product)}">${product.name}</a></h2>
                        <p class="price">${formatPrice(product.cents)} ${sale(product)}</p>
                    </div>
                </article>`).join('')}
        </div>`;
}

function detailView(product) {
    return `
        <a href="#shop">Back to shop</a>
        <article class="detail">
            ${art(product)}
            <div>
                <p class="category">${product.category}</p>
                <h1>${product.name}</h1>
                <p>${product.description}</p>
                <p class="price">${formatPrice(product.cents)} ${sale(product)}</p>
                <button type="button" class="action" data-add="${product.id}">Add to cart</button>
                <p id="add-result" aria-hidden="true"></p>
            </div>
        </article>`;
}

function cartView() {
    const items = products.filter(product => cart[product.id]);
    if (!items.length) {
        return '<h1>Your cart</h1><p>Your cart is empty.</p><a class="action" href="#shop">Browse products</a>';
    }
    const subtotal = items.reduce((sum, product) => sum + product.cents * cart[product.id], 0);
    return `
        <h1>Your cart</h1>
        <div class="checkout">
            <ul class="cart-items">
                ${items.map(product => `
                    <li class="cart-row">
                        ${art(product)}
                        <div>
                            <h2><a href="${productLink(product)}">${product.name}</a></h2>
                            <p>${formatPrice(product.cents)} each
                                ${product.sale ? '<span class="cart-sale">Sale</span>' : ''}</p>
                            <p class="price">Item total: ${formatPrice(product.cents * cart[product.id])}</p>
                            <div class="quantity">
                                <button type="button" data-less="${product.id}" aria-label="Decrease quantity of ${product.name}">&minus;</button>
                                <span>Quantity: ${cart[product.id]}</span>
                                <button type="button" data-add="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>
                            </div>
                        </div>
                    </li>`).join('')}
            </ul>
            <section class="summary">
                <h2>Checkout summary</h2>
                <p class="total"><strong>Subtotal</strong><strong>${formatPrice(subtotal)}</strong></p>
                <p>Demo only. No shipping or payments.</p>
                <a href="#shop">Continue shopping</a>
            </section>
        </div>`;
}

function updateCount() {
    document.querySelector('#cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function informationView(page) {
    return `
        <article class="info-page">
            <p class="eyebrow">BrightShop information</p>
            <h1>${page.title}</h1>
            <p class="demo-note">The store details on this page are fictional and for demonstration only.</p>
            ${page.content}
        </article>`;
}

function render(moveFocus = false) {
    const route = location.hash || '#shop';
    const product = products.find(item => productLink(item) === route);
    const page = pages[route];
    const isCart = route === '#cart';
    const isShop = route === '#shop';
    let title = 'Shop';
    if (isCart) {
        store.innerHTML = cartView();
        title = 'Your cart';
    } else if (product) {
        store.innerHTML = detailView(product);
        title = product.name;
    } else if (isShop) {
        store.innerHTML = shopView();
    } else if (page) {
        store.innerHTML = informationView(page);
        title = page.title;
    } else {
        store.innerHTML = '<h1>Page not found</h1><a href="#shop">Back to shop</a>';
        title = 'Page not found';
    }

    document.title = `${title} | BrightShop`;
    const activeRoute = product ? '#shop' : route;
    for (const link of document.querySelectorAll('[data-nav]')) {
        if (link.getAttribute('href') === activeRoute) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    }
    updateCount();
    if (moveFocus) {
        window.scrollTo(0, 0);
        store.focus();
    }
}

store.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.category) {
        category = button.dataset.category;
        render();
        store.querySelector(`[data-category="${category}"]`).focus();
        return;
    }

    const { add, less } = button.dataset;
    const product = products.find(item => item.id === (add || less));
    if (!product) return;
    const quantity = (cart[product.id] || 0) + (add ? 1 : -1);
    if (quantity < 0) return;
    let message;
    if (quantity > 99) {
        message = `The cart limit for ${product.name} is 99.`;
    } else {
        if (quantity === 0) delete cart[product.id];
        else cart[product.id] = quantity;
        localStorage.setItem(storageKey, JSON.stringify(cart));
        message = quantity ? `${product.name}: ${quantity} in cart.` : `${product.name} removed from cart.`;
        if (location.hash === '#cart') {
            render();
            const control = store.querySelector(`[data-${add ? 'add' : 'less'}="${product.id}"]`);
            (control || store.querySelector('button, a')).focus();
        } else {
            updateCount();
        }
    }
    feedback.textContent = message;
    const result = document.querySelector('#add-result');
    if (result) result.textContent = message;
});

window.addEventListener('hashchange', () => render(true));
render();
