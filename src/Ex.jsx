import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import axios from 'axios';
import './App.css'


const Ex = () => {
    const { prov, kot, kec, kel, tps } = useParams();

    const location = useLocation();
    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const [apiData, setApiData] = useState([]);

    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [kelurahan, setKelurahan] = useState([]);
  
    const [data, setData] = useState([]);
    // Initialize 'provinsi' state with an empty string, or any default value you prefer
    const [idprovinsi, setIdProvinsi] = useState();
    const [idkota, setIdKota] = useState();
    const [idkecamatan, setIdKecamatan] = useState();
    const [idkelurahan, setIdKelurahan] = useState();
  
    useEffect(() => {
      const fetchDataProv = async () => {
        const response = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        setProvinsi(response.data);
      };

    //   const fetchData = async () => {
    //     const response = await axios.get('https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json');
    //     setData(response.data);
    //     console.log(response.data)

    //   };
      fetchDataProv();
    //   fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            let apiUrl1 = "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp";
            let apiUrl2 = "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp";

            // Append kot and kec to the API URL if they exist
            if (prov){
                apiUrl1 += `/${prov}`;
                apiUrl2 += `/${prov}`;
                if (kot) {
                    apiUrl1 += `/${kot}`;
                    apiUrl2 += `/${kot}`;
                  if (kec) {
                        const trimmedKec = kec.slice(0, -1);

                        apiUrl1 += `/${trimmedKec}`;
                        apiUrl2 += `/${trimmedKec}`;
                        if (kel){
                            apiUrl1 += `/${kel}`;
                            apiUrl2 += `/${kel}`;
                        }
                  }
              }
            }else{
                apiUrl1 += '/0';
            }

            const [api1Response, api2Response] = await Promise.all([
              axios.get(apiUrl1 +=".json"),
              axios.get(apiUrl2 +=".json")
            ]);
    
            const api1Data = api1Response.data;
            const api2Data = api2Response.data.table;
    
            const mergedData = api1Data.map(item => ({
              ...item,
              api2Data: api2Data[item.kode] || {}
            }));
    
            setApiData(mergedData);
            console.log(mergedData)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
        
      }, [idprovinsi, idkota, idkecamatan, idkelurahan]);

    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get('https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json');
        setData(response.data);
      };
      fetchData();
    }, []);
  
    useEffect(() => {
      const fetchDataKota = async () => {
        if (idprovinsi) {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${idprovinsi}.json`);
          setKota(response.data);
        }
      };
      fetchDataKota();
    }, [idprovinsi]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (idkota) {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${idkota}.json`);
          setKecamatan(response.data);
        }
      };
      fetchData();
    }, [idkota]);

    useEffect(() => {
      const fetchData = async () => {
        if (idkecamatan) {
          const response = await axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${idprovinsi}/${idkota}/${idkecamatan}.json`);
          setKelurahan(response.data);
        }
      };
      fetchData();
    }, [idkecamatan]);

    const handleProvChange = (event) => {
        const selectedIdProvinsi = event.target.value;
        setIdProvinsi(selectedIdProvinsi);
        navigate(`/${selectedIdProvinsi}`);
    };

    const handleKotaChange = (event) => {
        const selectedIdKota = event.target.value;
        setIdKota(selectedIdKota);
        navigate(`/${idprovinsi}/${selectedIdKota}`);
    };

    const handleKecamatanChange = (event) => {
        const selectedIdKecamatan = event.target.value;
        // const trimmedKec = selectedIdKecamatan.slice(0, -1);

        setIdKecamatan(selectedIdKecamatan);
        navigate(`/${idprovinsi}/${idkota}/${selectedIdKecamatan}`);
    };

    const handleKelurahanChange = (event) => {
        const selectedIdKelurahan = event.target.value;
        setIdKelurahan(selectedIdKelurahan);
        navigate(`/${idprovinsi}/${idkota}/${idkecamatan}/${selectedIdKelurahan}`);
    };

  return (
    <>
    <div>
        <select name="prov" id="prov" onChange={handleProvChange} value={idprovinsi}>
            <option>Pilih Provinsi</option>
          {provinsi.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
    </div>
    <div>
      <select name="kota" id="kota" onChange={handleKotaChange} value={idkota}>
      <option>Pilih Kabupaten/Kota</option>
        {kota.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
        ))} 
      </select>
    </div>
    <div>
      <select name="kec" id="kec" onChange={handleKecamatanChange} value={idkecamatan}>
        <option>Pilih Kecamatan</option>
        {kecamatan.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
        ))} 
      </select>
    </div>
    <div>
      <select name="kelurahan" id="kelurahan" onChange={handleKelurahanChange} value={idkelurahan}>
        <option>Pilih Kelurahan</option>
        {kelurahan.map(item => (
            <option key={item.id} value={item.kode}>{item.nama}</option>
        ))} 
      </select>
    </div>
    <div>
        <table>
            <thead>
                <tr>
                <th>Wilayah</th>
                <th>Progress</th>
                <th>H. ANIES RASYID BASWEDAN, Ph.D. - Dr. (H.C.) H. A. MUHAIMIN ISKANDAR</th>
                <th>H. PRABOWO SUBIANTO - GIBRAN RAKABUMING RAKA</th>
                <th>H. GANJAR PRANOWO, S.H., M.I.P. - Prof. Dr. H. M. MAHFUD MD</th>
                </tr>
            </thead>
            <tbody>
                {apiData.map(item => (
                <tr key={item.id}> 
                    <td>{item.nama}</td>
                    <td>{item.api2Data.persen}</td>
                    <td>{item.api2Data['100025']}</td>
                    <td>{item.api2Data['100026']}</td>
                    <td>{item.api2Data['100027']}</td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    <h1 className="text-3xl font-bold underline">
      Data real count KPU
    </h1>
  </>
  )
}

export default Ex