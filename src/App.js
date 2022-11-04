import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PlaceholderPage from './Pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PlaceholderPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
