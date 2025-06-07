import './MainLayout.css';

const MainLayout = ({ header, children }) => {
  return (
    <div>
      <div>{header}</div>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
