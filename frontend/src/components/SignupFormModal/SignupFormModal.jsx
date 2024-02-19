import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({})
  const { closeModal } = useModal();

  useEffect(() => {
    const validationsObj = {}

    if (!firstName) {
      validationsObj.firstName = 'First Name is required.'
    }

    if (!lastName) {
      validationsObj.lastName = 'Last Name is required.'
    }

    if (!email) {
      validationsObj.email = 'Please provide a valid email.'
    }

    if (String(username).length < 4) {
      validationsObj.username = 'Please provide a username with at least 4 characters.'
    }

    if (String(password).length < 6) {
      validationsObj.password = 'Password must be 6 characters or more.'
    }

    if (!confirmPassword) {
      validationsObj.password = 'Password confirmation is required.'
    }

    setValidations(validationsObj)

  }, [firstName, lastName, email, username, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          firstName,
          lastName,
          email,
          username,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }

    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='signup-form'>
      <h2 className='signup-header'>Sign Up</h2>
      <form className='signup-form-container' onSubmit={handleSubmit}>

        {errors.firstName && <p className='signup-error-message'>{errors.firstName}</p>}
        {errors.lastName && <p className='signup-error-message'>{errors.lastName}</p>}
        {errors.email && <p className='signup-error-message'>{errors.email}</p>}
        {errors.username && <p className='signup-error-message'>{errors.username}</p>}
        {errors.password && <p className='signup-error-message'>{errors.password}</p>}
        {errors.confirmPassword && <p className='signup-error-message'>{errors.confirmPassword}</p>}

        <label className='label signup-input-box'>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        <label className='label signup-input-box'>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label className='label signup-input-box'>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className='label signup-input-box'>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={4}
            required
          />
        </label>

        <label className='label signup-input-box'>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        <label className='label signup-input-box'>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <div className='signup-button-div'>
          <button className='signup-button' type="submit" disabled={Object.values(validations).length}>Sign Up</button>
        </div>
      </form>
    </div>
  )
}

export default SignupFormModal;
