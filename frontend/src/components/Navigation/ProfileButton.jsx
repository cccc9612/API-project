import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const manageSpots = (e) => {
    e.preventDefault()
    closeMenu()
    navigate('/spots/current')
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='profile-button' onClick={toggleMenu}>
        <i className="fas fa-bars" />
        <i className="fas fa-user-circle" />
      </button>
      <span className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='user-menu'>
            <span className='user-menu-info'>
              <span className='user-name'>Hello, {user.firstName}</span>
              <span>{user.email}</span>
            </span>
            <span className='user-menu-divide'>
              <button className='manage-spots-button' onClick={manageSpots}>Manage Spots</button>
            </span>
            <span className='user-menu-logout'>
              <button className='logout-button' onClick={logout}>Log Out</button>
            </span>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </span>
    </>
  );
}

export default ProfileButton;
