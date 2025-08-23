"use client";
import { SnackbarProvider } from "notistack";
import React from "react";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
