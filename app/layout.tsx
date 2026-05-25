import localFont from "next/font/local";
import "./globals.css";

const departureMono = localFont({
  src: '../fonts/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
  display: 'swap',
});

const helveticaNeue = localFont({
  src: '../fonts/HelveticaNeueLTPro-BlkCn.woff2',
  variable: '--font-helvetica-neue',
  display: 'swap',
});

const homeVideoBold = localFont({
  src: '../fonts/HomeVideo-Bold.woff2',
  variable: '--font-home-video-bold',
  display: 'swap',
});

const homeVideoRegular = localFont({
  src: '../fonts/HomeVideo-Regular.woff2',
  variable: '--font-home-video-regular',
  display: 'swap',
});

const dmSans = localFont({
  src: '../fonts/DMSans-Regular.woff2',
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`
                    ${departureMono.variable} 
                    ${helveticaNeue.variable} 
                    ${homeVideoBold.variable} 
                    ${homeVideoRegular.variable} 
                    ${dmSans.variable} 
                    antialiased 
                    min-h-screen flex 
                    flex-col`
                }
            >
                {children}
            </body>
        </html>
    );
}
