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
          Resumo:
        </Typography>
      }



      {/** IF ADMIN OR COLLABORATOR, RENDER THIS */}
      {
        user &&
        <Grid container spacing={3}>


        <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Clientes Cadastrados"
              total={user?.clientes.length || "0"}
              color="info"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/1379/1379505.png" />}
            />
        </Grid>
  
        <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Produtos Cadastrados"
              total={user?.produtos.length || "0"}
              color="info"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/1573/1573499.png" />}
            />
        </Grid>
  
          
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Vendas Efetuadas"
              total={user?.vendas.length || "0"}
              color="success"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/7646/7646966.png" />}
            />
          </Grid>
  
  
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Ordens de Serviço"
              total={user?.os.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/3527/3527105.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Compras Feitas"
              total={user?.compras.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/3862/3862976.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Títulos A Receber"
              total={user?.receivables.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/8312/8312154.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Títulos A Pagar"
              total={user?.payables.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/8312/8312797.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Arquivos"
              total={user?.arquivos.length || "0"}
              color="warning"
              icon={<img alt="icon" src="https://cdn-icons-png.flaticon.com/512/4706/4706330.png" />}
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Categorias Mais Vendidas"
              chart={{
                series: [
                  { label: 'Camisetas', value: 4344 },
                  { label: 'Windbanners', value: 5435 },
                  { label: 'Adesivos', value: 1443 },
                  { label: 'Lonas', value: 4443 },
                ],
              }}
            />
          </Grid>
  
  
  
  
  {/**
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   *  *         <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  '01/01/2003',
                  '02/01/2003',
                  '03/01/2003',
                  '04/01/2003',
                  '05/01/2003',
                  '06/01/2003',
                  '07/01/2003',
                  '08/01/2003',
                  '09/01/2003',
                  '10/01/2003',
                  '11/01/2003',
                ],
                series: [
                  {
                    name: 'Team A',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Team B',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Team C',
                    type: 'line',
                    fill: 'solid',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ],
              }}
            />
          </Grid>
  
  
  
  
  
   *    *         <Grid xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chart={{
                series: [
                  { label: 'Italy', value: 400 },
                  { label: 'Japan', value: 430 },
                  { label: 'China', value: 448 },
                  { label: 'Canada', value: 470 },
                  { label: 'France', value: 540 },
                  { label: 'Germany', value: 580 },
                  { label: 'South Korea', value: 690 },
                  { label: 'Netherlands', value: 1100 },
                  { label: 'United States', value: 1200 },
                  { label: 'United Kingdom', value: 1380 },
                ],
              }}
            />
          </Grid>
  
  
  
   *         <Grid xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chart={{
                categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
                series: [
                  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                ],
              }}
            />
          </Grid>
  
  
  
  
  
  
                  <Grid xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: faker.person.jobTitle(),
                description: faker.commerce.productDescription(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>
   * 
   * 
   * 
   * 
   *         <Grid xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>
   * 
   * 
   * 
   *         <Grid xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', name: 'Create FireStone Logo' },
                { id: '2', name: 'Add SCSS and JS files if required' },
                { id: '3', name: 'Stakeholder Meeting' },
                { id: '4', name: 'Scoping & Estimations' },
                { id: '5', name: 'Sprint Showcase' },
              ]}
            />
          </Grid>
   * 
   * 
   * 
   */}
  
  
  
  
  
  
        </Grid>
      }



    </Container>
  );
}
