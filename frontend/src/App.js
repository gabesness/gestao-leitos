import { React } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import RouteHandler from './utils/RouteHandler';

function App() {
  return (
    <>
     <Navbar />
      <RouteHandler />
      <Footer />
    </>
  );
}

export default App;