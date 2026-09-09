// Khởi tạo SDK Pi Network
document.addEventListener('DOMContentLoaded', () => {
    if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        
        // Khởi tạo người dùng Pi
        window.Pi.authenticate(['username'], function(auth) {
            document.getElementById('username').innerText = auth.user.username;
        }, function(error) {
            console.error("Lỗi xác thực Pi:", error);
        });
    }
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
            alert("Lỗi thanh toán: " + error.message);
        }
    };

    window.Pi.createPayment(paymentData, callbacks);
}

// Khởi tạo bàn cờ Tướng đơn giản
const board = document.getElementById('chessboard');
if (board) {
    for (let i = 0; i < 90; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        board.appendChild(cell);
    }
}
