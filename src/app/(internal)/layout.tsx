import Header from "@/components/common/header";
import DataProvider from "@/context/DataProvider";
import { SocketProvider } from "@/context/SocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <DataProvider>
        <div className="flex flex-col space-y-2">
          <Header />
          {children}
        </div>
      </DataProvider>
    </SocketProvider>
  );
}
