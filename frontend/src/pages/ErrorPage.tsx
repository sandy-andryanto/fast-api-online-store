import { Fragment } from "react/jsx-runtime"
import { NavLink } from "react-router-dom"

const ErrorPage = () => {
   return (
     <Fragment>
        <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mt-2">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Page Not Found</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
        <main className="flex-shrink-0 p-3 mb-5">
            <div className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h1 className="display fw-bold text-muted text-error-code">404</h1>
                    <p className="fs-3"> <span className="text-danger">Opps!</span> Page Not Found</p>
                    <div className="lead">
                        Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem.
                    </div>
                    <NavLink className="btn btn-primary w-25 mt-3" to="/">
                        <i className="bi-house me-2"></i>Back To Home
                    </NavLink>
                </div>
            </div>
        </main>
     </Fragment>
   )
}

export default ErrorPage