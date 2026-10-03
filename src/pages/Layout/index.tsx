import { Outlet } from "react-router-dom";
import NavBar from "components/nav-bar/nav-bar.component";
import "./layout.scss";

const Layout = () => {
  return (
    <div className="layout">
      <NavBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
