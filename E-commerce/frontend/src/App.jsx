import { BrowserRouter, createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import './App.css'
import Navbar from './Components/Navbar';
import Shop from './pages/Shop';
import Hero from './Components/Hero';
import Popular from './Components/Popular';
import Offers from './Components/Offers';
import Collections from './Components/Collections';
import NewsLetter from './Components/NewsLetter';
import Footer from './Components/Footer';
import AppLayout from './AppLayout';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Seller from './pages/Seller';
import men_banner from './assets/banner_mens.png'
import kid_banner from './assets/banner_kids.png'
import women_banner from './assets/banner_women.png'
import GoogleSuccess from './pages/GoogleSuccess';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import OffersPage from './pages/OffersPage';
import PlaceOrder from './pages/PlaceOrder';
const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: '/',
          element: <Shop  />,
        },
        {
          path: '/collections',
          element: <ShopCategory category="all" />,
        },
        {
          path: '/product',
          element: <Product/>,
        },
        {
          path: '/product/:category/:id',
          element: <Product/>,
        },
        {
          path: '/cart',
          element: <Cart/>,
        },
        {
          path: '/place-order',
          element: <PlaceOrder/>,
        },
        {
          path: '/login',
          element: <Login/>,
        },
        {
          path: '/google-success',
          element: <GoogleSuccess/>,
        },
        {
          path: '/seller',
          element: <Seller/>,
        },
        {
          path: '/contact',
          element: <Contact/>,
        },
        {
          path: '/orders',
          element: <Orders/>,
        },
        {
          path: '/offers',
          element: <OffersPage/>,
        },
        {
          path: '*',
          element: <NotFound />,
        }

      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
