document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartBadge = document.querySelector('#lg-bag span');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const product = {
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                size: button.dataset.size,
                quantity: 1
            };

            const existingProduct = cartItems.find(item => item.name === product.name && item.size === product.size);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartItems.push(product);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartBadge();
            updateCartPage();
        });
    });

    function updateCartBadge() {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }

    function updateCartPage() {
        const cartItemsContainer = document.querySelector('#cart-items tbody');
        renderCartItems(cartItemsContainer);
    }

    function renderCartItems(container) {
        container.innerHTML = '';
        let total = 0;

        cartItems.forEach((item) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const cartItemHTML = `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
                    <td>${item.name}</td>
                    <td>${item.size}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
            `;

            container.innerHTML += cartItemHTML;
        });

        // Menampilkan total di bawah tabel keranjang
        const totalRowHTML = `
            <tr>
                <td colspan="5" style="text-align: right;"><strong>Total</strong></td>
                <td><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        `;
        container.innerHTML += totalRowHTML;
    }

    // Inisialisasi halaman keranjang saat dimuat
    updateCartBadge();
    updateCartPage();
});