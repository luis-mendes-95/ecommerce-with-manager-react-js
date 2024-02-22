/* eslint-disable */
import { Helmet } from 'react-helmet-async';

import { ClientsView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function ClientsPage() {
  return (
    <>
      <Helmet>
        <title> E-KOMMERCE </title>
      </Helmet>

      <ClientsView />
    </>
  );
}
