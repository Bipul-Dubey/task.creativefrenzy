"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useBoardStore } from "@/store/board-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { currentUser } = useBoardStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("login");
    router.replace("/");
  };

  return (
    <div className="h-14 bg-accent/80 flex justify-between w-full px-5 md:px-10 items-center">
      <div className="text-2xl font-bold text-primary">Creative Frenzy</div>

      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="rounded-lg cursor-pointer">
            <AvatarImage
              src={
                currentUser?.profileUrl
                  ? currentUser.profileUrl
                  : "https://github.com/evilrabbit.png"
              }
              alt={currentUser?.fullName ?? "@evilrabbit"}
            />
            <AvatarFallback>
              {currentUser?.fullName?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>

        <PopoverContent className="w-40 p-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarImage
                    src={
                      currentUser?.profileUrl
                        ? currentUser.profileUrl
                        : "https://github.com/evilrabbit.png"
                    }
                    alt={currentUser?.fullName ?? "@evilrabbit"}
                  />
                  <AvatarFallback>
                    {currentUser?.fullName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{currentUser?.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.email ?? "user@example.com"}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Header;
