"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function UserAvatarDropDown() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        render={
            /* size-10 matches the other topbar icon buttons; the avatar fills
               the trigger exactly instead of overflowing it. */
            <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full p-0"
                aria-label="Account menu"
            >
                <Avatar className="shrink-0 size-10 border-2">
                    <AvatarImage src="/avatars/robert.png" alt="Robert Doe" />
                    <AvatarFallback>RD</AvatarFallback>
                </Avatar>
            </Button>
            }/>

      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
