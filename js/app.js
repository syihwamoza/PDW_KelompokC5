// File: js/app.js

$(document).ready(function() {

    // ===================================
    // KODE CUSTOM UNTUK LOGIKA APLIKASI
    // ===================================

    const API_BASE_URL = 'http://localhost/proyek-resto/api/';
    let isEditMode = false; // Ini untuk mode edit global, bukan per item

    // -----------------------------------
    // FUNGSI-FUNGSI UTAMA
    // -----------------------------------

    function updateUI(isLoggedIn, isAdmin) {
        if (isLoggedIn) {
            // JIKA SUDAH LOGIN:
            // 1. Tampilkan semua konten yang butuh login.
            $('.logged-in-only').show();

            // 2. Sembunyikan tombol untuk tamu.
            $('.guest-only').hide();

            // 3. Atur visibilitas berdasarkan role.
            if (isAdmin) {
                $('.admin-only').show();
                // Jika admin tidak perlu melihat bagian user-only, uncomment baris ini:
                $('.user-only:not(.admin-only)').hide();
            } else {
                $('.user-only').show();
                $('.admin-only:not(.user-only)').hide();
            }

            // =======================================================
            // BARIS KUNCI: Paksa Isotope untuk re-layout setelah ditampilkan
            // Kita beri sedikit jeda agar DOM sempat 'bernapas'
            setTimeout(function() {
                if ($.fn.isotope) { // Cek apakah Isotope sudah ada
                    $('.portfolio-items').isotope('layout');
                }
            }, 200); // Jeda 200 milidetik
            // =======================================================

        } else {
            // JIKA BELUM LOGIN (TAMU):
            // Sembunyikan semua konten.
            $('.logged-in-only').hide();
            $('.guest-only').show();
            $('.admin-only, .user-only').hide();
        }
    }

    // Fungsi ini mengontrol mode edit global (semua field jadi editable)
    function toggleMenuEditMode() {
        isEditMode = !isEditMode;
        $('.editable-field').attr('contenteditable', isEditMode);
        $('.edit-mode-controls').toggle(isEditMode);

        if (isEditMode) {
            $('#toggleEditMenuBtn').text('Save Changes').removeClass('btn-info').addClass('btn-success');
        } else {
            $('#toggleEditMenuBtn').text('Edit Menu').removeClass('btn-success').addClass('btn-info');
            saveMenuToServer();
        }
    }

    async function loadMenuFromServer() {
        try {
            const response = await fetch(API_BASE_URL + 'menu_read.php');
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            renderMenu(data);
        } catch (error) {
            console.error("Error loading menu:", error);
            $('#menu-content-row').html('<p class="text-danger text-center">Failed to load menu.</p>');
        }
    }

    function renderMenu(menuData) {
        const menuContainer = $('#menu-content-row');
        menuContainer.empty();

        menuData.forEach((section, index) => {
            const sectionHtml = `
                <div class="col-xs-12 col-sm-6">
                    <div class="menu-section">
                        <h2 class="menu-section-title editable-field">${section.title}</h2>
                        <hr>
                        <div class="menu-items-container">
                            ${section.items.map(item => `
                                <div class="menu-item">
                                    <button class="btn btn-danger btn-xs pull-right edit-mode-controls delete-item-btn">×</button>
                                    <div class="menu-item-name editable-field">${item.name}</div>
                                    <div class="menu-item-price editable-field">${item.price}</div>
                                    <div class="menu-item-description editable-field">${item.description}</div>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-success btn-sm edit-mode-controls add-item-btn">+ Add Item</button>
                    </div>
                </div>`;
            menuContainer.append(sectionHtml);
            if ((index + 1) % 2 === 0) {
                menuContainer.append('<div class="clearfix"></div>');
            }
        });
        if (!isEditMode) {
            $('.edit-mode-controls').hide();
        }
    }

    async function saveMenuToServer() {
        const menuData = [];
        $('.menu-section').each(function() {
            const section = { title: $(this).find('.menu-section-title').text(), items: [] };
            $(this).find('.menu-item').each(function() {
                section.items.push({
                    name: $(this).find('.menu-item-name').text(),
                    price: $(this).find('.menu-item-price').text(),
                    description: $(this).find('.menu-item-description').text()
                });
            });
            menuData.push(section);
        });

        try {
            const response = await fetch(API_BASE_URL + 'menu_update.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuData),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to save menu');
            Swal.fire('Success!', 'Menu updated successfully!', 'success'); // Mengganti alert dengan Swal
        } catch (error) {
            console.error("Error saving menu:", error);
            Swal.fire('Error!', 'Error saving menu: ' + error.message, 'error'); // Mengganti alert dengan Swal
        }
    }

    // -----------------------------------
    // EVENT HANDLERS
    // -----------------------------------

    $(document).on('click', '.add-item-btn', function() {
        const newItemHtml = `
            <div class="menu-item">
                <button class="btn btn-danger btn-xs pull-right edit-mode-controls delete-item-btn" style="display: block;">×</button>
                <div class="menu-item-name editable-field" contenteditable="true">New Dish</div>
                <div class="menu-item-price editable-field" contenteditable="true">$0</div>
                <div class="menu-item-description editable-field" contenteditable="true">Enter description here.</div>
            </div>`;
        $(this).siblings('.menu-items-container').append(newItemHtml);
    });

    $(document).on('click', '.delete-item-btn', function() {
        Swal.fire({ // Mengganti confirm dengan Swal
            title: 'Are you sure?',
            text: "You are about to delete this menu item!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $(this).closest('.menu-item').remove();
                Swal.fire('Deleted!', 'The menu item has been deleted.', 'success');
            }
        });
    });

    $('.nav a[href="#call-reservation"]').on('click', function() {
        // Hapus class 'active' dari semua link navigasi
        $('.nav li.active').removeClass('active');
        // Tambahkan class 'active' ke parent (elemen <li>) dari link yang diklik
        $(this).parent().addClass('active');
    });

    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        const username = $('#loginUsername').val().trim();
        const password = $('#loginPassword').val();
        const loginError = $('#loginError');
        loginError.text('').hide();

        if (!username || !password) {
            loginError.text('Username and password are required').show();
            return;
        }

        try {
            const response = await fetch(API_BASE_URL + 'auth_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            sessionStorage.setItem('userData', JSON.stringify(data.user));
            updateUI(true, data.user.role === 'admin');
            $('#loginModal').modal('hide');
            this.reset();
            if (data.user.role === 'admin') {
                $('html, body').animate({ scrollTop: $('#admin-section').offset().top - 50 }, 1000);
            }
        } catch (error) {
            console.error("Login error:", error);
            loginError.text(error.message).show();
        }
    });

    $('#registerForm').on('submit', async function(e) {
        e.preventDefault();
        const username = $('#registerUsername').val().trim();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        const registerError = $('#registerError');
        registerError.text('').hide();

        if (password !== confirmPassword) {
            registerError.text('Passwords do not match').show();
            return;
        }

        try {
            const response = await fetch(API_BASE_URL + 'auth_register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            Swal.fire('Success', 'Registration successful! Please login.', 'success'); // Mengganti alert dengan Swal
            $('#registerModal').modal('hide');
            this.reset();
        } catch (error) {
            console.error("Registration error:", error);
            registerError.text(error.message).show();
        }
    });

    // KODE BARU (Logout dengan Konfirmasi Cantik)
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure you want to logout?',
            text: "You will be returned to the main page.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then(async (result) => {
            // 'result.isConfirmed' akan bernilai true jika user mengklik tombol "Yes, logout!"
            if (result.isConfirmed) {
                try {
                    // Tampilkan loading spinner
                    Swal.fire({
                        title: 'Logging out...',
                        text: 'Please wait.',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // Proses logout ke backend
                    await fetch(API_BASE_URL + 'auth_logout.php', { method: 'POST', credentials: 'include' });

                    // Hapus data dari session storage
                    sessionStorage.removeItem('userData');

                    // Reload halaman untuk kembali ke state awal
                    // setTimeout untuk memberi waktu user melihat pesan "Logging out..."
                    setTimeout(() => {
                        window.location.reload();
                    }, 500); // jeda 0.5 detik

                } catch (error) {
                    console.error("Logout error:", error);
                    Swal.fire(
                        'Error!',
                        'Something went wrong during logout.',
                        'error'
                    );
                }
            }
        });
    });

    $('#toggleEditMenuBtn').on('click', toggleMenuEditMode);

    $('#viewReportBtn').on('click', async function() {
        const reportModalBody = $('#reportModalBody');
        reportModalBody.html('<p>Loading report...</p>');
        $('#reportModal').modal('show');

        try {
            const response = await fetch(API_BASE_URL + 'report_read.php', { credentials: 'include' });
            const reportData = await response.json();
            if (!response.ok) throw new Error(reportData.message || 'Failed to load report');

            let reportHtml = `
                <h4>Summary</h4>
                <p><strong>Total Users:</strong> ${reportData.summary.total_users}</p>
                <p><strong>Total Reservations:</strong> ${reportData.summary.total_reservations}</p>
                <hr>
                <h4>Reservation List</h4>
            `;

            if (reportData.reservations.length > 0) {
                reportHtml += `
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th><th>Customer Name</th><th>Phone</th><th>Date</th>
                                    <th>Time</th><th>Guests</th><th>Request</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                reportData.reservations.forEach((r, index) => {
                    reportHtml += `
                        <tr>
                            <td>${index + 1}</td><td>${r.customer_name || '-'}</td>
                            <td>${r.phone_number || '-'}</td><td>${r.reservation_date || '-'}</td>
                            <td>${r.reservation_time || '-'}</td><td>${r.num_guests || '-'}</td>
                            <td>${r.special_request || '-'}</td>
                        </tr>
                    `;
                });
                reportHtml += `</tbody></table></div>`;
            } else {
                reportHtml += '<p>No reservation data available.</p>';
            }
            reportModalBody.html(reportHtml);
        } catch (error) {
            console.error("Error loading report:", error);
            reportModalBody.html('<p class="text-danger">Error: ' + error.message + '</p>');
        }
    });

    $('#reservationForm').on('submit', async function(e) {
        e.preventDefault();

        const formData = {
            customer_name: $('#name').val(),
            phone_number: $('#phone').val(),
            reservation_date: $('#date').val(),
            reservation_time: $('#time').val(),
            num_guests: $('#guests').val(),
            special_request: $('#special_request').val()
        };

        if (!formData.customer_name || !formData.reservation_date || !formData.reservation_time || !formData.num_guests) {
            Swal.fire('Warning', 'Please fill all required fields (Name, Date, Time, Number of Guests).', 'warning'); // Mengganti alert dengan Swal
            return;
        }

        try {
            const response = await fetch(API_BASE_URL + 'reservation_create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Reservation failed');

            Swal.fire('Success!', 'Reservation created successfully!', 'success'); // Mengganti alert dengan Swal
            this.reset();
        } catch (error) {
            console.error("Reservation error:", error);
            Swal.fire('Error!', 'Error: ' + error.message, 'error'); // Mengganti alert dengan Swal
        }
    });

    // -----------------------------------
    // INISIALISASI HALAMAN
    // -----------------------------------

    function initPage() {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            updateUI(true, user.role === 'admin');
        } else {
            updateUI(false, false);
        }
        loadMenuFromServer();
        // Atur tanggal minimum untuk input tanggal (agar tidak bisa pilih tanggal lampau)
        $('#date').attr('min', new Date().toISOString().split('T')[0]);
    }

    initPage();
});