// Hàm xử lý thanh toán chưa hoàn tất
function onIncompletePaymentFound(payment) {
    console.log("Phát hiện giao dịch chưa hoàn tất:", payment);
}

// Khởi tạo và xác thực Pi Network
function initPiNetwork() {
    console.log("Đang kết nối tới Pi SDK...");

    if (typeof Pi === 'undefined') {
        console.error("Chưa tải được Pi SDK!");
        document.getElementById('username').innerText = "Lỗi tải Pi SDK";
        return;
    }

    // Tự động nhận diện môi trường (Chạy trực tiếp trên Pi Browser không dùng sandbox)
    Pi.init({ version: "2.0", sandbox: false })
        .then(() => {
            console.log("Pi SDK khởi tạo thành công. Bắt đầu xác thực...");
            return Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        })
        .then(auth => {
            console.log("Xác thực thành công!", auth);
            if (auth && auth.user) {
                document.getElementById('username').innerText = "Kỳ thủ: " + auth.user.username;
            }
        })
        .catch(error => {
            console.error("Lỗi xác thực Pi:", error);
            // Nếu chạy trên bản Production chưa verified, chuyển sang chế độ Sandbox dự phòng
            if (error && error.message && error.message.includes("sandbox")) {
                initSandboxFallback();
            } else {
                document.getElementById('username').innerText = "Kỳ thủ Khách";
            }
        });
}

// Hàm dự phòng cho môi trường thử nghiệm
function initSandboxFallback() {
    Pi.init({ version: "2.0", sandbox: true })
        .then(() => Pi.authenticate(['username', 'payments'], onIncompletePaymentFound))
        .then(auth => {
            if (auth && auth.user) {
                document.getElementById('username').innerText = "Kỳ thủ: " + auth.user.username;
            }
        })
        .catch(err => {
            console.error("Lỗi Sandbox:", err);
            document.getElementById('username').innerText = "Kỳ thủ Khách";
        });
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
            console.log("Chờ duyệt paymentId:", paymentId);
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            console.log("Thành công txid:", txid);
            alert("Thanh toán thành công!");
        },
        onCancel: function(paymentId) {
            console.log("Đã hủy thanh toán:", paymentId);
        },
        onError: function(error, payment) {
            console.error("Lỗi thanh toán:", error);
        }
    });
}

window.addEventListener('DOMContentLoaded', initPiNetwork);
