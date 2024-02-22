/* eslint-disable */
import { Helmet } from 'react-helmet-async';


import { AppView } from 'src/sections/overview/view';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <ToastContainer />
      <Helmet>
        <title> E-KOMMERCE | TEJAS SOFTWARE</title>
      </Helmet>

      <AppView />

    </>
  );
}
