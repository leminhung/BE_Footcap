const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  // 	Mã code của coupon, duy nhất trên toàn hệ thống
  coupon_code: {
    type: String,
    required: true,
    unique: true,
  },

  // 	Giá trị này sẽ là số tiền đơn hàng đủ điều kiện giảm
  coupon_value: {
    type: Number,
  },

  // 	Ngày bắt đầu áp dụng coupon
  coupon_start_date: {
    type: Date,
  },

  // Ngày kết thúc áp dụng coupon
  coupon_end_date: {
    type: Date,
  },

  //Số tiền được giảm giá khi sử dụng coupon
  coupon_spend: {
    type: Number,
  },

  // Trạng thái của coupon, có thể là đang hoạt động, hết hạn hoặc bị vô hiệu hóa
  coupon_status: {
    type: [String],
    enum: ["active", "expired", "disabled"],
  },

  // Số lần sử dụng coupon tối đa cho chính coupon đó
  coupon_uses_per_coupon: {
    type: Number,
  },

  // Đếm số lần sử dụng coupon
  coupon_count_per_coupon: {
    type: Number,
    default: 0,
  },
});

couponSchema.pre("save", function (next) {
  this.coupon_count_per_coupon += 1;
  return next();
});

module.exports = mongoose.model("Coupon", couponSchema);
