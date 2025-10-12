// Import các component của Swiper React
import { Swiper, SwiperSlide } from "swiper/react";

// Import các module cần thiết của Swiper
// Đây là các tính năng bạn muốn sử dụng như điều hướng, phân trang, tự động chạy...
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import file CSS cốt lõi của Swiper và các module
import "swiper/css";
import "swiper/css/navigation";
import "../assets/imageGallery.css";

export default function ImageGallery({ images = [] }) {
  return (
    <Swiper
      // Đăng ký các module bạn muốn sử dụng
      modules={[Navigation, Pagination, Autoplay]}
      // Các tùy chọn (tương tự như trong Owl Carousel)
      spaceBetween={30} // Khoảng cách giữa các slide
      slidesPerView={1} // Số slide hiển thị cùng lúc (tương đương 'items')
      loop={true} // Lặp vô tận
      pagination={{
        // Cài đặt cho các dấu chấm (dots)
        clickable: true,
      }}
      navigation={false} // Bật nút Next/Prev (tương đương 'nav')
      autoplay={{
        // Cài đặt tự động chạy
        delay: 5000,
        disableOnInteraction: false,
      }}
      className="s_Product_carousel"
    >
      {/* Dùng hàm map để render các slide từ prop images */}
      {images &&
        images.map((image) => (
          <SwiperSlide key={image.id} className="single-prd-item">
            <img
              src={image.imagePath}
              alt={image.altText}
              style={{ width: "100%", display: "block" }}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
