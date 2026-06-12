import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay";
import Description from "../Components/Description";
import RelatedProduct from "../Components/RelatedProduct";




const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { id,category } = useParams();
  const product = all_product.find((item) => item.id === parseInt(id));
   const categoryProducts = all_product.filter(
    (item) => item.category === category
  );
  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <Description />
      <RelatedProduct categoryProducts={categoryProducts} />
    </div>
  );
};

export default Product;