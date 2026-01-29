import { Fragment } from "react/jsx-runtime"
import { Row, Col, Container } from 'react-bootstrap';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import SliderComponent from "../components/SliderComponent"
import BestSellerComponent from "../components/BestSellerComponent"
import Service from "../Service";
import { useCallback, useState, useEffect } from "react";
import { Shimmer } from "react-shimmer";
import { NavLink } from "react-router-dom"

interface Props {
  onloadOrder: () => void
}

const HomePage = ({ onloadOrder }: Props) => {

    const [categoryIndex, setCategoryIndex] = useState(0) 
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(Array<unknown>)
    const [products, setProducts] = useState(Array<unknown>)
    const [topSellings, setTopSellings] = useState(Array<unknown>)
    const [bestSellers, setBestSellers] = useState(Array<unknown>)

    const handleClickTab = (event: React.MouseEvent<HTMLElement>, index:number) => {
        const e = event
        e.preventDefault()
        setCategoryIndex(index)
    }

    const loadContent = useCallback(async () => {
        await Service.home.page()
            .then((response) => {
                const data = response.data
                setTimeout(() => {
                    setCategories(data.categories)
                    setProducts(data.products)
                    setTopSellings(data.topSellings)
                    setBestSellers(data.bestSellers)
                    setLoading(false)
                }, 1500)
            })
            .catch(() => {
                setLoading(false)
            })
    
    }, [loading, categories, products, topSellings, bestSellers])

    const loadOrder = () => {
        onloadOrder();
    }

    useEffect(() => {
        loadContent()
    }, [])

    return (
        <Fragment>
            <main className="flex-shrink-0">
                <Container>
                    { loading ? <>
                        <Row className='mt-5'>
                            <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={250} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={250} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={250} />
                            </Col>
                        </Row>
                    </> : <>
                        <Row className='mt-5'>
                            { categories.map((category, index)=> {
                                return (
                                    <Col key={index} md={4}>
                                        <div className="shop">
                                            <div className="shop-img">
                                                <img src={(category as { image: string }).image} alt="" />
                                            </div>
                                            <div className="shop-body">
                                                <h3 className='d-block'>{(category as { name: string }).name}</h3>
                                                <h3 className='d-block'> Collection</h3>
                                                <NavLink className="cta-btn" to={`store/${(category as { id: number }).id}`}>
                                                    Shop now <ArrowRightCircle className='me-1 mb-1' size={17} />
                                                </NavLink>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            }) }
                        </Row>
                    </> }
                </Container>
            </main>
            <main className="flex-shrink-0" id="products">
                <div className="container p-3">
                    <div className="row">
                        <div className={ loading ? 'd-none' : 'col-md-12 mb-2'}>
                            <div className="section-title">
                                <h3 className="title">New Products</h3>
                                <div className="section-nav">
                                    <ul className="section-tab-nav tab-nav">
                                        <li className={categoryIndex === 0 ? 'active' : ''}><a onClick={(e)=> handleClickTab(e, 0)} data-toggle="tab" href="#" className='text-decoration-none'>Laptops</a></li>
                                        <li className={categoryIndex === 1 ? 'active' : ''}><a onClick={(e)=> handleClickTab(e, 1)}  data-toggle="tab" href="#" className='text-decoration-none'>Smartphones</a></li>
                                        <li className={categoryIndex === 2 ? 'active' : ''}><a onClick={(e)=> handleClickTab(e, 2)}  data-toggle="tab" href="#" className='text-decoration-none'>Cameras</a></li>
                                        <li className={categoryIndex === 3 ? 'active' : ''}><a onClick={(e)=> handleClickTab(e, 3)}  data-toggle="tab" href="#" className='text-decoration-none'>Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        { loading ? <>
                            <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                        </> : <>
                            <div className="col-md-12">
                                <SliderComponent products={products} loadOrder={loadOrder} />
                            </div>
                        </> }
                    </div>
                </div>
            </main>
            { loading ? <>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Shimmer width={1} className="w-100 border rounded" height={250} />
                        </div>
                    </div>
                </div>
            </> : <>
                <main className="flex-shrink-0 border" id="hot-deal">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="hot-deal">
                                    <ul className="hot-deal-countdown">
                                        <li>
                                            <div>
                                                <h3>02</h3>
                                                <span>Days</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <h3>10</h3>
                                                <span>Hours</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <h3>34</h3>
                                                <span>Mins</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <h3>60</h3>
                                                <span>Secs</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <h2 className="text-uppercase">hot deal this week</h2>
                                    <p>New Collection Up to 50% OFF</p>
                                    <NavLink className="bg-primary btn w-25 mt-1 text-white" to={`/shop`}>
                                       <i className="bi bi-cart 'mb-1 me-1"></i>Shop now
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </> }
            <main className="flex-shrink-0" id="top-selling">
                <div className="container p-3">
                    <div className="row">
                        <div className={ loading ? 'd-none' : 'col-md-12 mb-2'}>
                            <div className="section-title">
                                <h3 className="title">Top Selling</h3>
                                <div className="section-nav">
                                    <ul className="section-tab-nav tab-nav">
                                        <li><a data-toggle="tab" href="#tab2" className='text-decoration-none'>Laptops</a></li>
                                        <li className="active"><a data-toggle="tab" href="#" className='text-decoration-none'>Smartphones</a></li>
                                        <li><a data-toggle="tab" href="#" className='text-decoration-none'>Cameras</a></li>
                                        <li><a data-toggle="tab" href="#" className='text-decoration-none'>Accessories</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        { loading ? <>
                            <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                        </> : <>
                            <div className="col-md-12">
                                <SliderComponent products={topSellings} loadOrder={loadOrder}  />
                            </div>
                        </> }
                    </div>
                </div>
            </main>
            <main className="flex-shrink-0 mt-5 mb-4" id="best-seller">
                <div className="container p-3">
                    <div className="row">
                        { loading ? <>
                            <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                             <Col md={4}>
                                <Shimmer width={1} className="w-100 border rounded" height={500} />
                            </Col>
                        </> : <>
                            <div className="col-md-4">
                                <div className="section-title text-center">
                                    <h5 className="title">Best Seller</h5>
                                </div>
                                <div className="slider-container">
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="section-title text-center">
                                    <h5 className="title">Best Seller</h5>
                                </div>
                                <div className="slider-container">
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="section-title text-center">
                                    <h5 className="title">Best Seller</h5>
                                </div>
                                <div className="slider-container">
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                    <BestSellerComponent products={bestSellers} />
                                </div>
                            </div>
                        </> }
                    </div>
                </div>
            </main>
        </Fragment>
    )
}

export default HomePage