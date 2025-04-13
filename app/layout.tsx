import '../styles/globals.css'; // 👈 this is the critical line

export const metadata = {
  title: 'Becky\'s Recipes',
  description: 'A collection of delicious recipes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
