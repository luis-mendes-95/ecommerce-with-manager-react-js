/* eslint-disable */
// import { faker } from '@faker-js/faker';


import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import Iconify from 'src/components/iconify';
// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
// import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import { useEffect, useState } from 'react';
import api from 'src/services/api';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
// import AppConversionRates from '../app-conversion-rates';



// ----------------------------------------------------------------------

export default function AppView() {

    /** GET USER BY REQUEST IN BACKEND AND TAKES TOKEN FROM LOCALSTORAGE*/
    const user_id = localStorage.getItem('tejas.app.user_id');
    const token = localStorage.getItem('tejas.app.token');
    const user_name = localStorage.getItem('tejas.app.user_name');
    const [user, setUser] = useState(null);
    const getUser = async () => {
      if (user_id){
        try {
          const response = await api.get(`/users/${user_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if(response.data){
              setUser(response.data);
              console.log(response.data)
          //se der erro setar botao logout
          }
        } catch (err) {
          setUser(null);
          //se der erro setar botao login
        }
      }
    }; 
    useEffect(() => {
    getUser();
    }, []);
    /** */

  return (
    <Container maxWidth="xl">
            <ToastContainer />

      {
        user &&
        <Typography variant="h4" sx={{ mb: 5 }}>
          RESUMO:
        </Typography>
      }



      {/** IF ADMIN OR COLLABORATOR, RENDER THIS */}
      {
        user &&
        <Grid container spacing={3}>


        <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="CLIENTES CADASTRADOS"
              total={user?.clientes.length || "0"}
              color="info"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/1379/1379505.png" />}
            />
        </Grid>
  
        <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="PRODUTOS CADASTRADOS"
              total={user?.produtos.length || "0"}
              color="info"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/1573/1573499.png" />}
            />
        </Grid>
  
          
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="VENDAS EFETUADAS"
              total={user?.vendas.length || "0"}
              color="success"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/7646/7646966.png" />}
            />
          </Grid>
  
  
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="ORDENS DE SERVIÇO"
              total={user?.os.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/3527/3527105.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="COMPRAS FEITAS"
              total={user?.compras.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/3862/3862976.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="TÍTULOS A RECEBER"
              total={user?.receivables.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/8312/8312154.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="TÍTULOS A PAGAR"
              total={user?.payables.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/8312/8312797.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="ARQUIVOS"
              total={user?.arquivos.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/4706/4706330.png" />}
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="CATEGORIAS MAIS VENDIDAS"
              chart={{
                series: [
                  { label: 'CAMISETAS', value: 4344 },
                  { label: 'WINDBANNERS', value: 5435 },
                  { label: 'ADESIVOS', value: 1443 },
                  { label: 'LONAS', value: 4443 },
                ],
              }}
            />
          </Grid>
  
  
  
  
        </Grid>
      }



    </Container>
  );
}
