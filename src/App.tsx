import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Navigation from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Item from "./pages/Item";
import Category from "./pages/Category";
import AmountType from "./pages/AmountType";


function App() {
  return (
    <div>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item" element={<Item />} />
          <Route path="/category" element={<Category />} />
          <Route path="/amounttype" element={<AmountType />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
