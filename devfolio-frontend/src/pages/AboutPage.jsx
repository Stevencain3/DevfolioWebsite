import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideNav from "../components/SideNav";
import MobileMenu from "../components/MobileMenu";
import SocialLinks from "../components/SocialLinks";
import { fetchProfile } from "../store/slices/profileSlice";

export default function AboutPage() {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile);
  
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showSignature, setShowSignature] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const fullText = "About...";

  // Fetch profile data on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Typewriter effect
  useEffect(() => {
    setShowTypewriter(true);
  }, []);

  useEffect(() => {
    if (!showTypewriter) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Trigger signature animation after typewriter completes
        setTimeout(() => setShowSignature(true), 300);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [showTypewriter]);

  // Show content after signature animation
  useEffect(() => {
    if (showSignature) {
      const timer = setTimeout(() => setShowContent(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [showSignature]);

  return (
    <div className="min-h-screen w-full bg-olive text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Typewriter and Signature */}
        <header className="mb-16 min-h-[400px] relative pt-16">
          {/* Background Image */}
          <div 
            className="absolute inset-0 rounded-lg opacity-20"
            style={{
              backgroundImage: 'url(https://media.licdn.com/dms/image/v2/D5616AQGGuhL2s3NWlw/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1697644294566?e=1766620800&v=beta&t=AhdMBf4nDatNxLkLPwX606NnKTYAzQsXq4nUmQmoYOQ)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
          
          {/* Content with higher z-index */}
          <div className="relative z-10">
          {/* Typewriter Effect */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-black leading-tight h-20 font-extrabold text-center">
            {typewriterText}
            {showTypewriter && typewriterText.length < fullText.length && (
              <span className="animate-pulse">|</span>
            )}
          </h1>

          {/* Signature Image - Fixed height container */}
          <div className="-mt-6 flex justify-center h-80 sm:h-96 md:h-[28rem]">
            {showSignature && (
              <img 
                src="http://localhost:8080/uploads/Signature.png"
                alt="Steven M Cain Jr. Signature"
                className="h-full w-auto animate-fadeIn"
                style={{ 
                  filter: 'invert(73%) sepia(19%) saturate(559%) hue-rotate(353deg) brightness(92%) contrast(88%)',
                  animationDelay: '0.3s',
                  animationFillMode: 'backwards'
                }}
              />
            )}
          </div>
          </div>
        </header>

        {/* Main Content - appears after animations */}
        {showContent && profileData.status === "succeeded" && (
          <div className="space-y-16 animate-fadeIn">
            {/* Bio Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-3xl font-bold text-beige">Who I Am</h3>
                <p className="text-[#C9B7A5] text-lg leading-relaxed">
                  {profileData.profile?.bio}
                </p>
                <p className="text-[#C9B7A5] text-lg leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: profileData.profile?.philosophy }} />
                </p>
              </div>

              {/* Photo Sidebar */}
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-beige/20 to-transparent rounded-lg border-2 border-beige overflow-hidden shadow-xl">
                  {profileData.profile?.photo_url ? (
                    <img 
                      src={profileData.profile.photo_url} 
                      alt={profileData.profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/30 flex items-center justify-center">
                      <span className="text-[#C9B7A5]">Photo Placeholder</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-beige">Skills & Expertise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-beige mb-4">Programming Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills?.programming.map((skill) => (
                      <span
                        key={skill}
                        className="bg-black/40 border border-beige/30 text-beige px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-beige mb-4">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills?.tools.map((skill) => (
                      <span
                        key={skill}
                        className="bg-black/40 border border-beige/30 text-beige px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-beige mb-4">Professional Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills?.professional.map((skill) => (
                      <span
                        key={skill}
                        className="bg-black/40 border border-beige/30 text-beige px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Timeline */}
            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-beige">Experience</h3>
              <div className="space-y-6">
                {profileData.experience?.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-beige pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-beige">{exp.title}</h4>
                      {exp.company === "Great West Casualty Company" && (
                        <img 
                          src="https://media.licdn.com/dms/image/v2/D560BAQGGWE2ollyKlg/company-logo_200_200/company-logo_200_200/0/1704991815822/great_west_casualty_company_logo?e=1766620800&v=beta&t=QdZAQ3jL8WnFxVKuWTdVgEjqfLyDF1nsbMuLQJij5f8"
                          alt="Great West Casualty Company"
                          className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                        />
                      )}
                    </div>
                    <p className="text-[#C9B7A5] font-semibold">{exp.company}</p>
                    <p className="text-sm text-[#C9B7A5]/60 mb-2">{exp.period}</p>
                    <p className="text-[#C9B7A5]">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="space-y-6">
              <h3 className="text-3xl font-bold text-beige">Education</h3>
              {profileData.education?.map((edu) => (
                <div key={edu.id} className="bg-olive-dark p-6 rounded-lg border border-beige/20">
                  <h4 className="text-xl font-bold text-beige">{edu.school}</h4>
                  <p className="text-[#C9B7A5] font-semibold">{edu.degree}</p>
                  <p className="text-sm text-[#C9B7A5]/60">{edu.period}</p>
                  {edu.coursework && (
                    <p className="text-[#C9B7A5] mt-2 text-sm">{edu.coursework}</p>
                  )}
                </div>
              ))}
            </section>

            {/* Interests Section */}
            <section className="space-y-6 mb-16">
              <h3 className="text-3xl font-bold text-beige">Beyond the Workplace</h3>
              <p className="text-[#C9B7A5] text-lg">
                {profileData.interests}
              </p>
            </section>

            {/* CTA Section */}
            <section className="flex flex-col sm:flex-row gap-4 justify-center py-12 border-t border-beige/20">
              <a
                href="/projects"
                className="bg-beige text-olive-dark py-3 px-8 rounded font-bold hover:bg-beige/90 transition-colors text-center"
              >
                View My Work
              </a>
              <a
                href="https://drive.google.com/drive/folders/1h4Rwm1hvixSMiHQ9ve3nKqxOWo3IPMw8?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-olive-dark border-2 border-beige text-beige py-3 px-8 rounded font-bold hover:bg-beige hover:text-olive-dark transition-colors text-center"
              >
                Download CV
              </a>
              <a
                href="/contact"
                className="border-2 border-beige text-beige py-3 px-8 rounded font-bold hover:bg-beige hover:text-olive-dark transition-colors text-center"
              >
                Get In Touch
              </a>
            </section>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        items={[
          { label: "HOME", path: "/" },
          { label: "PROJECTS", path: "/projects" },
          { label: "CONTACT", path: "/contact" },
        ]}
      />

      {/* Side Nav */}
      <SideNav items={[
        { label: "BACK TO HOME", path: "/" },
        { label: "VIEW MY PROJECTS", path: "/projects" },
        { label: "GET IN TOUCH", path: "/contact" },
      ]} />

      {/* Animations */}
      <style>{`
        @keyframes drawSignature {
          from {
            stroke-dashoffset: 400;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-signature {
          animation: drawSignature 1.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
