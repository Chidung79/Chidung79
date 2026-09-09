// Tự động xử lý giao dịch dở dang
function onIncompletePaymentFound(payment) {
    console.log("Xử lý giao dịch dở dang:", payment);
    completePayment(payment.identifier, payment.transaction.txid);
}

// Khởi tạo Pi SDK
function initPiNetwork() {
    if (typeof Pi === 'undefined') {
        document.getElementById('username').innerText = "Lỗi tải Pi SDK";
        return;
    }

    Pi.init({ version: "2.0", sandbox: true })
        .then(() => Pi.authenticate(['username', 'payments'], onIncompletePaymentFound))
        .then(auth => {
            if (auth && auth.user) {
                document.getElementById('username').innerText = "Kỳ thủ: " + auth.user.username;
            }
        })
        .catch(error => {
            console.error("Lỗi xác thực Pi:", error);
            document.getElementById('username').innerText = "Kỳ thủ Khách";
        });
}

// Gọi API tự động hoàn tất giao dịch
function completePayment(paymentId, txid) {
    fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid: txid })
    })
    .then(res => res.json())
    .then(data => console.log("Giao dịch hoàn tất thành công:", data))
    .catch(err => console.error("Lỗi hoàn tất giao dịch:", err));
}

// Hàm nạp Pi
function payWithPi() {
    if (typeof Pi === 'undefined') {
        alert("Pi SDK chưa sẵn sàng!");
        return;
    }

    Pi.createPayment({
        amount: 1,
        memo: "Nạp 1 Pi vào game Pi Chess Master",
        metadata: { type: "deposit" },
    }, {
        onReadyForServerApproval: function(paymentId) {
            // Tự động phê duyệt trực tiếp không thông qua alert
            fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
                method: 'POST'
            }).catch(err => console.log("Gửi lệnh Approve:", err));
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            completePayment(paymentId, txid);
            document.getElementById('balance').innerText = "Ví: 1 Pi";
        },
        onCancel: function(paymentId) {
            console.log("Đã hủy giao dịch:", paymentId);
        },
        onError: function(error, payment) {
            console.error("Lỗi giao dịch:", error);
        }
    });
}

window.addEventListener('DOMContentLoaded', initPiNetwork);
