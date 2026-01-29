import { Fragment } from "react/jsx-runtime"
import { StarFill, CartPlus, Star } from 'react-bootstrap-icons';
import Slider from "react-slick";
import { NavLink } from "react-router-dom";

interface Props {
  products?: Array<unknown>
}

const RelatedProduct = ({ products }: Props) => {

  const setting = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear"
  }

  return (
    <Fragment>
      <div className="slider-container text-center">
        <Slider {...setting}>
          { products?.map((product, index) => {
            return (
              <div className='me-2' key={index}>
                <div className='card me-2'>
                  <img src={(product as { image: string }).image} className='card-img-top' alt='' />
                  <div className='card-body p-4'>
                    <h5 className='text-primary'>{(product as { category: string }).category}</h5>
                    <h6 className="fw-bolder">{(product as { name: string }).name}</h6>
                    <strong className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</strong><del><strong className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</strong></del>
                    <div className="d-flex justify-content-center small text-warning">
                       {Array.from({ length: (product as { total_rating: number }).total_rating }, (_, i) => (
                          <StarFill key={i} size={17} />
                      ))}
                      { (product as { total_rating: number }).total_rating < 5 ? <>
                            {Array.from({ length: 5 - (product as { total_rating: number }).total_rating }, (_, j) => (
                              <Star key={j} size={17} />
                            ))}
                      </> : <></> }
                    </div>
                  </div>
                  <div className="card-footer bg-transparent text-center border-top-0">
                     <NavLink className="btn btn-primary text-white w-100" to={`/cart/${(product as { id: number }).id}`}>
                        <CartPlus className='mb-1 me-1' />Add To Cart
                      </NavLink>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>
      </div>
    </Fragment>
  )
}

export default RelatedProduct