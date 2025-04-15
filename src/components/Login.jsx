import React, { useEffect, useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [authFailed, setAuthFailed] = useState("");
  // function fo handle auth success
  const handleSuccess = async (credentialResponse) => {
    const authConvert = await JSON.stringify(credentialResponse, null, 2);
    if (authConvert) {
      await localStorage.setItem("isAuthSet", "True");
      navigate("/");
    }
  }
  // function for handle auth failure
  const handleError = () => {
    setAuthFailed("Auth Failed, Please Try Again .....");
  }

  useEffect(() => {
    if (localStorage.getItem("isAuthSet")) {
      navigate("/");
    } 
  }, []);
  return (
    <>
      <div className='d-flex min-vh-100 min-vw-100 justify-content-center align-items-center bg-dark'>
        <div>
          <h2 className='fs-5 mb-3 text-white'>Please Sign in Here</h2>
          <GoogleOAuthProvider clientId='620101497678-fhcq5fn86mqgevvb9avk1u3b8c18d70p.apps.googleusercontent.com'>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </GoogleOAuthProvider>
          <small className='text-danger fw-bold text-center'>{authFailed}</small>
        </div>
      </div>
    </>
  )
}

export default Login
