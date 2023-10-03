import { logEvent } from 'firebase/analytics';
import React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../firebase';

// In future I possibly want to add a way to log Events?
// Will I have to disable this if they dont want to be tracked?

export default function AnalyticsComponent() {

  const logCurrentPage = () => {
    logEvent(analytics, 'screen_view', { 
      screen_name: window.location.pathname, 
      page_title: document.title 
    });
  }

  const location = useLocation();

  useEffect(()=>{
    logCurrentPage();
  },[location]);

  return (
    <div></div>
  )
}
