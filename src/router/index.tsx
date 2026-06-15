import { useRoutes } from "react-router-dom";
import Homepage from "../pages/home/home-page";
import Requestpage from "../pages/request/request-page";
import RequestFormPage from "../pages/request/components/create-update-request/request-form-page";

const Router = () => {
  const element = useRoutes([
        {
            path: "",
            element: <Homepage/>
        },
        {
            path: "request",
            element: <Requestpage/>
        },
        {
            path: "request/add",
            element: <RequestFormPage/>
        },
        {
            path: "request/:request_id/edit",
            element: <RequestFormPage/>
        }
  ])
  return element;
}

export default Router;
