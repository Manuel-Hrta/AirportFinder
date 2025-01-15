import React, { useState } from "react";
import Menu from "../components/Menu";
import Buscador from "../components/Buscador";
import SearchComponent from "../components/SearchComponent";

const Principal = () => {
    const [searchTerm, setSearchTerm] = useState(""); // Estado para almacenar la palabra buscada

    const handleSearch = (term) => {
        setSearchTerm(term); // Actualizar el estado con la palabra buscada
    };

    return (
        <div className="w-screen h-screen flex sm:flex-row flex-col">
        <Menu />
        
        <div 
            className={`w-[100%] h-[100%] overflow-y-scroll p-4 ${
            !searchTerm ? "sm:bg-[url('../../public/Nubes.png')] bg-[url('../../public/nube2.png')] bg-cover" : "bg-[#f0f0f0]"
            }`} 
            style={{ height: "100vh" }}
        >
            <Buscador onSearch={handleSearch} />

            {searchTerm && ( // Mostrar resultados de búsqueda
            <div className="mt-[70px] text-lg text-gray-800">
                <SearchComponent searchText={searchTerm} />
            </div>
            )}
        </div>
        </div>
    );
};

export default Principal;
