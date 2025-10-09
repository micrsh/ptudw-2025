import SingleProduct from "./SingleProduct";

export default function ProductList() {
  return (
    <section className="lattest-product-area pb-40 category-list">
      <div className="row">
        {/* single product */}
        <SingleProduct/>
      </div>
    </section>
  );
}
