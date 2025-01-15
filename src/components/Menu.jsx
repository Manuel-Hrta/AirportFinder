import React, { useState, useEffect } from "react";

const Menu = () => {
  return (
    <>
    {/* Opcion para menu en pantallas grandes*/}
    <div className="bg-[#f0f0f0] border-l-[3px] border-r-[3px] border-t-[18px] border-b-[18px] border-[#30618C] w-[300px] h-auto sticky top-0 flex flex-col items-center justify-between hidden sm:flex"
      style={{
        boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.2)"
      }}
    >
      <div className="mt-[10%] flex flex-col items-center justify-center">
        <h1 className="text-[20px] font-bold">Bienvenido Usuario</h1>
        <img src="../../public/air-transport.png" alt="Avion" />
        <h1 className="text-[17px] font-bold">Red de Aeropuertos</h1>
      </div>
      
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-[20px] font-bold mb-[10%]">Vista</h1>
        
        {/* Opción General */}
        <div className="flex items-center mb-2">
          <input type="radio" id="vistaGeneral" name="vista" className="mr-2" defaultChecked />
          <label htmlFor="vistaGeneral" className="text-[#30618C]">General</label>
        </div>
        
        {/* Opción en Mapa 
        <div className="flex items-center">
          <input type="radio" id="vistaMapa" name="vista" className="mr-2" />
          <label htmlFor="vistaMapa" className="text-[#30618C]">en Mapa</label>
        </div>
        */}
      </div>


      <h1 className="text-justify mb-[10%] p-4 font-bold text-[#BF3617]">Conecta con los cielos, encuentra el aeropuerto perfecto para tu viaje.</h1>
    </div>

    {/* Opcion para menu en pantallas pequeñas */}
    <div className="block sm:hidden bg-[#f0f0f0]">
      <div className="bg-[#30618C] m-[5%] h-[50px] rounded-3xl text-white flex flex-row items-center justify-between p-3">
        <img className="h-12 w-12" src="../../public/air-transport.png" alt="Avion" />
        
        {/* para mejoras futuras (visualizacion de las consultas en un mapa) */}
        {/* 
        <select 
          className="bg-[#30618C] text-white rounded-md px-2 py-1"
          defaultValue=""
        >
          <option value="vistaGeneral">Vista General</option>
          <option value="vistaMapa">Vista en Mapa</option>
        </select>  */}
        <div className="h-[100%] text-center justify-center mb-[4px]"><h1 className="text-[20px] font-bold mb-[10%]">Bienvenido Usuario</h1></div>
        

        <img className="h-12 w-12" src="../../public/air-transport.png" alt="Avion" />
      </div>
    </div>

    </>
  );
};

export default Menu;
