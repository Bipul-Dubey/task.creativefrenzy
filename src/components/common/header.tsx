import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  return (
    <div className="h-14 bg-accent/80 flex justify-between w-full px:5 md:px-10 items-center">
      <div className="text-2xl font-bold text-primary">Creative Frenzy</div>
      <div>
        <Avatar className="rounded-lg">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
