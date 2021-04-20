import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { css } from '@emotion/primitives';
import { ErrorBoundary } from '../../elements/errorBoundary';
import { RootRoutes } from './RootRoutes';
import 'bootstrap/scss/bootstrap.scss';
import { IconLogo } from '../../elements/icons';
import './appLayout.css';

export const AppLayout = () => {

  return <div className="AppLayout">
    <header>
      <Navbar className="navbar-shadow">
        <Container className="flex-column flex-sm-row justify-content-between align-content-center">
          <div className="navbar-header align-self-center">
            <NavbarBrand href="/" className="mr-auto" style={ css`
              white-space: inherit;
              color: var(--black);
              font-size: 2rem;
              font-weight: 600;` }><IconLogo /> <span style={ css`vertical-align: inherit;` }>FTGO</span></NavbarBrand>
          </div>
          <Nav>
            <NavItem>
              <NavLink pathname="/">Address</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled pathname="/">Restaurant</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled pathname="/">Dish</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled pathname="/">Order</NavLink>
            </NavItem>
          </Nav>
          <div className="align-self-center">UserButton <br /> (Logged in)</div>
        </Container>

      </Navbar>
    </header>

    <div className="p-2" />
    <Container>
      <ErrorBoundary>
        <RootRoutes />
      </ErrorBoundary>
    </Container>
  </div>;
};
