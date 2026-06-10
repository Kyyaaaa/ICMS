import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </AppProvider>
    );
};

export default App;
