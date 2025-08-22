import React from "react";

const EventWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div>{children}</div>;
};

export default EventWrapper;
