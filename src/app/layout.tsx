import './globals.css'

export const metadata = {
  title: 'Pomodoro Focus - Boost Your Productivity',
  description: 'A modern Pomodoro timer web application with session tracking, customizable settings, and productivity features to help you stay focused and boost productivity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Pomodoro Focus" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pomodoro Focus" />
      </head>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}