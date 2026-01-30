import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
            <Sidebar />
            <main style={{
                marginLeft: '240px',
                flex: 1,
                padding: 'var(--spacing-xl)',
                overflowY: 'auto'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
