import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import './App.css'


const Home = () => {
    const { prov } = useParams();

    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const [apiData, setApiData] = useState([]);

    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
  
    const [data, setData] = useState([]);
    // Initialize 'provinsi' state with an empty string, or any default value you prefer
    const [idprovinsi, setIdProvinsi] = useState();
    const [idkota, setIdKota] = useState();
    const [idkecamatan, setIdKecamatan] = useState();
  
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
            const [api1Response, api2Response] = await Promise.all([
              axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${prov}.json`),
              axios.get(`https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${prov}.json`)
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
        
      }, [idprovinsi]);

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
  
      const fetchData = async () => {
        if (idprovinsi) {
          const response = await axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${idprovinsi}.json`);
          setData(response.data);
        }
        // console.log(dataProvinsi)
      };
      fetchData();
    }, [idprovinsi]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (idkota) {
          const response = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${idkota}.json`);
          setKecamatan(response.data);
        }
      };
      fetchData();
    }, [idprovinsi]);

    const handleSelectChange = (event) => {
        const selectedIdProvinsi = event.target.value;
        setIdProvinsi(selectedIdProvinsi);
        navigate(`/${selectedIdProvinsi}`);
      };
  return (
    <>
    <div>
        <select name="prov" id="prov" onChange={handleSelectChange} value={idprovinsi}>
          {provinsi.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      {/* <p>Selected Value: {provinsi}</p> */}
    </div>
    <div>
      <select name="prov" id="kota" onChange={(event) => setIdKota(event.target.value)}>
        
        {kota.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
        ))} 
      </select>
      {/* <p>Selected Value: {provinsi}</p> */}
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
  </>
  )
}

export default Home