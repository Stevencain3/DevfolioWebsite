import { useState } from "react";
import SideNav from "../components/SideNav";
import MobileMenu from "../components/MobileMenu";
import SocialLinks from "../components/SocialLinks";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    projectDetails: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8080/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          project_details: formData.projectDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        projectDetails: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-olive text-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-black leading-tight mb-4">
            Let's Chat
          </h1>
          <p className="text-beige text-lg">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-olive-dark p-8 rounded-lg shadow-lg space-y-6">
              {/* Status Messages */}
              {status === "success" && (
                <div className="bg-green-600/20 border-l-4 border-green-500 text-green-300 p-4 rounded">
                  ✓ Thanks for reaching out! I'll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-600/20 border-l-4 border-red-500 text-red-300 p-4 rounded">
                  ✗ {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-beige font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-beige font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-beige font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-beige font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me more about what you'd like to discuss..."
                  rows={5}
                  className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Project Details */}
              <div>
                <label className="block text-beige font-semibold mb-2">Project Details (Optional)</label>
                <textarea
                  name="projectDetails"
                  value={formData.projectDetails}
                  onChange={handleChange}
                  placeholder="Tell me about the project you'd like me to work on — timeline, budget, scope, etc."
                  rows={4}
                  className="w-full p-3 rounded text-black border-2 border-transparent focus:border-beige focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-beige text-olive-dark py-3 px-6 rounded font-bold text-lg hover:bg-beige/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-olive-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-beige mb-4">Get In Touch</h3>
              <div className="space-y-4 text-[#C9B7A5]">
                <p>
                  <span className="text-beige font-semibold">Email:</span><br />
                  <a href="mailto:cainsteven509@gmail.com" className="hover:text-beige transition-colors">
                    cainsteven509@gmail.com
                  </a>
                </p>
                <p>
                  <span className="text-beige font-semibold">Response Time:</span><br />
                  Ehm honestly I wouldnt be to hopeful....
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-olive-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-beige mb-4">Follow Me</h3>
              <SocialLinks />
            </div>

            {/* Additional Info */}
            <div className="bg-black/30 p-6 rounded-lg border border-beige/20">
              <p className="text-sm text-[#C9B7A5] leading-relaxed">
                Whether you have a project in mind, want to collaborate, or just want to chat about design and tech, I'm always open to interesting conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        items={[
          { label: "HOME", path: "/" },
          { label: "PROJECTS", path: "/projects" },
        ]}
        alwaysVisible={true}
      />
    </div>
  );
}
