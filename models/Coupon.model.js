const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  // 	Mã code của coupon, duy nhất trên toàn hệ thống
  coupon_code: {
    type: String,
    required: true,
    unique: true,
  },
  // Loại giảm giá, có thể là giảm phần trăm hoặc một số tiền cố định
  coupon_type: {
    type: [String],
    enum: ["percent", "fixed_amount"],
  },

  // 	Giá trị giảm giá, nếu coupon_type là 'percent' thì giá trị này sẽ là phần trăm giảm, còn nếu coupon_type là 'fixed_amount' thì giá trị này sẽ là số tiền cố định giảm
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

  // Số tiền tối thiểu để sử dụng coupon
  coupon_min_spend: {
    type: Number,
  },

  //Số tiền tối đa được giảm giá khi sử dụng coupon
  coupon_max_spend: {
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
});

// orderSchema.pre("save", async function (next) {
//   this.status = true;
//   next();
// });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
