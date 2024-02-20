import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import GetAllSpots from './components/GetAllSpots/GetAllSpots';
import CurrentSpots from './components/CurrentSpot/CurrentSpot';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import UpdateSpot from './components/UpdateSpot/UpdateSpot';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <GetAllSpots />
      },
      {
        path: '/spots/current',
        element: <CurrentSpots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '*',
        element: <h2>Page Not Found</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
