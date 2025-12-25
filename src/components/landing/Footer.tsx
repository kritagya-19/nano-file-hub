import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Security", href: "#security" },
  ];

  const authLinks = [
    { name: "Login", href: "/auth" },
    { name: "Register", href: "/auth" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Nano<span className="text-primary">File</span>
              </span>
            </a>
            <p className="text-background/60 max-w-md leading-relaxed">
              A modern file exchange system designed for students, teams, and organizations. 
              Fast, secure, and reliable file sharing with resumable uploads and hybrid storage.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-3">
              {authLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {currentYear} Nano File Exchange System. All rights reserved.
            </p>
            <p className="text-sm text-background/50">
              Built with ❤️ for better file sharing
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
