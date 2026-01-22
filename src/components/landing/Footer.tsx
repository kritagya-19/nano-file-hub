import { Link } from "react-router-dom";
import { Cloud, ArrowRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
  ];

  return (
    <footer className="bg-foreground text-background py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12 lg:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <a href="#" className="inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center">
                <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold">
                Nano<span className="text-primary">File</span>
              </span>
            </a>
            <p className="text-background/60 max-w-md leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              The file sharing platform that doesn't make you want to throw your computer out the window. 
              Fast, secure, and actually reliable.
            </p>
            <Link 
              to="/auth"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors text-sm sm:text-base"
            >
              Start sharing for free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Product</h4>
            <ul className="space-y-3 sm:space-y-4">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-background transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Get Started</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  to="/auth"
                  className="text-background/60 hover:text-background transition-colors text-xs sm:text-sm"
                >
                  Create free account
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-background/60 hover:text-background transition-colors text-xs sm:text-sm"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-background/50 text-center sm:text-left">
              © {currentYear} NanoFile. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-background/50 text-center sm:text-left">
              Made for teams who value their time ⚡
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
