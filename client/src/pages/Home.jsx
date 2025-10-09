import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import SidebarCategory from "../components/SidebarCategories";
import SidebarFilter from "../components/SidebarFilter";

export default function Home() {
  return (
    <>
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-5">
            <SidebarCategory/>
            <SidebarFilter/>
          </div>
          <div className="col-xl-9 col-lg-8 col-md-7">
            {/* Start Filter Bar */}
            <FilterBar/>
            {/* End Filter Bar */}
            {/* Start Best Seller */}
            <ProductList/>
            {/* End Best Seller */}           
          </div>
        </div>
      </div>
      \
    </>
  );
}
