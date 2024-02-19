import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [validations, setValidations] = useState({})

  useEffect(() => {
    const validationsObj = {}

    if (String(credential).length < 4) {
      validationsObj.credential = 'Please provide a username with at least 4 characters.'
    }

    if (String(password).length < 6) {
      validationsObj.password = 'Password must be 6 characters or more.'
    }

    setValidations(validationsObj)

  }, [credential, password])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
  };

  const demoUserLogin = async (e) => {
    e.preventDefault()

    return await dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
      .then(closeModal)
  }

  return (
    <div className='login-form'>
      <h2 className='login-header'>Log In</h2>
      <form className='login-form-container' onSubmit={handleSubmit}>
        {errors.credential && (
          <p className='error-message'>{errors.credential}</p>
        )}
        <label className='label'>
          Username or Email
          <input
            className='input-text-box'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            minLength={4}
            required
          />
        </label>
        <label className='label'>
          Password
          <input
            className='input-text-box'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <div className='login-button-div'>
          <button className='login-button' type="submit" disabled={Object.values(validations).length}>Log In</button>
        </div>
      </form>
      <button className='demo-user-login' onClick={demoUserLogin}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;
