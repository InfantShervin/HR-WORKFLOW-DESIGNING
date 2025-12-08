import React, { useEffect } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { Toaster } from 'react-hot-toast';
import './App.css';


function App() {
  useEffect(() => {
    // Log app startup
    console.log('🚀 HR Workflow Designer initialized');
  }, []);


  return (
    <div className="w-full h-screen">
      <MainLayout />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
  );
}


export default App;