import PrivateNavbar from "../components/Home/HomeNav";
import OtherFooter from "../components/landing/OtherFooter";

const PrivateLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PrivateNavbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
            <OtherFooter />
          </div>
        </div>
      </div>
      {/* {isPoolMonitoringPage && <OtherFooter />} */}
      {/* Floating Action Button for all Private Layouts */}
      {/* <div className="fixed z-50 lg:hidden bottom-4 right-4">
        <FloatingActionButton navItems={navItems} />
      </div> */}
    </div>
  );
};

export default PrivateLayout;
