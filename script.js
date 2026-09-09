// Hàm xử lý thanh toán chưa hoàn tất
function onIncompletePaymentFound(payment) {
    console.log("Phát hiện giao dịch chưa hoàn tất:", payment);
}

// Khởi tạo Pi Network SDK
function initPiNetwork() {
    if (typeof Pi === 'undefined') {
        document.getElementById('username').innerText = "Lỗi tải Pi SDK";
        return;
    }

    // Bật sandbox: true để thử nghiệm giao dịch trên Testnet
    Pi.init({ version: "2.0", sandbox: true })
        .then(() => {
            return Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        })
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

// Hàm xử lý nạp Pi (chế độ Testnet / Demo)
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
            console.log("Đã tạo giao dịch thành công với ID:", paymentId);
            // Thông báo giả lập phê duyệt client thành công
            alert("Tạo giao dịch Testnet thành công! ID: " + paymentId);
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            console.log("Hoàn tất giao dịch:", txid);
            alert("Thanh toán thành công!");
        },
        onCancel: function(paymentId) {
            console.log("Người dùng đã hủy giao dịch:", paymentId);
        },
        onError: function(error, payment) {
            console.error("Lỗi giao dịch:", error);
            alert("Lỗi thanh toán: " + (error.message || "Giao dịch bị hủy"));
        }
    });
}

window.addEventListener('DOMContentLoaded', initPiNetwork);
