// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { GrInspect, GrCatalog, GrLogout } from "react-icons/gr";
import { AiOutlineHome, AiOutlineUser, AiOutlineProfile } from "react-icons/ai";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const router = useRouter();
  const user = useUser({});
  return (
    <div className="flex">
      <div className="fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div
              className="bg-purple-800 hover:bg-purple-400 text-white p-3 rounded-lg inline-block"
              title="Home"
            >
              <AiOutlineHome size={20} />
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <Link href="/packages">
            <div
              className="bg-gray-200 hover:bg-gray-400 my-4 p-3 rounded-lg inline-block"
              title="Package Library"
            >
              <GrCatalog size={20} />
            </div>
          </Link>
          <Link href="/curation">
            <div
              className="bg-gray-200 hover:bg-gray-400 my-4 p-3 rounded-lg inline-block"
              title="Package Curations"
            >
              <GrInspect size={20} />
            </div>
          </Link>

          {!user && (
            <Link href="/login">
              <div
                className="bg-gray-200 hover:bg-gray-400 my-4 p-3 rounded-lg inline-block"
                title="Login"
              >
                <AiOutlineUser size={20} />
              </div>
            </Link>
          )}
          {router.pathname !== "/logout" && user && (
            <Link href="/profile">
              <div
                className="bg-gray-200 hover:bg-gray-400 my-4 p-3 rounded-lg inline-block"
                title="Profile"
              >
                <AiOutlineProfile size={20} />
              </div>
            </Link>
          )}
          {router.pathname !== "/logout" && user && (
            <Link href="/logout">
              <div
                className="bg-gray-200 hover:bg-gray-400 my-4 p-3 rounded-lg inline-block"
                title="Logout"
              >
                <GrLogout size={20} />
              </div>
            </Link>
          )}
        </div>
      </div>
      <main className="ml-20 w-full">{children}</main>
    </div>
  );
};

export default Sidebar;
