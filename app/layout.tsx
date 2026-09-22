import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://lume-studio.samuel-aurelio2019.chatgpt.site'),
  title: 'Lume Studio — Boas ideias. Sites à altura.',
  description:
    'Design e desenvolvimento de sites, landing pages e interfaces digitais. Conheça os projetos da Lume Studio.',
  icons: { icon: '/brand/avatar.png' },
  openGraph: {
    title: 'Lume Studio — Boas ideias. Sites à altura.',
    description:
      'Sites com personalidade, organização e cuidado com cada detalhe.',
    locale: 'pt_BR',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lume Studio — Boas ideias. Sites à altura.',
    description:
      'Sites com personalidade, organização e cuidado com cada detalhe.',
    images: ['/og.png'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
