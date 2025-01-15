import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaHistory } from "react-icons/fa"; 
import Observer from "../patterns/Observer";
import searchHistoryInstance from "../patterns/Singleton";

const SearchComponent = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Obtener el historial de búsquedas desde el Singleton
    const [recentSearches, setRecentSearches] = useState(searchHistoryInstance.getHistory());

    const suggestionsRef = useRef(null);
  
    const fetchSuggestions = async (input) => {
        if (input.length > 1) {
            try {
            const response = await fetch(`https://api.datamuse.com/sug?s=${input}`);
            const data = await response.json();
            setSuggestions(data.map(item => item.word));
            setShowSuggestions(true);
            } catch (error) {
            console.error("Error al obtener sugerencias:", error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };
  
    useEffect(() => {
      Observer.subscribe(fetchSuggestions);
    }, []);

    // Maneja el clic fuera del contenedor de sugerencias
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false); // Cierra las sugerencias si se hace clic fuera
            }
        };

        // Agrega el event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Limpia el event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      Observer.notify(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        handleSearch(suggestion); // Pasar la sugerencia seleccionada
    };

    const handleSearch = (searchTerm = query) => {
        const term = String(searchTerm || "").trim(); // Conversión segura a string
        if (term) {
            searchHistoryInstance.addSearch(term);
            setRecentSearches(searchHistoryInstance.getHistory());
            onSearch(term);
            setShowSuggestions(false);
        }
    };
  
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="bg-[#F2C53D] w-[100%] h-[100px] items-center justify-center rounded-2xl" style={{ boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.2)" }}>
            <h1 className="flex items-center justify-center text-center lg:text-3xl md:text-2xl text-[17px] sm:mb-[20px] mb-[10px] pt-[10px] font-bold text-[#000000]">Inicia la Búsqueda del Aeropuero a tu Medida</h1>
            <div className="bg-[#30618C] w-[80%] h-[80px] ml-[10%] sm:pt-[16px] pt-[22px] pl-[10%] pr-[10%] rounded-2xl" style={{ boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.2)" }}>
                <div className="flex rounded-full border-2 border-[#BF3617] overflow-hidden max-w-md mx-auto sm:h-auto h-[60%] font-[sans-serif]">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(query.length === 0)}
                        className="w-full outline-none bg-white text-sm px-5 py-3"
                    />
                    <button 
                        type='button' 
                        onClick={() => handleSearch()} 
                        className="flex items-center justify-center bg-[#BF3617] hover:bg-[#BF3617]/90 sm:px-6 px-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="18px" className="fill-white">
                        <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                        </svg>
                    </button>

                    {/* Lista de sugerencias o historial */}
                    {showSuggestions && (
                    <ul ref={suggestionsRef} className="absolute bg-white border rounded mt-[50px] z-10 lg:w-[25%] sm:w-[40%] w-[50%] lg:text-[17px] sm:text-[13px] text-[10px]">
                        {query === "" && recentSearches.length > 0 ? (
                        recentSearches.map((search, index) => (
                            <li
                            key={index}
                            className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSuggestionClick(search)}
                            >
                            <FaHistory className="text-gray-600" /> {/* Ícono de historial */}
                            {search}
                            </li>
                        ))
                        ) : (
                        suggestions.slice(0, 6).map((suggestion, index) => (
                            <li
                            key={index}
                            className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                            >
                            <FaSearch className="text-gray-600" /> {/* Ícono de lupa */}
                            {suggestion}
                            </li>
                        ))
                        )}
                    </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchComponent;
