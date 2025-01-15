import React, { useReducer, useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box, Stack, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { getAccessToken, searchLocations } from "../api/AmadeusApi";
import SearchIcon from "@mui/icons-material/Search";
import { keyframes } from "@mui/system";
import MapIcon from '@mui/icons-material/Map';


//estados iniciales para manejar el status de la busqueda
const initialState = {
  loading: false,
  results: [],
  error: "",
  status: null,
};

//acciones que representan los posibles estados de respuesta de la api
const actionTypes = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  NO_RESULTS: "NO_RESULTS",
};

// Reducer: actualiza el estado se basa en la accion recibida
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return { ...state, loading: true, error: "", results: [], status: null };
    case actionTypes.SUCCESS:
      return { ...state, loading: false, results: action.payload, status: action.status };
    case actionTypes.NO_RESULTS:
      return { ...state, loading: false, error: "No se encontraron resultados.", status: action.status };
    case actionTypes.ERROR:
      return { ...state, loading: false, error: action.payload, status: action.status };
    default:
      return state;
  }
};

//mensajes de error que se imprimen en pantalla
const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case 400:
      return "Petición incorrecta. Verifica los datos ingresados.";
    case 401:
      return "No autorizado. Revisa tus credenciales.";
    case 403:
      return "Acceso prohibido. No tienes permisos para realizar esta acción.";
    case 404:
      return "No se encontraron los datos solicitados.";
    case 429:
      return "Demasiadas solicitudes. Intenta nuevamente más tarde.";
    case 500:
      return "Error interno del servidor. Por favor, inténtalo de nuevo más tarde.";
    default:
      return "";
  }
};

// Animación para el ícono de no resultados
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SearchComponent = ({ searchText }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [openModal, setOpenModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleCardClick = (location) => {
    setSelectedLocation(location); 
    setOpenModal(true); 
    };

    const handleCloseModal = () => {
    setOpenModal(false); 
    };

    {/* Llamadas a la api */}
    useEffect(() => {
        if (!searchText) return;

        const handleSearch = async () => {
            dispatch({ type: actionTypes.LOADING });

            try {
                const token = await getAccessToken("0ZG6h7Gf4Lrhnva1fgGlO4v4GtW0REy2", "2ACHigG409qJVpVl");
                const response = await searchLocations(token, searchText);
                if (response.data.length === 0) {
                dispatch({ type: actionTypes.NO_RESULTS, status: response.status });
                } else {
                dispatch({ type: actionTypes.SUCCESS, payload: response.data, status: response.status });
                }
            } catch (error) {
                console.error("Error capturado:", error.message);
                dispatch({
                type: actionTypes.ERROR,
                payload: error.message,
                status: error.message,
                });
            }
        };
        handleSearch();
    }, [searchText]);

  return (
    <Box p={4}>
      <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">Resultados de la Búsqueda</h1>

      {/* Mostramos un icono de carga post consulta*/}
      {state.loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <CircularProgress
            sx={{
                color: "#BF3617", 
              }}
              size={80} 
              thickness={3} 
            />
        </Box>
      )}
      
      {/* imprime el resultado de la consulta (no necesario para los usuarios) */}
      {state.status && (
        <Typography variant="subtitle1" color="textSecondary">
          Estado de la consulta: {state.status}
        </Typography>
      )}

       {/* Manejamos los mensajes de estado de error de la api */}
      {state.error && (
        <Typography color="error" variant="h6" mt={2}>
          {getErrorMessage(Number(state.status))}
        </Typography>
      )}

      {/* Mostrar un ícono si no hay resultados */}
      {state.status === 200 && state.results.length === 0 && (
        <Box className="sm:pt-[100px] pt-[30px]" textAlign="center" mt={4}>
          <SearchIcon
            sx={{
              fontSize: 50,
              animation: `${rotate} 2s linear infinite`, 
            }}
          />
          <Typography variant="h6" mt={2}>No se encontraron resultados.</Typography>
        </Box>
      )}

        {/* Mostrar las cards de resultados a la busqueda */}
        <Box mt={2}>
        {state.results.length > 0 && (
            <Stack spacing={2}>
            {state.results.map((location, index) => (
                <Card key={index} onClick={() => handleCardClick(location)} sx={{ cursor: "pointer" }}>
                <CardContent>
                    <Typography variant="h6">{location.name}</Typography>
                    <Typography variant="body2">{location.detailedName || "Sin detalles"}</Typography>
                </CardContent>
                </Card>
            ))}
            </Stack>
        )}
        </Box>
        
        {/* Mostrar el modal */}
        <Dialog className="bg-[#000000]/60" open={openModal} onClose={handleCloseModal}>
            <DialogContent className="bg-white border-[3px] border-[#F2C53D]">
                {selectedLocation ? (
                <>  
                    <Typography sx={{ fontSize: "24px", textAlign: "center", color: "#BF3617" }} variant="body1">
                        <strong>{selectedLocation.name}</strong>
                    </Typography>

                    <Typography variant="body1" mt={2}>
                    <strong>Datos:</strong>
                    </Typography>

                    <Typography variant="body1">
                        <span className="text-[#30618C]">Tipo:</span> 
                        <span > {selectedLocation.subType}</span>
                    </Typography>
                    <Typography variant="body1">
                        <span className="text-[#30618C]">Código IATA: </span> 
                        <span > {selectedLocation.iataCode}</span>
                    </Typography>
                    <Typography variant="body1">
                        <span className="text-[#30618C]">Zona Horaria: </span> 
                        <span >{selectedLocation.timeZoneOffset}</span>
                    </Typography>
                    <Typography variant="body1">
                        <span className="text-[#30618C]">Nombre Detallado: </span> 
                        <span >{selectedLocation.detailedName}</span>
                    </Typography>

                    <Typography variant="body1" mt={2}>
                    <strong>Dirección:</strong>
                    </Typography>
                    <Typography variant="body1">
                        <span className="text-[#30618C]">Ciudad: </span> 
                        <span>{selectedLocation.address.cityName}</span>
                    </Typography>

                    <Typography variant="body1">
                        <span className="text-[#30618C]">Código Ciudad: </span> 
                        <span>{selectedLocation.address.cityCode}</span>
                    </Typography>

                    <Typography variant="body1">
                        <span className="text-[#30618C]">País: </span> 
                        <span>{selectedLocation.address.countryName}</span>
                    </Typography>

                    <Typography variant="body1">
                        <span className="text-[#30618C]">Código País: </span> 
                        <span>{selectedLocation.address.countryCode}</span>
                    </Typography>

                    <Typography variant="body1">
                        <span className="text-[#30618C]">Región: </span> 
                        <span>{selectedLocation.address.regionCode}</span>
                    </Typography>


                    <Typography variant="body1" mt={2}>
                    <strong>Ubicación en el mapa:</strong>
                    </Typography>
                    <Typography variant="body2" className="flex items-center">
                        <MapIcon className="mr-1 text-[#30618C]" />
                        <a
                            href={`https://www.google.com/maps?q=${selectedLocation.geoCode.latitude},${selectedLocation.geoCode.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                        >
                            Ver en Google Maps
                        </a>
                    </Typography>
                </>
                ) : (
                <CircularProgress />
                )}
            </DialogContent>
            </Dialog>
    </Box>
  );
};

export default SearchComponent;
