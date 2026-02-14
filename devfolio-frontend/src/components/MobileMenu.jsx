import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MobileMenu({ items = [], alwaysVisible = false }) {
  const [open, setOpen] = useState(false);

  const navItems =
    items.length > 0
      ? items
      : [
          { label: "HOME", path: "/" },
          { label: "PROJECTS", path: "/projects" },
          { label: "ABOUT", path: "/about" },
        ];

  return (
    <>
      {/* Hamburger button - visible on small screens only */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        className={`${alwaysVisible ? "fixed" : "lg:hidden fixed"} top-4 right-4 z-50 flex items-center justify-center w-11 h-11 rounded bg-olive-dark text-beige shadow-md`}
      >
        <div className="space-y-1 w-5">
          <span className={`block h-0.5 bg-beige transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}></span>
          <span className={`block h-0.5 bg-beige transition-opacity ${open ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 bg-beige transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}></span>
        </div>
      </button>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          <nav className="relative ml-auto w-3/4 max-w-xs bg-olive-dark p-6 flex flex-col gap-4">
            {navItems.map((it) => (
              <Link
                key={it.path}
                to={it.path}
                onClick={() => setOpen(false)}
                className="bg-beige text-olive-dark font-bold tracking-wide py-3 px-4 rounded shadow-sm text-base text-center"
              >
                {it.label}
              </Link>
            ))}

            <div className="mt-auto text-sm text-[#C9B7A5]">Close the menu to return to the page.</div>
          </nav>
        </div>
      )}
    </>
  );
}
