import React from "react";

export default function SocialLinks() {
  const socials = [
    { name: "Email", url: "mailto:cainsteven57@gmail.com", icon: "✉" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/steven-cain-3b735728a/", icon: "in" },
    { name: "GitHub", url: "https://github.com/Stevencain3", icon: "⚙" },
    { name: "Instagram", url: "https://www.instagram.com/steven_cain3/", icon: "Insta" },
  ];

  return (
    <div className="flex items-center gap-4">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noreferrer"
          title={social.name}
          className="w-10 h-10 rounded-full border-2 border-beige text-beige hover:bg-beige hover:text-olive-dark transition-all duration-200 flex items-center justify-center font-bold text-sm"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
