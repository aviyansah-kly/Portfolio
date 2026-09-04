import './globals.css';

export const metadata = {
  title: 'Avi Yansah — Product Designer & Web Creator',
  description: 'Independent Product Designer & Web Creator based in Indonesia, working worldwide.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
