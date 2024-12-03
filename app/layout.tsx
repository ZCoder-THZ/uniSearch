import { ThemeProvider } from '@/app/providers/theme-provider';
import './globals.css';
import QueryclientProvider from './providers/queryClientProvider';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <QueryclientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryclientProvider>
      </body>
    </html>
  );
}
