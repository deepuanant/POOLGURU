import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/userslice';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/Home/Loadingspinner';

function GoogleAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(addUser(user));
        
        // Show success toast
        toast.success('Google login successful!', {
          duration: 5000,
          position: 'top-center',
        });

        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Login failed. Please try again.', {
          duration: 5000,
          position: 'top-center',
        });
        navigate('/login');
      }
    } else {
      toast.error('Login failed. Please try again.', {
        duration: 5000,
        position: 'top-center',
      });
      navigate('/login');
    }
  }, [navigate, dispatch]);

  return <div className='bg-white'><LoadingSpinner/></div>;
}

export default GoogleAuthCallback;
