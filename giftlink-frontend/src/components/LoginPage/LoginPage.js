import React, { useState,useEffect } from 'react';
import { urlConfig } from '../../config';
import './LoginPage.css';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('');

    const navigate = useNavigate();
    const bearerToken = localStorage.getItem('bearer-token');
    const {setIsloggedIn} = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('bearer-token')) {
            navigate('/app');
        }
    },[navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${urlConfig.baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : ''
                },

                body: JSON.stringify({
                    email:email,
                    password:password
            })

        })

        const json = await response.json();
        console.log(json);
        if (json.authtoken) {

            ['auth-token', 'name' ,'email'].forEach((key,i) => {
                sessionStorage.setItem(key,json[['authtoken', 'userName','userEmail'][i]])
            })

            setIsloggedIn(true);
            navigate('/app');
        } else {
            ['email','password'].forEach(id => document.getElementById(id).value = '');
            setError("Wrong password or emaail. try again");
            setTimeout(() => setError(''), 3000);
        }

        } catch (error) {
            console.error('Login Error:', error);
            setError('Error logging in. Please try again');


        }


}


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
