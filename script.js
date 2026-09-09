// Hàm xử lý thanh toán chưa hoàn tất (Bắt buộc theo chuẩn Pi SDK)
function onIncompletePaymentFound(payment) {
    console.log("Phát hiện giao dịch chưa hoàn tất:", payment);
};

// Khởi tạo và xác thực với Pi Network
function initPiNetwork() {
    console.log("Đang kết nối tới Pi SDK...");

    // Kiểm tra xem SDK đã tải thành công chưa
    if (typeof Pi === 'undefined') {
        console.error("Chưa tải được Pi SDK. Kiểm tra lại kết nối mạng!");
        document.getElementById('username').innerText = "Lỗi tải Pi SDK";
        return;
    }

    // Cấu hình khởi tạo (Đổi sandbox: false khi lên Mainnet)
    Pi.init({ version: "2.0", sandbox: true })
        .then(() => {
            console.log("Pi SDK khởi tạo thành công. Bắt đầu xác thực...");
            
            // Đặt thời gian chờ tối đa 10 giây (Timeout) chống treo ứng dụng
            const authTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Xác thực quá thời gian (Timeout 10s)")), 10000)
            );

            return Promise.race([
                Pi.authenticate(['username', 'payments'], onIncompletePaymentFound),
                authTimeout
            ]);
        })
        .then(auth => {
            console.log("Xác thực thành công!", auth);
            // Cập nhật tên người dùng lên giao diện
            if (auth && auth.user) {
                document.getElementById('username').innerText = "Kỳ thủ: " + auth.user.username;
            }
        })
        .catch(error => {
            console.error("Lỗi trong quá trình kết nối Pi:", error);
            document.getElementById('username').innerText = "Lỗi kết nối Pi";
            // Hiển thị thông báo lỗi trực tiếp thay vì xoay vô tận
            alert("Không thể xác thực tài khoản Pi: " + (error.message || error));
        });
}

// Hàm thử nghiệm thanh toán Pi
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
            console.log("Đang chờ Server duyệt paymentId:", paymentId);
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            console.log("Giao dịch hoàn tất txid:", txid);
            alert("Thanh toán thành công!");
        },
        onCancel: function(paymentId) {
            console.log("Người dùng hủy thanh toán:", paymentId);
        },
        onError: function(error, payment) {
            console.error("Lỗi thanh toán:", error);
        }
    });
}

// Chạy hàm khởi tạo khi trang web tải xong
window.addEventListener('DOMContentLoaded', initPiNetwork);
