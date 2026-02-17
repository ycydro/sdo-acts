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
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const AppHeader = () => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user } = useAuth();

  const isStaff =
    user?.role.toLowerCase() === "staff" ||
    user?.role.toLowerCase() === "superadmin";

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
          {isStaff && (
            <>
              <DropdownMenuItem onSelect={() => navigate("/dashboard")}>
                Switch to Client Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={() => setShowLogoutDialog(true)}>
            <span className="text-destructive">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutModal open={showLogoutDialog} onOpenChange={setShowLogoutDialog} />
    </div>
  );
};

export default AppHeader;
