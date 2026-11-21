const products = [
    { id: 'tee', name: 'Everyday Cotton Tee', category: 'Clothes', cents: 1990, sale: true,
        description: 'A soft cotton tee in forest green with a relaxed fit and a classic crew neck.' },
    { id: 'sweater', name: 'Ribbed Crew Jumper', category: 'Clothes', cents: 4590,
        description: 'A warm brick-red jumper with a ribbed neck, hem and cuffs.' },
    { id: 'mug', name: 'Glazed Stoneware Mug', category: 'Home goods', cents: 1250,
        description: 'A blue glazed stoneware mug with a wide handle. Holds 350 ml.' },
    { id: 'throw', name: 'Woven Cotton Throw', category: 'Home goods', cents: 3490, sale: true,
        description: 'A checked cotton throw with a warm ochre finish and fringed edges.' }
];

const store = document.querySelector('#store');
const feedback = document.querySelector('#feedback');
const storageKey = 'brightshop-cart';
const categories = ['All', 'Clothes', 'Home goods'];
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

const catalogueCurrency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const cataloguePrice = cents => catalogueCurrency.format(cents / 100);
// The checkout summary retains its legacy amount-first format for the demo.
const checkoutPrice = cents => `${(cents / 100).toFixed(2)} EUR`;

const productLink = product => `#product/${product.id}`;
const art = product => `<svg class="art ${product.id}" viewBox="0 0 200 150" aria-hidden="true"><use href="#${product.id}"></use></svg>`;
const sale = product => product.sale ? '<span class="sale-tag">Sale</span>' : '';

function shopView() {
    const selection = products.filter(product => category === 'All' || product.category === category);
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
                        <p class="price">${cataloguePrice(product.cents)} ${sale(product)}</p>
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
                <p class="price">${cataloguePrice(product.cents)} ${sale(product)}</p>
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
                            <p>${checkoutPrice(product.cents)} each
                                ${product.sale ? '<span class="cart-sale">Sale</span>' : ''}</p>
                            <p class="price">Item total: ${checkoutPrice(product.cents * cart[product.id])}</p>
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
                <p class="total"><strong>Subtotal</strong><strong>${checkoutPrice(subtotal)}</strong></p>
                <p>Demo only. No shipping or payments.</p>
                <a href="#shop">Continue shopping</a>
            </section>
        </div>`;
}

function updateCount() {
    document.querySelector('#cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function render(moveFocus = false) {
    const route = location.hash || '#shop';
    const product = products.find(item => productLink(item) === route);
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
    } else {
        store.innerHTML = '<h1>Page not found</h1><a href="#shop">Back to shop</a>';
        title = 'Page not found';
    }

    document.title = `${title} | BrightShop`;
    for (const [id, active] of [['shop-link', isShop], ['cart-link', isCart]]) {
        const link = document.getElementById(id);
        if (active) link.setAttribute('aria-current', 'page');
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
