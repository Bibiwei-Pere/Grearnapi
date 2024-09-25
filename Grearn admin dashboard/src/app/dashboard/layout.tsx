import Navbar from "../../app/components/dashboard/navbar/navbar";
import Sidebar from "../../app/components/dashboard/sidebar/sidebar";
import styles from "../../app/components/dashboard/dashboard.module.css";
import Footer from "../../app/components/dashboard/footer/footer";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
