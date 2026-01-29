import { Fragment } from "react/jsx-runtime"
import Slider from "react-slick";
import { StarFill, Star } from 'react-bootstrap-icons';

interface Props {
  products?: Array<unknown>
}


const BestSellerComponent = ({ products }: Props) => {

  const setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  }

  return (
    <Fragment>
      <Slider {...setting}>
        { products?.map((product, index) => {
          return (
            <div key={index} className="card me-2 p-4 rounded-0 border-0 d-block" v-for="image in images" >
              <div className="card-body clearfix">
                <div className="float-start">
                  <img src={(product as { image: string }).image} className="img img-responsive text-center" width="120" alt="image" />
                </div>
                <div className="float-end">
                  <h5 className='text-primary'>{(product as { category: string }).category}</h5>
                  <h6 className="fw-bolder">{(product as { name: string }).name}</h6>
                  <strong className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</strong><del><strong className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</strong></del>
                  <div className='clearfix text-warning'>
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
              </div>
            </div>
          )
        })}
      </Slider>
    </Fragment>
  )
}

export default BestSellerComponent