import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import logo from '../Navigation/airbnb-favicon.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // const sessionLinks = sessionUser ?
  //   (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   ) : (
  //     <>
  //       <li>
  //         <OpenModalButton
  //           buttonText="Log In"
  //           modalComponent={<LoginFormModal />}
  //         />
  //         {/* <NavLink to="/login">Log In</NavLink> */}
  //       </li>
  //       <li>
  //         <OpenModalButton
  //           buttonText="Sign Up"
  //           modalComponent={<SignupFormModal />}
  //         />
  //         {/* <NavLink to="/signup">Sign Up</NavLink> */}
  //       </li>
  //     </>
  //   );

  return (
    <header className='header-container'>
      <NavLink to='/' className='home-link'>
        <div className='header-left'>
          <img className='logo' src={logo}></img>
          <h2 className='page-title'>Airbnbnb</h2>
        </div>
      </NavLink>
      <div className='header-right'>
        {sessionUser && (
          <span>
            <NavLink to="/spots/new" className='create-link'>Create a New Spot</NavLink>
          </span>
        )}
        {isLoaded && (
          <span>
            <ProfileButton user={sessionUser} />
          </span>
        )}
      </div>
    </header>
  );
}

export default Navigation;
