import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: '', password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      auth.login(data.token, data.userId);
      // message(data.message);
    } catch (e) {
    }
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      message(data.message);
    } catch (e) {
    }
  }

  return (
    <div className='row'>
      <div className="col s6 offset-s3">
        <h1>Url shortener</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>

            <div>
              <div className="input-field">
                <input
                  placeholder="enter email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="first_name">First Name</label>
              </div>
            </div>

            <div>
              <div className="input-field">
                <input
                  placeholder="enter password"
                  id="password"
                  type="text"
                  name="password"
                  className="yellow-input"
                  onChange={changeHandler}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

          </div>
          <div className="card-action">
            <button className='btn yellow darken-4' onClick={loginHandler} style={{ marginRight: 10 }} disabled={loading}>Join</button>
            <button className='btn green lighten-1' onClick={registerHandler} disabled={loading}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
};