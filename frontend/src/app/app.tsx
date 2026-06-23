import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './provider';
import { AppRouter } from './router';
import GlobalModal from '@/shared/components/ui/GlobalModal';

export const App = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
            <GlobalModal />
        </AppProvider>
    );
};

export default App;
