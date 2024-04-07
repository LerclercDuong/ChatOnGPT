import Chat from "../pages/Chat";
import UserSetting from "../pages/Profile";
import Login from "../pages/Login";
import SignUp from "../components/SignUp";
import Introduction from "../pages/Introduction";
const privateRoutes = [
    {
        path: '/',
        component: Chat,
    },
    {
        path: '/profile/*',
        component: UserSetting,
    }
]

const publicRoutes = [
    {
        path: '/introduction',
        component: Introduction,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/signup',
        component: SignUp,
    }
]

export {
    privateRoutes,
    publicRoutes
};