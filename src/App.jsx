import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./pages/Principal";
import 'font-awesome/css/font-awesome.min.css';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Principal />} />
        </Routes>
    );
}

export default App;
