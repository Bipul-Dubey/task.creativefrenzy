import Header from "@/components/common/header";
import EventWrapper from "@/components/EventWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EventWrapper>
      <div className="flex flex-col space-y-2">
        <Header />
        {children}
      </div>
    </EventWrapper>
  );
}
