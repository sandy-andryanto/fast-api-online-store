import { Fragment } from "react/jsx-runtime"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom"

interface Props {
  categories?: Array<unknown>
}

const NavbarComponent = ({ categories }: Props) => {
   return (
     <Fragment>
      <Navbar expand="lg" className="navbar-light border">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className='main-nav'>
                <NavLink className="nav-link" to="/">Home</NavLink>
                <NavLink className="nav-link" to="/shop">Hot Deals</NavLink>
                { categories?.map((category, index) => {
                    return (
                       <Fragment key={index}>
                        <NavLink className="nav-link" to={`store/${(category as { id: number }).id}`}>{(category as { name: string }).name}</NavLink>
                      </Fragment>
                    )
                }) }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
     </Fragment>
   )
}

export default NavbarComponent