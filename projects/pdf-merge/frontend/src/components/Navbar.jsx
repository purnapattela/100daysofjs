import { forwardRef } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const ButtonWithRef = forwardRef(({ children, ...props }, ref) => {
  return (
    <ShadcnButton ref={ref} {...props}>
      {children}
    </ShadcnButton>
  );
});

export default function Navbar({ user }) {
  return (
    <nav className="flex justify-between items-center px-10 py-5 shadow-md">
      <div className="text-4xl font-bold font-mono text-gray-900 dark:text-white">
        PDF Tools
      </div>

      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <ButtonWithRef className={"text-xl"} variant="outline" size="lg">
              Login
            </ButtonWithRef>
            <ButtonWithRef className={"text-xl"} size="lg">
              Signup
            </ButtonWithRef>
          </>
        )}

        {user && (
          <DropdownMenu className="pointer">
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-md  px-5 py-3 text-xl font-medium text-white hover:bg-gray-700 font-mono focus:outline-none"
                type="button"
              >
                {user?.username || "Settings"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black text-white border shadow-lg"
            >
              <DropdownMenuItem className={"text-xl font-mono"}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className={"text-xl font-mono"}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
