/* eslint-disable */
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { users } from 'src/_mock/clients';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import ClientTableRow from '../clients-table-row';
import UserTableHead from '../clients-table-head';
import TableEmptyRows from '../table-empty-rows';
import ClientTableToolbar from '../client-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import api from 'src/services/api';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ClientAddFormView } from 'src/sections/clients/clientAddForm';
import "react-toastify/dist/ReactToastify.css";
import { ClientEditFormView } from 'src/sections/clients/clientEditForm';
// ----------------------------------------------------------------------


export default function ClientView() {

  //STATES USEFUL FOR THIS COMPONENT
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [regsSituation, setRegsSituation] = useState("active");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);


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
        //se der erro setar botao logout
        }
      } catch (err) {
        //setUser(null);
        //se der erro setar botao login
      }
    }
  }; 
  useEffect(() => {
  getUser();
  }, []);
  /** */




  /** GET CLIENT BY REQUEST IN BACKEND*/
  const [client, setClient] = useState(null);
  const getClient = async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data){

        console.log(response.data);
          setClient(response.data);
          setShowEdit(true);  
      }
    } catch (err) {
      console.log(err);
      setClient(null);
    }
  }; 





  //VARIABLES AND FUNCTIONS USEFUL FOR THIS COMPONENT
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (id) => {
    setShowAdd(false);
    getClient(id);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const dataFiltered = applyFilter({
    inputData: user?.clientes || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;
  




  {/**FUNÇÃO CONTROLADA PELO SELECT DA SITUAÇÃO DO ITEM, ALTERNA ENTRE OS ESTADOS DISPONÍVEIS E RENDERIZA COM BASE NELES*/}
  const handleChangeregsSituation = (event) => {
    setRegsSituation(event.target.value);
  };



  return (
    <Container>

    {
      !showAdd && !showEdit &&
        <>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

          <Typography variant="h4">CPF / CNPJ</Typography>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={()=>{setShowAdd(true); setShowEdit(false)}}>
            NOVO CPF / CNPJ
          </Button>

          </Stack>

          <Card>

          <Box sx={{display:"flex", alignItems:"center", flexWrap:"wrap"}}>
          <ClientTableToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <FormControl style={{minWidth: "200px", margin:"10px 20px"}}>
                  <InputLabel id="demo-simple-select-label" sx={{bgcolor:"white", padding:"0 3px 0 0"}}>SITUAÇÃO</InputLabel>
                  <Select
                    style={{minWidth: "200px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={regsSituation}
                    label="SITUAÇÃO"
                    onChange={handleChangeregsSituation}
                  >
                    <MenuItem value={"active"}>ATIVOS</MenuItem>
                    <MenuItem value={"inactive"}>INATIVOS</MenuItem>
                    <MenuItem value={"all"}>TODOS</MenuItem>
                  </Select>
              </FormControl>
          </Box>


          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>

                <UserTableHead order={order} orderBy={orderBy} rowCount={users.length} numSelected={selected.length} onRequestSort={handleSort} onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'nome_razao_social', label: 'NOME / RAZÃO SOCIAL' },
                    { id: 'apelido_nome_fantasia', label: 'APELIDO / NOME FANTASIA' },
                    { id: 'celular', label: 'CELULAR' },
                    { id: 'telefone', label: 'TELEFONE', align: 'center' },
                    { id: 'cidade', label: 'CIDADE' },
                    { id: 'estado', label: "ESTADO" },
                  ]}
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      
                    if (regsSituation === "all") {
                      return (
                        <ClientTableRow
                        key={row.id}
                        id={row.id}
                        nome_razao_social={row.nome_razao_social}
                        apelido_nome_fantasia={row.apelido_nome_fantasia}
                        celular={row.celular}
                        telefone={row.telefone}
                        cidade={row.cidade}
                        estado={row.estado}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={() => handleClick(row.id)}
                      />
                      )  
                    }  else if (regsSituation === "inactive" && row.active === false) {
                      return (
                        <ClientTableRow
                        key={row.id}
                        nome_razao_social={row.nome_razao_social}
                        apelido_nome_fantasia={row.apelido_nome_fantasia}
                        celular={row.celular}
                        telefone={row.telefone}
                        cidade={row.cidade}
                        estado={row.estado}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={() => handleClick(row.id)}
                      />
                      )  
                    } else if (regsSituation === "active" && row.active === true) {
                      return (
                        <ClientTableRow
                        key={row.id}
                        nome_razao_social={row.nome_razao_social}
                        apelido_nome_fantasia={row.apelido_nome_fantasia}
                        celular={row.celular}
                        telefone={row.telefone}
                        cidade={row.cidade}
                        estado={row.estado}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={() => handleClick(row.id)}
                      />
                      )  
                    }
                    
                                  
                    
                    
                    }

                                        
                    )}


                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>


          </Card>
        </>

    }

    {
      showAdd &&
      <>
      <ClientAddFormView/>
      </>
    }

{
      showEdit &&
      <>
      <ClientEditFormView item={client}/>
      </>
    }



    </Container>
  );
}
