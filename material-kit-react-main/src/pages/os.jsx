/* eslint-disable */
import { Helmet } from 'react-helmet-async';
import { OsView } from 'src/sections/os/view';



// ----------------------------------------------------------------------

export default function OsPage() {
  return (
    <>
      <Helmet>
        <title> Ordens de Serviço </title>
      </Helmet>

      <OsView />
      
    </>
  );
}
