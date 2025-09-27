import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Immediately redirect to dashboard instead of showing a 404 message
  useEffect(() => { navigate('/dashboard'); }, [navigate]);
  return null;
};

export default NotFoundPage;
