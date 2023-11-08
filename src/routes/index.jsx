import Home from "../components/Home"
import NotFound from "../components/NotFound"

const routes =  [
    {
        path: "/",
        element: <Home />
    }, {
        path: "*",
        element: <NotFound />
    }
]

export default routes;
