import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './components/Form';
function App() {
  return (
<BrowserRouter> 
      <Routes>
      <Route path="/" element={<Form />} />
       <Route path="/reset-password" element={<Form />} /> 
      </Routes>
    </BrowserRouter>  
    );
}

export default App;
