export default function SingleProduct() {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="single-product">
        <img className="img-fluid" src="img/product/p1.jpg" />
        <div className="product-details">
          <h6>addidas New Hammer sole for Sports person</h6>
          <div className="price">
            <h6>$150.00</h6>
            <h6 className="l-through">$210.00</h6>
          </div>
          <div className="prd-bottom">
            <a className="social-info">
              <span className="ti-bag" />
              <p className="hover-text">add to bag</p>
            </a>
            <a className="social-info">
              <span className="lnr lnr-heart" />
              <p className="hover-text">Wishlist</p>
            </a>
            <a className="social-info">
              <span className="lnr lnr-sync" />
              <p className="hover-text">compare</p>
            </a>
            <a className="social-info">
              <span className="lnr lnr-move" />
              <p className="hover-text">view more</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
