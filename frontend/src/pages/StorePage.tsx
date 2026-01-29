import { Fragment, useState, useEffect, useCallback } from 'react';
import { Row, Col, Container} from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-range-slider-input';
import { NumericFormat } from 'react-number-format';
import { StarFill, Star, Search, CartPlus } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Shimmer } from "react-shimmer";
import { NavLink } from "react-router-dom";
import { PagingComponent } from '../components/PagingComponent';
import { useSearchParams } from 'react-router-dom';
import Service from '../Service';

const StorePage = () => {

  const [categories, setCategories] = useState(Array<unknown>);
  const [categorySelected, setCategorySelected] =  useState<string[]>([]);
  const [brands, setBrands] = useState(Array<unknown>);
  const [brandSelected, setBrandSelected] = useState<string[]>([]);
  const [tops, setTops] = useState(Array<unknown>);
  const [products, setProducts] = useState(Array<unknown>);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalFilter, setTotalFilter] = useState(0);
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [orderSelected, setOrderSelected] = useState('id|desc')
  const [order, setOrder] = useState('id');
  const [sort, setSort] = useState('desc');
  const [search, setSearch] = useState('');
  const [typingValue, setTypingValue] = useState('');
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPriceOriginal, setMaxPriceOriginal] = useState(0);
  const [, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null


  const updateQuery = (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams);
  };

  const loadSidebar = useCallback(async () => {
        setLoadingSidebar(true)
        await Service.store.filter()
          .then((result) => {
            const data = result.data
            setTimeout(() => { 
                setCategories(data.categories)
                setBrands(data.brands)
                setTops(data.tops)
                setLoadingSidebar(false)
                setMinPrice(0)
                setMaxPriceOriginal(parseFloat(data.maxPrice))
                setMaxPrice(parseFloat(data.maxPrice))
                setPriceRange([0, parseFloat(data.maxPrice)])
            }, 2000)
          })
          .catch((error) => {
            console.log(error)
          })
    
    }, [])

  const loadProduct = useCallback(async () => {

      let filter: { [key: string]: string } = {}

    

      filter = {
        limit: String(limit),
        page: String(page),
        order: order,
        dir: sort,
        search: search
      };

      if(maxPrice > 0){
         filter = {
           ...filter,
           priceMin: String(minPrice),
           priceMax: String(maxPrice)
         }
      }

      if(categorySelected.length > 0){
         filter = {
           ...filter,
           category: categorySelected.join(",")
         }
      }

     

       if(brandSelected.length > 0){
         filter = {
           ...filter,
           brand: brandSelected.join(",")
         }
      }

      
      

      updateQuery(filter)
      const queryString = new URLSearchParams(filter).toString();

      setTimeout(async () => { 
         setLoadingProduct(true)
          await Service.store.list(queryString)
          .then((result) => {
            const data = result.data
            setTimeout(() => { 
                setProducts(data.list)
                setTotalProduct(parseInt(data.total_all))
                setTotalFilter(parseInt(data.total_filtered))
                setLimit(parseInt(data.limit))
                setLoadingProduct(false)
                setOrder(data.order)
                setSort(data.sort)
            }, 1500)
          })
          .catch((error) => {
            console.log(error)
          })
      })


    }, [
      products, 
      search, 
      totalProduct, 
      totalFilter, 
      limit, 
      loadingProduct,
      order, 
      sort, 
      orderSelected,
      priceRange,
      categorySelected,
      brandSelected,
      minPrice,
      maxPrice,
      maxPriceOriginal
    ])


    const handlePrice = (input: [number, number]) => {
      const max = maxPriceOriginal
      setMinPrice(Math.round(max * (input[0] / 100)))
      setMaxPrice(Math.round(max * (input[1] / 100)))
    }

    const handleCheckedCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const checked = e.target.checked;

      setCategorySelected(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    }

    const handleCheckedBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const checked = e.target.checked;

      setBrandSelected(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    }

    const handleOrderSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value){
           const selected = (e.target.value).split("|")
           setOrderSelected(e.target.value)
           setOrder(selected[0])
           setSort(selected[1])
        }
    } 

    const handleLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
    } 

    useEffect(() => {
      const timeout = setTimeout(() => {
        setSearch(typingValue);
      }, 500);

      return () => clearTimeout(timeout); 
    }, [typingValue]);

    useEffect(() => {
      loadSidebar();
    }, []); 

   useEffect(() => {
      loadProduct(); 
    }, [page]);


  return (
    <Fragment>
      <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
        <Container>
          <Row>
            <Col md={12}>
              <Breadcrumb className='mt-2'>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Store</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </main>
      <main className="flex-shrink-0 mb-4">
        <Container>
          <Row>
            <Col md={3}>
              <h4 className='text-uppercase mb-4'>Categories</h4>

              { loadingSidebar ? <>
                 <Shimmer width={1} className="w-100 border rounded mb-4" height={250} />
              </> : <>
                { categories.map((category, index) => {
                    return (
                       <Fragment key={index}>
                           <Form.Check
                              className='mb-3' 
                              type={'checkbox'} 
                              onChange={handleCheckedCategory}
                              checked={categorySelected.includes(String((category as { id: number }).id))} 
                              value={`${(category as { id: string }).id}`} 
                              label={`${(category as { name: string }).name} (${(category as { total: number }).total})`}
                           />
                       </Fragment>
                    )
                }) }
              </> }

            

              <h4 className='text-uppercase mb-4'>Price</h4>
              { loadingSidebar ? <>
                <Shimmer width={1} className="w-100 border rounded mb-4" height={250} />
              </> : <>
                <RangeSlider defaultValue={priceRange} onInput={(e) => handlePrice(e)} />
                <Form.Group className="mb-3 mt-4">
                  <Form.Label className='fw-bold text-success'>Minimum Price ($)</Form.Label>
                  <NumericFormat value={minPrice} decimalScale={2} readOnly={true} className='form-control text-end fw-bold' thousandSeparator="," />
                </Form.Group>
                <Form.Group className="mb-3 mt-4">
                  <Form.Label className='fw-bold text-danger'>Maximum Price ($)</Form.Label>
                  <NumericFormat value={maxPrice} decimalScale={2} readOnly={true} className='form-control text-end fw-bold' thousandSeparator="," />
                </Form.Group>
              </> }

              <h4 className='text-uppercase mt-4 mb-4'>Brands</h4>
              { loadingSidebar ? <>
                <Shimmer width={1} className="w-100 border rounded mb-4" height={250} />
              </> : <>
               { brands.map((brand, index) => {
                    return (
                       <Fragment key={index}>
                             <Form.Check
                                className='mb-3' 
                                type={'checkbox'} 
                                onChange={handleCheckedBrand}
                                checked={brandSelected.includes(String((brand as { id: number }).id))} 
                                value={`${(brand as { id: string }).id}`} 
                                label={`${(brand as { name: string }).name} (${(brand as { total: number }).total})`}
                            />
                       </Fragment>
                    )
                }) }
                <Button onClick={loadProduct} className='btn btn-primary btn-sm mt-2 w-100'>
                    <i className="fas fa-filter me-2"></i>Apply Filter
                </Button>
              </> }

              <h4 className='text-uppercase mt-4 mb-4'>Top Selling</h4>

              { loadingSidebar ? <>
                  <Shimmer width={1} className="w-100 border rounded mb-2" height={142} />
                  <Shimmer width={1} className="w-100 border rounded mb-2" height={142} />
              </> : <>
                  { tops.map((product, index) => {
                      return (
                        <div className='card border-0 mb-2' key={index}>
                          <div className='card-body clearfix'>
                            <div className='float-start'>
                              <img src={(product as { image: string }).image} className='img img-responsive text-center' width={100} alt='' />
                            </div>
                            <div className='float-start px-3'>
                              <small className='text-primary d-block'>{(product as { category: string }).category}</small>
                              <small className="fw-bolder d-block">{(product as { name: string }).name}</small>
                              <small className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</small><del><small className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</small></del>
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
                  }) }
              </> }

            </Col>
            <Col md={9}>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className='fw-bold'>Sort By</Form.Label>
                      <Form.Select value={orderSelected} onChange={handleOrderSelected}>
                        <option value={'id|desc'}>Newest</option>
                        <option value={'publishedAt|desc'}>Released Date</option>
                        <option value={'total_rating|desc'}>Rating</option>
                        <option value={'price|asc'}>Lowest Price</option>
                        <option value={'price|desc'}>Highest Price</option>
                      </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className='fw-bold'>Show</Form.Label>
                    <Form.Select value={limit} onChange={handleLimit}>
                      <option value={9}>9 Products</option>
                      <option value={12}>12 Products</option>
                      <option value={30}>30 Products</option>
                      <option value={90}>90 Products</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className='fw-bold'>Search</Form.Label>
                    <InputGroup>
                      <Form.Control placeholder='Search here..' value={typingValue} onChange={(e) => setTypingValue(e.target.value)}  />
                      <Button onClick={loadProduct} variant="bg-dark btn-primary">
                        <Search className='mb-1 me-1' />Search
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mt-4'>
                  { loadingProduct ? <>
                      {Array.from({ length: 9 }, (_, i) => (
                          <Col md={4} xs={6} key={i} className='mb-3'>
                              <Shimmer width={1} className="w-100 border rounded" height={400} />
                          </Col>
                      ))}
                  </> : <>
                      { products.map((product, index) => {
                          return (
                            <Col md={4} xs={6} key={index} className='mb-3'>
                              <div className='card'>
                                <img src={(product as { image: string }).image}  className='card-img-top' alt='' />
                                <div className='card-body p-4'>
                                  <h5 className='text-primary'>{(product as { category: string }).category}</h5>
                                  <h6 className="fw-bolder">{(product as { name: string }).name}</h6>
                                  <strong className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</strong><del><strong className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</strong></del>
                                  <div className="d-flex small text-warning">
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
                                { logged ? <>
                                
                                <div className="card-footer bg-transparent text-center border-top-0">
                                  <NavLink className="btn btn-primary text-white w-100" to={`/cart/${(product as { id: number }).id}`}>
                                    <CartPlus className='mb-1 me-1' />Add To Cart
                                  </NavLink>
                                </div>
                                
                                </> : <></> }
                                
                              </div>
                            </Col>
                          )
                      }) }
                  </> }
              </Row>
              <Row className='mt-5'>
                  <Col md={6}>
                    <PagingComponent
                      total_filtered={totalFilter}
                      limit={limit}
                      page={page}
                      list={products}
                      onPageChange={(newPage) => {
                        setPage(newPage)
                        loadProduct()
                      }}
                    />
                  </Col>
                  <Col md={6} className='text-end'>
                    <small className='text-muted mt-2'>Showing {limit}-{totalProduct} products</small>
                  </Col>
                </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </Fragment>
  )
}

export default StorePage