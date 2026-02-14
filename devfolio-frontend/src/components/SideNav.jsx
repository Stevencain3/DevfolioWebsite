import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideNav({ items = [] }) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Default navigation items if none provided
  const navItems = items.length > 0 ? items : [
    { label: "A BIT ABOUT ME", path: "/about" },
    { label: "VIEW MY PROJECTS", path: "/projects" },
    { label: "GET IN TOUCH", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`hidden lg:flex flex-col justify-between bg-olive-dark rounded-l-[40px] pr-0 pl-[2vw] py-[10vh] w-[30vw] max-w-[520px] h-[80vh] fixed right-0 top-[8vh] shadow-[0_40px_80px_rgba(0,0,0,0.55)] z-40 transition-transform duration-300 ease-in-out ${
        isHovered ? "translate-x-0" : "translate-x-[calc(100%-40px)]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {navItems.map((item, idx) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bg-beige text-olive-dark font-bold tracking-wide text-[clamp(1.1rem,1.6vw,1.9rem)] py-4 px-6 rounded-l-[15px] rounded-r-none shadow-[0_18px_0_rgba(0,0,0,0.8)] ml-auto text-center transition-all hover:shadow-[0_22px_0_rgba(0,0,0,0.9)] ${
            isActive(item.path) ? "ring-2 ring-cream" : ""
          } ${idx === 0 ? "w-[70%]" : idx === 1 ? "w-[80%]" : "w-[62%]"}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
