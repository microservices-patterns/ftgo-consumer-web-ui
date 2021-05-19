import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import styled from 'styled-components';
import { ErrorBoundary } from '../../elements/errorBoundary';
import { RootRoutes } from './RootRoutes';
import 'bootstrap/scss/bootstrap.scss';
import { IconLogo } from '../../elements/icons';
import './appLayout.css';
import { NavLink as RoutingLink } from 'react-router-dom';
import { routePaths } from '../AppRoutes/routePaths';
import { accessIsLoading } from '../../../features/ui/loadingSlice';
import { useSelector } from 'react-redux';
import { LoadingSpinner } from '../../elements/Loading';
import { Span } from '../../elements/textElements';


const CustomizedNavbarBrand = styled(NavbarBrand)`
  white-space: inherit;
  color: var(--black);
  font-size: 2rem;
  font-weight: 600;
`;

export const AppLayout = () => {

  const isLoading = useSelector(accessIsLoading());

  return <div className="AppLayout">
    <header>
      <div style={ { position: 'relative', width: '100%' } }>{
        isLoading &&
        <div style={ { position: 'absolute', top: '1rem', right: '1rem', width: '2rem', height: '2rem' } }>
          <LoadingSpinner inline /></div>
      }</div>
      <Navbar className="navbar-shadow">
        <Container className="flex-column flex-sm-row justify-content-between align-content-center">
          <div className="navbar-header align-self-center">
            <CustomizedNavbarBrand tag={ RoutingLink } to="/" className="mr-auto"><IconLogo />
              <Span vaMiddle>FTGO</Span></CustomizedNavbarBrand>
          </div>
          <Nav>
            <NavItem>
              <NavLink tag={ RoutingLink } to={ routePaths.landing }>Address</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled tag={ RoutingLink } to={ routePaths.restaurants }>Restaurant</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled tag={ RoutingLink } to="/">Dish</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled tag={ RoutingLink } to="/">Order</NavLink>
            </NavItem>
          </Nav>
          <div className="align-self-center">UserButton <br /> (Logged in)</div>
        </Container>

      </Navbar>
    </header>

    <div className="p-2" />

    <ErrorBoundary>
      <RootRoutes />
    </ErrorBoundary>

  </div>;
};

export default AppLayout;
