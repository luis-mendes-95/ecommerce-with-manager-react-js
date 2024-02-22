import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name) => (  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />);

const iconExternal = (name) => (
  <SvgColor src={`${name}`} sx={{ width: 1, height: 1 }} />
);

const navConfig = {
  loggedIn: [
    {
      title: 'INDICADORES',
      path: '/',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/3971/3971214.png'),
    },
    {
      title: 'CPF / CNPJ',
      path: '/user',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/1379/1379505.png'),
    },
    {
      title: 'PRODUTOS',
      path: '/products',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/1573/1573499.png'),
    },
    {
      title: 'VENDAS',
      path: '/vendas',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/7646/7646966.png'),
    },
    {
      title: 'ORDENS DE SERVIÇO',
      path: '/os',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/3527/3527105.png'),
    },
    {
      title: 'COMPRAS',
      path: '/compras',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/3862/3862976.png'),
    },
    {
      title: 'A RECEBER',
      path: '/receivables',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/8312/8312154.png'),
    },
    {
      title: 'A PAGAR',
      path: '/payables',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/8312/8312797.png'),
    },
    {
      title: 'ARQUIVOS',
      path: '/files',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/4706/4706330.png'),
    },
  ],
  unsigned: [
    {
      title: 'Como comprar',
      path: '/user',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/1379/1379505.png'),
    },
    {
      title: 'Toda Loja',
      path: '/products',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/1573/1573499.png'),
    },
    {
      title: 'Categorias',
      path: '/os',
      icon: iconExternal('https://cdn-icons-png.flaticon.com/512/3527/3527105.png'),
    }
  ]
}

export default navConfig;
