// Khởi tạo SDK Pi Network
document.addEventListener('DOMContentLoaded', () => {
    const authOverlay = document.querySelector('div[style*="position: fixed"], .auth-popup, #auth-overlay') || document.body.lastElementChild;

    function hideAuthOverlay() {
        // Tự động tìm và ẩn popup thông báo Authenticating
        const overlays = document.querySelectorAll('div');
        overlays.forEach(el => {
            if (el.innerText && el.innerText.includes('Authenticating with Pi Network')) {
                el.style.display = 'none';
            }
        });
    }

    if (window.Pi) {
        try {
            window.Pi.init({ version: "2.0", sandbox: true });
            
            // Khởi tạo người dùng Pi
            window.Pi.authenticate(['username', 'payments'], function(auth) {
                console.log("Xác thực thành công:", auth);
                const userEl = document.getElementById('username');
                if (userEl) userEl.innerText = auth.user.username;
                hideAuthOverlay();
            }, function(error) {
                console.error("Lỗi xác thực Pi:", error);
                hideAuthOverlay();
            });
        } catch (e) {
            console.error("Lỗi khởi tạo SDK:", e);
            hideAuthOverlay();
        }
    } else {
        hideAuthOverlay();
    }

    // Tự động đóng popup sau 3 giây để tránh bị kẹt giao diện
    setTimeout(hideAuthOverlay, 3000);
});

// Hàm xử lý thanh toán bằng Pi Coin
function payWithPi(amount) {
    if (!window.Pi) {
        alert("Vui lòng mở ứng dụng trong Pi Browser để thanh toán!");
        return;
    }

    const paymentData = {
        amount: amount,
        memo: `Thanh toán ${amount} Pi cho Pi Chess Master`,
        metadata: { item: "Game Credits" }
    };

    const callbacks = {
        onReadyForServerApproval: function(paymentId) {
            console.log("Xác nhận giao dịch ID:", paymentId);
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            alert(`Thanh toán thành công ${amount} Pi!`);
        },
        onCancel: function(paymentId) {
            alert("Giao dịch đã bị hủy.");
        },
        onError: function(error, payment) {
            alert("Lỗi thanh toán: " + (error.message || error));
        }
    };

    window.Pi.createPayment(paymentData, callbacks);
}

// Khởi tạo bàn cờ Tướng đơn giản
const board = document.getElementById('chessboard');
if (board) {
    board.innerHTML = '';
    for (let i = 0; i < 90; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        board.appendChild(cell);
    }
}
