import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LogoutModal from "../modals/LogoutModal";

const AppHeader = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <div className="flex justify-between items-center py-4 px-2 border-b bg-white">
      <SidebarTrigger className="hover:text-primary" />
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-3" asChild>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarFallback>ADM</AvatarFallback>
            <span className="sr-only">Toggle user menu</span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>My Account</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowLogoutDialog(true)}>
            <span className="text-destructive">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutModal open={showLogoutDialog} openChange={setShowLogoutDialog} />
    </div>
  );
};

export default AppHeader;
