import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import axios from 'axios';
import './App.css'


const Home = () => {
    const { prov, kot, kec, kel, tps } = useParams();

    const location = useLocation();
    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const [apiData, setApiData] = useState([]);

    const [provinsi, setProvinsi] = useState([]);
    const [kota, setKota] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [kelurahan, setKelurahan] = useState([]);
  
    const [data, setData] = useState([]);

    const [idprovinsi, setIdProvinsi] = useState();
    const [idkota, setIdKota] = useState();
    const [idkecamatan, setIdKecamatan] = useState();
    const [idkelurahan, setIdKelurahan] = useState();


    useEffect(() => {
        fetchDataKota();
        fetchDataKecamatan();
        fetchDataKelurahan();
    }, [idprovinsi, idkota, idkecamatan]);
    
    function onLoad() {
        fetchDataKota();
        fetchDataKecamatan();
        fetchDataKelurahan();   
        fetchDataProv(); 

        setIdProvinsi(prov);
        setIdKota(kot);
        setIdKecamatan(kec);
        setIdKelurahan(kel);
    }
    useEffect(() => {
        onLoad();
    }, []);
    // useEffect(() => {

    //   fetchDataProv();
    // }, []);
    const fetchDataProv = async () => {
        const response = await axios.get('https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json');
        setProvinsi(response.data);
    };

    const fetchDataKota = async () => {
        // if (idprovinsi) {
            const response = await axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${prov}.json`);
            setKota(response.data);
        // }
    };

    const fetchDataKecamatan = async () => {
        // if (idkota) {
            const response = await axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${prov}/${kot}.json`);
            setKecamatan(response.data);
        // }
    };

    const fetchDataKelurahan = async () => {
        // if (idkecamatan) {
            const response = await axios.get(`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${prov}/${kot}/${kec}.json`);
            setKelurahan(response.data);
        // }
    };
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
                        // const trimmedKec = kec.slice(0, -1);

                        apiUrl1 += `/${kec}`;
                        apiUrl2 += `/${kec}`;
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
            // console.log(mergedData)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
        
      }, [idprovinsi, idkota, idkecamatan, idkelurahan]);


    const handleProvChange = (event) => {
        onLoad();    
        setIdKota();
        setIdKecamatan();
        setIdKelurahan();
        const selectedIdProvinsi = event.target.value;
        setIdProvinsi(selectedIdProvinsi);
        navigate(`/${selectedIdProvinsi}`);
    };

    const handleKotaChange = (event) => {
        onLoad();    
        setIdKecamatan();
        setIdKelurahan();
        const selectedIdKota = event.target.value;
        setIdKota(selectedIdKota);
        navigate(`/${idprovinsi}/${selectedIdKota}`);
    };

    const handleKecamatanChange = (event) => {
        onLoad();    

        setIdKelurahan();
        const selectedIdKecamatan = event.target.value;
        setIdKecamatan(selectedIdKecamatan);
        navigate(`/${idprovinsi}/${idkota}/${selectedIdKecamatan}`);
    };

    const handleKelurahanChange = (event) => {
        onLoad();    

        const selectedIdKelurahan = event.target.value;
        setIdKelurahan(selectedIdKelurahan);
        navigate(`/${idprovinsi}/${idkota}/${idkecamatan}/${selectedIdKelurahan}`);
    };
  return (
    <>
    <h1 className="text-3xl font-bold underline">
      Data real count KPU
    </h1>
    <div>
        <select name="prov" id="prov" onChange={handleProvChange} value={prov}>
            <option value="">Pilih Provinsi</option>
            {provinsi.map(item => (
                <option key={item.id} value={item.kode}>{item.nama}</option>
            ))}
        </select>
    </div>
    <div>
      <select name="kota" id="kota" onChange={handleKotaChange} value={kot}>
      <option value="">Pilih Kabupaten/Kota</option>
        {kota.map(item => (
            <option key={item.id} value={item.kode}>{item.nama}</option>
        ))} 
      </select>
    </div>
    <div>
      <select name="kec" id="kec" onChange={handleKecamatanChange} value={kec}>
        <option value="">Pilih Kecamatan</option>
        {kecamatan.map(item => (
            <option key={item.id} value={item.kode}>{item.nama}</option>
        ))} 
      </select>
    </div>
    <div>
      <select name="kelurahan" id="kelurahan" onChange={handleKelurahanChange} value={kel}>
        <option value="">Pilih Kelurahan</option>
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
                <tr key={item.id} className="text-white"> 
                    <td>{item.nama}</td>
                    <td>{item.api2Data.persen}</td>
                    {/* <td>{item.api2Data['100025']}</td>
                    <td>{item.api2Data['100026']}</td>
                    <td>{item.api2Data['100027']}</td> */}
                    <td className={idkelurahan && item.api2Data['100025'] > 250 ? "red" : ""}>
                        {
                            item.api2Data['100025'] != null ? (
                                <>
                                    {item.api2Data['100025']}
                                </>
                            ) : (
                                "Data sedang dalam proses"
                            )
                        }
                    </td>
                    <td className={idkelurahan && item.api2Data['100026'] > 250 ? "red" : ""}>
                        {
                            item.api2Data['100026'] != null ? (
                                <>
                                    {item.api2Data['100026']}
                                </>
                            ) : (
                                "Data sedang dalam proses"
                            )
                        }
                    </td>

                    <td className={idkelurahan && item.api2Data['100027'] > 250 ? "red" : ""}>
                        {
                            item.api2Data['100027'] != null ? (
                                <>
                                    {item.api2Data['100027']}
                                </>
                            ) : (
                                "Data sedang dalam proses"
                            )
                        }                    
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>

  </>
  )
}

export default Home