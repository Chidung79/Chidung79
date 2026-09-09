function onIncompletePaymentFound(payment) {
    console.log("Phát hiện giao dịch dở dang:", payment);
}

function initPiNetwork() {
    if (typeof Pi === 'undefined') return;

    Pi.init({ version: "2.0", sandbox: true })
        .then(() => Pi.authenticate(['username', 'payments'], onIncompletePaymentFound))
        .then(auth => {
            if (auth && auth.user) {
                document.getElementById('username').innerText = "Kỳ thủ: " + auth.user.username;
            }
        })
        .catch(error => console.error("Lỗi xác thực Pi:", error));
}

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
            fetch('/api/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: paymentId, action: 'approve' })
            })
            .then(res => res.json())
            .then(data => console.log("Đã duyệt từ Server:", data))
            .catch(err => console.error("Lỗi duyệt Server:", err));
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            fetch('/api/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: paymentId, action: 'complete' })
            })
            .then(res => res.json())
            .then(data => {
                alert("Thanh toán thành công! Mã GD: " + txid);
                document.getElementById('balance').innerText = "Ví: 1 Pi";
            })
            .catch(err => console.error("Lỗi hoàn tất Server:", err));
        },
        onCancel: function(paymentId) {
            console.log("Hủy giao dịch:", paymentId);
        },
        onError: function(error, payment) {
            console.error("Lỗi giao dịch:", error);
        }
    });
}

window.addEventListener('DOMContentLoaded', initPiNetwork);
