import type { ReactNode } from 'react';

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // You can add global providers here, such as ThemeProvider, QueryClientProvider, Redux Provider, etc.
    return <>{children}</>;
};
