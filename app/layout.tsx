import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const Euclid = localFont({
  src: [
    {
      path: '../public/EuclidCircularA-Light-WebXL.woff',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Light-WebXL.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Light-WebXL.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Light-WebXL.woff',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/EuclidCircularA-Light-WebXL.woff',
      weight: '400',
      style: 'normal',
    },

    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/EuclidCircularA-Medium-WebXL.woff',
      weight: '800',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-euclid',
});

export const metadata: Metadata = {
  title: 'Open MCP Client',
  description: 'An open source MCP client built with CopilotKit 🪁',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${Euclid.variable} antialiased`}>
        <CopilotKit
          runtimeUrl='/api/copilotkit'
          // agent="sample_agent"
          showDevConsole={false}
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
