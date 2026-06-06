/**
 * Booking lifecycle hooks
 * - Tự sinh mã đơn format WB-YYYYMMDD-XXXX trước khi tạo
 * - Tự tính tổng tiền từ danh sách dịch vụ
 * - Ghi lại lịch sử trạng thái khi cập nhật
 */

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // 1. Tự sinh mã đơn WB-YYYYMMDD-XXXX
    if (!data.bookingCode) {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

      // Đếm số đơn trong ngày hôm nay
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const count = await strapi.entityService.count("api::booking.booking", {
        filters: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      });

      const seq = String(count + 1).padStart(4, "0");
      data.bookingCode = `WB-${dateStr}-${seq}`;
    }

    // 2. Tự tính tổng tiền từ items
    if (data.items && Array.isArray(data.items)) {
      const subtotal = data.items.reduce((sum: number, item: any) => {
        return sum + (item.unitPrice || 0) * (item.quantity || 1);
      }, 0);

      data.subtotal = subtotal;

      // Tính thành tiền sau giảm giá
      const discountAmount = data.discountAmount || 0;
      const discountPercent = data.discountPercent || 0;
      const discountFromPercent = subtotal * (discountPercent / 100);
      const totalDiscount = discountAmount + discountFromPercent;

      data.totalAmount = Math.max(0, subtotal - totalDiscount);
      data.remainingAmount = Math.max(0, data.totalAmount - (data.depositAmount || 0));
    }

    // 3. Ghi lịch sử trạng thái đầu tiên
    data.statusHistory = [
      {
        toStatus: data.bookingStatus || "pending",
        changedAt: new Date().toISOString(),
        changedBy: "system",
        note: "Đơn được tạo",
      },
    ];
  },

  async beforeUpdate(event: any) {
    const { data, where } = event.params;

    // Tính lại tổng tiền nếu items thay đổi
    if (data.items && Array.isArray(data.items)) {
      const subtotal = data.items.reduce((sum: number, item: any) => {
        return sum + (item.unitPrice || 0) * (item.quantity || 1);
      }, 0);
      data.subtotal = subtotal;

      const discountAmount = data.discountAmount || 0;
      const discountPercent = data.discountPercent || 0;
      const totalDiscount = discountAmount + subtotal * (discountPercent / 100);

      data.totalAmount = Math.max(0, subtotal - totalDiscount);
      data.remainingAmount = Math.max(0, data.totalAmount - (data.depositAmount || 0));
    }

    // Ghi lịch sử nếu bookingStatus thay đổi
    if (data.bookingStatus) {
      const existing = await strapi.entityService.findOne(
        "api::booking.booking",
        where.id,
        { populate: ["statusHistory"] }
      );

      if (existing && (existing as any).bookingStatus !== data.bookingStatus) {
        const currentHistory = (existing as any).statusHistory || [];
        data.statusHistory = [
          ...currentHistory,
          {
            toStatus: data.bookingStatus,
            changedAt: new Date().toISOString(),
            changedBy: data._updatedBy || "admin",
            note: data._statusNote || "",
          },
        ];
      }
    }
  },
};
