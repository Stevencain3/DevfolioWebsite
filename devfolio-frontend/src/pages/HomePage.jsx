import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import MobileMenu from "../components/MobileMenu";
import SocialLinks from "../components/SocialLinks";

export default function HomePage() {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (!clicks) return;

    if (clicks >= 3) {
      navigate("/admin/login");
      setClicks(0);
      return;
    }

    const t = setTimeout(() => setClicks(0), 1200);
    return () => clearTimeout(t);
  }, [clicks, navigate]);

  return (
    <div className="h-screen w-full bg-olive text-white overflow-hidden relative">
      {/* Mobile hamburger menu */}
      <MobileMenu
        items={[
          { label: "BACK HOME", path: "/" },
          { label: "VIEW PROJECTS", path: "/projects" },
          { label: "CONTACT", path: "/contact" },
        ]}
      />

      {/* LEFT-anchored hero block: divider left edge is off-screen; content centered and fully visible */}
      <div className="h-screen flex items-center overflow-x-hidden">
        <div className="w-[56vw] max-w-[1100px] pl-10 sm:pl-14 lg:pl-20">
          {/* OH HEY THERE (slightly larger) */}
          <h1 className="font-heading text-black leading-[0.95] mt-0 text-[clamp(2.6rem,6vw,6.8rem)]">
            OH HEY <br /> THERE...
          </h1>

          {/* I'M STEVEN with Profile Image */}
          <div className="flex items-center gap-8 lg:gap-12 mt-3">
            <h2
              className="font-heading text-black text-[clamp(2.8rem,6.2vw,7.2rem)] cursor-pointer"
              onClick={() => setClicks((c) => c + 1)}
              title="Click 3 times to open admin login"
            >
              <span className="text-cream">I'M STEVEN!</span>
            </h2>
            
            {/* Profile Image - animated pop-in */}
            <img // isue with linked in image changing url 
              src="https://media.licdn.com/dms/image/v2/D5603AQF40JamDQr3VQ/profile-displayphoto-shrink_800_800/B56ZSzEyNaHEAc-/0/1738171164581?e=1772668800&v=beta&t=O7thhsnWExTHoRCmzPTnojPNH6vHgMZKS3v91DWfs6k" 
              alt="Steven M Cain Jr."
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-beige shadow-lg animate-popIn"
              style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
            />
          </div>

          {/* Click feedback - keep small */}
          {clicks > 0 && <div className="text-sm text-beige mt-2">{clicks}/3</div>}

          {/* Divider bar wider than the content so it extends past the subheading */}
          <div
            className="bg-beige h-3 rounded-r-[12px] mt-5"
            style={{ width: '75vw', maxWidth: '1400px', marginLeft: '-14vw' }}
          />

          {/* CONTENT SECTION - centered under the bar width, slightly larger text to fill page */}
          <div className="mt-4 w-full text-center">
            <h3 className="text-beige font-extrabold tracking-wide text-[clamp(1.05rem,1.9vw,1.7rem)] mx-auto">
              DEVELOPER, DESIGNER, AND JACK OF ALL TRADES
            </h3>

            <p className="text-[#C9B7A5] mt-3 text-[clamp(0.95rem,1.5vw,1.3rem)] mx-auto">
              I like to build things,
              <br />
              from websites to Engines
            </p>

            <h4 className="text-[#C9B7A5] font-bold mt-4 text-[clamp(0.95rem,1.3vw,1.05rem)]">
              "Try - Fail - Improve"
            </h4>

            {/* Social Links */}
            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* spacer to ensure content below doesn't overlap hero on small screens */}
        <div style={{ height: '52vh' }} />
      </div>

      {/* SIDE NAV COMPONENT (visible on lg and up) */}
      <SideNav />
    </div>
  );
}
