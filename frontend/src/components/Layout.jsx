import Siderbar from "./Siderbar";
import Navbar from "./Navbar";

const Layout = ({ showSidebar = false, children }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Siderbar />}

        <div className="flex flex-1 flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
