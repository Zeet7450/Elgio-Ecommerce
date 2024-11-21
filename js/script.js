// Script for navigation bar
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan selector ini sesuai dengan icon shopping cart di navbar Anda
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartBadge = document.querySelector('#lg-bag a'); // Sesuaikan dengan struktur navbar Anda

    // Debug: Tambahkan console.log untuk memastikan elemen terdeteksi
    console.log('Cart Buttons:', cartButtons);
    console.log('Cart Badge:', cartBadge);

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Tambahkan event listener untuk cart buttons
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Debug: Pastikan data produk terdeteksi
            console.log('Product Data:', button.dataset);

            const product = {
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };

            // Tambahkan debug log
            console.log('Adding Product:', product);

            // Logika tambah ke keranjang
            const existingProduct = cartItems.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cartItems.push(product);
            }

            // Simpan ke localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update badge dan halaman cart
            updateCartBadge();
            updateCartPage();
        });
    });

    function updateCartBadge() {
        if (cartBadge) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            
            // Debug: Cek total item
            console.log('Total Cart Items:', totalItems);

            // Tambahkan atribut atau teks untuk menampilkan jumlah
            cartBadge.setAttribute('data-count', totalItems);
            // Atau bisa juga:
            // cartBadge.innerHTML = `<span class="cart-count">${totalItems}</span>`;
        }
    }

    function updateCartPage() {
        // Cari container untuk item cart di halaman cart
        const cartItemsContainer = document.querySelector('#cart-items');
        
        if (cartItemsContainer) {
            // Render ulang item di keranjang
            renderCartItems(cartItemsContainer);
        }
    }

    function renderCartItems(container) {
        container.innerHTML = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const cartItemHTML = `
                <tr>
                    <td>
                        <a href="#" class="remove-item" data-index="${index}">
                            <i class="far fa-times-circle"></i>
                        </a>
                    </td>
                    <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" 
                               class="quantity-input" data-index="${index}">
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>
            `;
            container.innerHTML += cartItemHTML;
        });

        // Tambahkan baris total
        container.innerHTML += `
            <tr>
                <td colspan="5">Total</td>
                <td>$${total.toFixed(2)}</td>
            </tr>
        `;

        // Tambahkan event listener untuk tombol hapus
        setupRemoveItemListeners();
        // Tambahkan event listener untuk perubahan kuantitas
        setupQuantityInputListeners();
    }

    function setupRemoveItemListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.target.closest('a').dataset.index;
                cartItems.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartBadge();
                updateCartPage();
            });
        });
    }

    function setupQuantityInputListeners() {
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value);
                cartItems[index].quantity = newQuantity;
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartBadge();
                updateCartPage();
            });
        });
    }

    // Inisialisasi saat halaman dimuat
    updateCartBadge();
    updateCartPage();
});
