import { useCallback, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime"
import Service from "../Service";
import Swal from "sweetalert2";
import { PagingComponent } from "../components/PagingComponent";

interface Props {
  onloadOrder: () => void
}


const OrderListPage = ({ onloadOrder }: Props) => {

    const [orders, setOrders] = useState(Array<unknown>)
    const [loading, setLoading] = useState(true)
    const [, setSearchParams] = useSearchParams()
    const [limit, setLimit] = useState(9)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalFiltered, setTotalFiltered] = useState(0)
    const [order, setOrder] = useState('id')
    const [sort, setSort] = useState('desc')
    const [search, setSearch] = useState('')
    const [typingValue, setTypingValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const loadOrder = () => {
        onloadOrder();
    }
    
    const updateQuery = (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams);
  };

   const loadData = useCallback(async () => {
  
        let filter: { [key: string]: string } = {}

        filter = {
          limit: String(limit),
          page: String(page),
          order: order,
          dir: sort,
          search: search
        };
  
        
        updateQuery(filter)
        const queryString = new URLSearchParams(filter).toString();
  
        setTimeout(async () => { 
           setLoading(true)
            await Service.order.list(queryString)
            .then((result) => {
              const data = result.data
              setTimeout(() => { 
                  setOrders(data.list)
                  setTotal(parseInt(data.total_all))
                  setTotalFiltered(parseInt(data.total_filtered))
                  setLimit(parseInt(data.limit))
                  setLoading(false)
              }, 1500)
            })
            .catch((error) => {
              const message =
                error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                    ? error
                    : 'An unknown error occurred';
                setErrorMessage(message)
            })
        })
  
  
      }, [ orders, search, total, totalFiltered, limit, loading, order, sort ])

    const onApplyFilter = async (event: React.MouseEvent<HTMLElement>) => {
        const e = event
        e.preventDefault();
        loadData(); 
    }

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value);
    };

    const handleOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(e.target.value);
    };

    const handleLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
    };

    const onDelete = async (event: React.MouseEvent<HTMLElement>, id:number) => {

        const e = event
        e.preventDefault();
      
       const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    const res = await Service.order.cancel(id)
                    return res;
                } catch (error) {
                    const message =
                    error instanceof Error
                        ? error.message
                        : typeof error === 'string'
                        ? error
                        : 'An unknown error occurred';
                    setErrorMessage(message)
                    return;
                }
            }
        });
    
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Cancel Success',
                text: 'Your order been successfully canceled.'
            });
            loadData(); 
            loadOrder()
        }

   }

    useEffect(() => {
    const timeout = setTimeout(() => {
        setSearch(typingValue);
    }, 500);

    return () => clearTimeout(timeout); 
    }, [typingValue]);

    useEffect(() => {
      loadData(); 
    }, [page]);

   return (
     <Fragment>
        <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mt-2">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Order</a></li>
                                <li className="breadcrumb-item active" aria-current="page">List</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
        <main className="flex-shrink-0 p-3 mb-5">
            <div className="container">
                 { errorMessage ? <>
                    <div className='alert alert-danger'>
                        <p>{errorMessage}</p>
                    </div>
                </> : <></> }
                <div className="row">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Sort By</label>
                        <select value={order} onChange={handleOrder} className="form-control">
                            <option value="created_at">Order Date</option>
                            <option value="invoice_number">Order Number</option>
                            <option value="total_item">Total Product</option>
                            <option value="total_paid">Total Payment</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Sort Direction</label>
                        <select value={sort} onChange={handleSort} className="form-control">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Limit</label>
                        <select value={limit} onChange={handleLimit} className="form-control">
                            <option disabled value="0">Please Select Item</option>
                            <option value="10">10 Rows</option>
                            <option value="25">25 Rows</option>
                            <option value="50">50 Rows</option>
                            <option value="100">100 Rows</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Search By Keyword</label>
                        <input type="text" value={typingValue} onChange={(e) => setTypingValue(e.target.value)}   placeholder='Search here..' className="form-control" aria-label="Text input with dropdown button" />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12">
                         <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th>Order Date</th>
                                    <th>Order Number</th>
                                    <th className="text-center">Total Item</th>
                                    <th className="text-center">Total Payment</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { loading ? <>
                                     <tr>
                                        <td colSpan={7} className="text-center">
                                            <span><i className="fas fa-circle-notch fa-spin me-2"></i>Loading fetching data....</span>
                                        </td>
                                    </tr>
                                </> : <>
                                    { orders.length === 0 ? <>
                                         <tr>
                                            <td colSpan={7} className="text-center">
                                                <span>No Data Available.</span>
                                            </td>
                                        </tr>
                                    </> : <>
                                        { orders.map((order, index) => {
                                            const num = index + 1
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">{num}</td>
                                                    <td>{(order as { created_at: string }).created_at}</td>
                                                    <td>{(order as { invoice_number: string }).invoice_number}</td>
                                                    <td className="text-center">{(order as { total_item: number }).total_item}</td>
                                                    <td className="text-center">{(order as { total_paid: number }).total_paid.toFixed(2)}</td>
                                                    <td className="text-center">
                                                        { (order as { status: number }).status === 1 ? <>
                                                            <span className="badge bg-success">Completed</span>
                                                        </> : <>
                                                            <span className="badge bg-danger">Draft</span>
                                                        </> }
                                                    </td>
                                                    <td className="text-center">
                                                         { (order as { status: number }).status === 1 ? <>
                                                             <NavLink to={`/order/detail/${(order as { id: number }).id}`} className="btn btn-sm btn-secondary me-1">
                                                                 <i className="fas fa-search"></i>
                                                            </NavLink>
                                                        </> : <>
                                                            <NavLink to={`/order/detail/${(order as { id: number }).id}`} className="btn btn-sm btn-secondary me-1">
                                                                 <i className="fas fa-search"></i>
                                                            </NavLink>
                                                            <button onClick={(e) => onDelete(e, (order as { id: number }).id)} className="btn btn-sm btn-danger">
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </> }
                                                    </td>
                                                </tr>
                                            )
                                        }) }
                                    </> }
                                </> }
                            </tbody>
                         </table>
                         <div className="clearfix">
                            <div className="float-start">
                               <PagingComponent
                                    total_filtered={totalFiltered}
                                    limit={limit}
                                    page={page}
                                    list={orders}
                                    onPageChange={(newPage) => {
                                        setPage(newPage)
                                        loadData()
                                    }}
                                />         
                            </div>
                            <div className="float-end">
                                <button onClick={(e)=> onApplyFilter(e)} className="btn btn-primary">
                                    <i className="fas fa-filter me-1"></i>Apply Filter
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
     </Fragment>
   )
}

export default OrderListPage