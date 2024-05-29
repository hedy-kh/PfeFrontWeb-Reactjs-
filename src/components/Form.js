import React, { useEffect, useState } from 'react';
import './Form.css';
import queryString from "query-string";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = 'http://localhost:8000/api/user';

export default function Form() {
  const location = useLocation();
  const navigate = useNavigate();
  const [invalidUser, setInvalidUser] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  });

  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get(`${url}/verify-token?token=${token}&id=${id}`);
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) {
          setInvalidUser(data.error);
        } else {
          console.log(error.response.data);
        }
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20) {
      return setError('Password must be 8 to 20 characters long!');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
  
    try {
      setBusy(true);
      const { data } = await axios.post(`${url}/reset-password?token=${token}&id=${id}`, { password });
      setBusy(false);
      if (data.success) {
        navigate('/reset-password');
        setSuccess(true);
      }
    } catch (error) {
      setBusy(false); // Add this line
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) {
          setInvalidUser(data.error);
        } else {
          console.log(error.response.data);
        }
      } else {
        console.log(error);
      }
    }
  };
  

  if (success) return (
    <div className="message-wrapper">
      <div className="message success-message">
        <h1>Password reset successfully</h1>
      </div>
    </div>
  );

  if (invalidUser) return (
    <div className="message-wrapper">
      <div className="message error-message">
        <h1>{invalidUser}</h1>
      </div>
    </div>
  );

  if (busy) return (
    <div className="message-wrapper">
      <div className="message busy-message">
        <h1>Wait a moment, verifying reset token...</h1>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1 className="title">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="New Password"
              name="password"
              onChange={handleOnChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="input-field"
              placeholder="Confirm New Password"
              name="confirmPassword"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <input type="submit" value="Reset Password" className="submit-button" />
          </div>
        </form>
      </div>
    </div>
  );
}
