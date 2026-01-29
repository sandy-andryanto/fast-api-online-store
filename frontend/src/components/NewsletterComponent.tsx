import { Fragment } from "react/jsx-runtime"
import { useState, useEffect } from "react";
import Service from "../Service";

const NewsletterComponent = () => {

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState('')
   const [email, setEmail] = useState('')
   const [valid, setValid] = useState(false)

   useEffect(() => {
    const timeout = setTimeout(() => {
      setEmail(email);
    }, 500); 
    return () => clearTimeout(timeout); 
  }, [email]);

   const submit = async (event: React.MouseEvent<HTMLElement>) => {
        const e = event
        e.preventDefault()
        setLoading(true)
        setSuccess('')
        await Service.home
            .newsletter({ email: email })
            .then((result) => {
                setTimeout(() => { 
                    setSuccess(result.data.message)
                    setLoading(false)
                    setEmail('')
                }, 1500)
            })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    }

   return (
     <Fragment>
        <main className="flex-shrink-0 p-5 mt-auto" id="newsletter">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <div className="newsletter text-center">
                            <p>Sign Up for the <strong>NEWSLETTER</strong></p>
                            { success ? <>
                                <div className="alert alert-success text-start">
                                    {success}
                                </div>
                            </> : <></> }
                            <div className="input-group newsletter-input-group">
                                <input type="email" onChange={e => handleEmailChange(e)}  placeholder='Enter Your Email' className="form-control" aria-label=""/>
                                { loading ? <>
                                     <button className={'btn bg-primary btn-primary disabled'} id="button-addon2">
                                        <i className="fas fa-circle-notch fa-spin me-2"></i>Sending Subscriber...
                                    </button>
                                </> : <>
                                     <button onClick={submit} className={email && valid ? 'btn bg-primary btn-primary' : 'btn bg-primary btn-primary disabled'} id="button-addon2">
                                        <i className="bi bi-envelope mb-1 me-1"></i>Subscribe
                                    </button>
                                </> }
                            </div>
                            <div className="clearfix mt-2">
                                <button  className="btn btn-light border me-1">
                                    <i className="bi bi-facebook mb-1"></i>
                                </button>
                                <button className="btn btn-light border me-1">
                                    <i className="bi bi-twitter mb-1"></i>
                                </button>
                                <button  className="btn btn-light border me-1">
                                    <i className="bi bi-instagram mb-1"></i>
                                </button>
                                <button className="btn btn-light border">
                                    <i className="bi bi-pinterest mb-1"></i>
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

export default NewsletterComponent