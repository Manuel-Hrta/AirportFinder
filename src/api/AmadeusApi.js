import axios from "axios";

// Obtención del token de acceso
export const getAccessToken = async (clientId, clientSecret) => {
    const tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
    const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
    });

    try {
        const response = await axios.post(tokenUrl, body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },});
        return response.data.access_token; // Retorna el token de acceso
    } catch (error) {
        console.error("Error al obtener el token:", error);
        throw new Error("No se pudo obtener el token de acceso");
    }
};

// Realizar búsqueda de aeropuertos o ciudades
export const searchLocations = async (accessToken, keyword, subType = "AIRPORT", limit = 10) => {
    const locationsUrl = "https://test.api.amadeus.com/v1/reference-data/locations";
  
    try {
        const response = await axios.get(locationsUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            subType,
            keyword,
            "page[limit]": limit,
        },});
  
        return { data: response.data.data, status: response.status }; // Éxito
    } catch (error) {
        if (error.response) {
            console.error(`${error.response.status} - ${error.response.statusText}`);
            // Lanza el error con detalles para el manejador en `handleSearch()`
            throw new Error(`${error.response.status}`);
        } else if (error.request) {
            console.error("Error de solicitud:", error.request);
            throw new Error("No se pudo realizar la solicitud. Por favor intenta de nuevo.");
        } else {
            console.error("Error desconocido:", error.message);
            throw new Error("Ocurrió un error inesperado. Por favor intenta nuevamente.");
        }
    }
  };
  