import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import HeaderComponent, {HeaderRef} from "./components/HeaderComponent";
import NavbarComponent from "./components/NavbarComponent";
import NewsletterComponent from "./components/NewsletterComponent";
import FooterComponent from "./components/FooterComponent";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmPage from "./pages/ConfirmPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import PasswordPage from "./pages/PasswordPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StorePage from "./pages/StorePage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderListPage from "./pages/OrderListPage";
import { Route, HashRouter, Routes } from "react-router";
import Service from "./Service";
import './App.css'


const App = () => {

  const headerRef = useRef<HeaderRef>(null);
  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [offset, setOffset] = useState(0);
  const [categories, setCategories] = useState(Array<unknown>);
  const [setting, setSetting] = useState({})

  const toTop = (event: React.MouseEvent<HTMLElement>) => {
    const e = event
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    e.nativeEvent.stopImmediatePropagation();
  }

  const loadContent = useCallback(async () => {
      await Service.ping()
          .then(async () => {

              const component = await Service.home.component()
              setCategories(component.data.categories)
              setSetting(component.data.setting)
            
              setTimeout(() => {
                  setLoading(false)
                  setConnected(true)
              }, 1500)
          })
          .catch(() => {
              setLoading(false)
              setConnected(false)
          })

  }, [loading, connected, categories, setting])

  const auth = async () => {
    if (logged) {
      await Service.profile.detail()
        .catch((error) => {
          if (error.status === 401) {
            if (localStorage.getItem('auth_token')) {
              localStorage.removeItem('auth_token')
            }
            if (localStorage.getItem('auth_user')) {
              localStorage.removeItem('auth_user')
            }
          }
        })
    }
  }

  const onloadOrder = () => {
     headerRef.current?.loadOrder()
  }


  useEffect(() => {

    const onScroll = () => setOffset(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });

    auth()
    loadContent()

    return () => window.removeEventListener('scroll', onScroll);

  }, [])

  return (
    <Fragment>
      {loading ? <>
        <main className="flex-shrink-0 p-3 mb-5">
          <div className="container loader-section">
            <div className="row">
              <div className="col-md-5 mx-auto" style={{ marginTop: '12rem' }}>
                <DotLottieReact src="/animations/loader.json" loop autoplay />
              </div>
            </div>
          </div>
        </main>
      </> : <>
        {!connected ? <>
          <main className="flex-shrink-0 p-3 mb-5 error-section">
            <div className="d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display fw-bold text-muted text-error-code"><i className="bi bi-wifi-off"></i></h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Disconnected from server</p>
                <div className="lead">
                  Sorry, An Http error has occurred. Please close the client and try again.
                </div>
              </div>
            </div>
          </main>
        </> : <>
          {connected ? <>

            <HashRouter>
              <HeaderComponent categories={categories} ref={headerRef} />
              <NavbarComponent categories={categories} />
              <Routes>
                <Route path="/" element={<HomePage onloadOrder={onloadOrder} />} />
                <Route path="/cart/:id" element={<CartPage onloadOrder={onloadOrder}  />} />
                <Route path="/checkout" element={<CheckoutPage onloadOrder={onloadOrder} />} />
                <Route path="/auth/register/confirm/:token" element={<ConfirmPage />} />
                <Route path="/auth/email/forgot" element={<ForgotPasswordPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/account/password" element={<PasswordPage />} />
                <Route path="/account/profile" element={<ProfilePage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/email/reset/:token" element={<ResetPasswordPage />} />
                <Route path="/store/:category" element={<StorePage />} />
                <Route path="/shop" element={<StorePage />} />
                <Route path="/order/list" element={<OrderListPage onloadOrder={onloadOrder} />} />
                <Route path="/order/detail/:id" element={<OrderDetailPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
              <NewsletterComponent />
              <FooterComponent categories={categories} setting={setting} />
              {offset > 300 ? <>
                <a href="#" onClick={(e) => toTop(e)} className="btn btn-lg btn-primary back-to-top">
                  <i className="bi bi-chevron-up"></i>
                </a>
              </> : <></>}
            </HashRouter>

          </> : <></>}
        </>}
      </>}
    </Fragment >
  )

}

export default App