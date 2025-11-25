import { useState, useEffect, useMemo } from "react";
import { http } from "../lib/http";
import SingleProduct from "./SingleProduct";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import SidebarCategory from "../components/SidebarCategories";
import SidebarFilter from "../components/SidebarFilter";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Lay cac gia tri tu search params
  const categoryId = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || 1;
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 4000;
  const [priceRange, setPriceRange] = useState([min, max]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (categoryId) {
      p.set("categoryId", categoryId);
    }
    if (sort) {
      p.set("sort", sort);
    }
    if (min) {
      p.set("minPrice", min);
    }
    if (max) {
      p.set("maxPrice", max);
    }
    p.set("limit", limit);
    p.set("page", page);

    console.log("Query String:", p.toString());

    return p.toString();
  }, [categoryId, sort, limit, page, min, max]);

  useEffect(() => {
    let canceled = false; // Biến để kiểm tra hủy bỏ
    setLoading(true);
    setError(null);

    async function load() {
      setLoading(true);
      setError(null); // Đặt lại lỗi trước khi tải
      try {
        // Giả sử bạn có một hàm http.get để lấy dữ liệu từ API
        console.log(
          "API URL:",
          `${import.meta.env.VITE_API_URL}/products?${queryString}`
        );
        const res = await http.get(`/products?${queryString}`);
        const data = res.data.data; // Giả sử dữ liệu sản phẩm nằm trong res.data.data

        if (!canceled) {
          // Chỉ cập nhật state nếu không bị hủy
          setProducts(data.products);
          setTotalPages(data.pagination.totalPages);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        if (!canceled) {
          setLoading(false);
          // Chỉ cập nhật state nếu không bị hủy
          setError(
            error?.response?.data.message ||
              error.message ||
              "Khong tai duoc danh muc san pham"
          );
        }
      }
    }

    load();
    return () => {
      canceled = true; // Đánh dấu là đã hủy bỏ
    };
  }, [queryString]);

  function handleSortChange(value) {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete("sort");
    } else {
      next.set("sort", value);
      next.set("page", 1); // Reset ve trang 1 khi thay doi sort
      setSearchParams(next);
    }
  }

  function handleLimitChange(value) {
    const next = new URLSearchParams(searchParams);
    next.set("page", 1); // Reset ve trang 1 khi thay doi limit
    setSearchParams(next);
    setLimit(value);
  }

  function handlePageChange(value) {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.set("page", 1);
    } else {
      next.set("page", value);
      setSearchParams(next);
    }
  }

  function handlePriceRangeChange(value) {
    setPriceRange(value);
    const next = new URLSearchParams(searchParams);
    if (value[0] == null) {
      next.delete("min");
    } else {
      next.set("min", String(value[0]));
    }
    if (value[1] == null) {
      next.delete("max");
    } else {
      next.set("max", String(value[1]));
    }

    next.set("page", 1); // Reset ve trang 1 khi thay doi filter
    setSearchParams(next);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-3 col-lg-4 col-md-5">
          <SidebarCategory />
          <SidebarFilter
            priceRange={priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="col-xl-9 col-lg-8 col-md-7">
          {/* Start Filter Bar */}
          {loading && <div> Dang tai...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && (
            <>
              <FilterBar
                sort={sort}
                onSortChange={handleSortChange}
                limit={limit}
                onLimitChange={handleLimitChange}
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              {/* End Filter Bar */}
              {/* Start Best Seller */}
              <section className="lattest-product-area pb-40 category-list">
                <div className="row">
                  {products.length === 0 ? (
                    <div className="alert alert-info">No product found</div>
                  ) : (
                    <>
                      {products.map((p) => (
                        <SingleProduct key={p.id} product={p} />
                      ))}
                    </>
                  )}
                </div>
              </section>
              {/* End Best Seller */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
