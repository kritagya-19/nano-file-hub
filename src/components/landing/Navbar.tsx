import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Cloud } from "lucide-react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const NavbarComponent = () => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "How It Works", link: "#how-it-works" },
    { name: "Use Cases", link: "#use-cases" },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo href="#">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <Cloud className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">
            Nano<span className="text-primary">File</span>
          </span>
        </NavbarLogo>

        <NavItems items={navItems} />

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <NavbarButton href="/dashboard" variant="gradient">
              Dashboard
            </NavbarButton>
          ) : (
            <>
              <Link to="/auth">
                <NavbarButton variant="secondary">Login</NavbarButton>
              </Link>
              <Link to="/auth">
                <NavbarButton variant="gradient">Get Started</NavbarButton>
              </Link>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo href="#">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <Cloud className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-foreground">
              Nano<span className="text-primary">File</span>
            </span>
          </NavbarLogo>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300 w-full py-2"
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-2 pt-4 border-t border-border">
            {!loading && user ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton variant="gradient" className="w-full">
                  Dashboard
                </NavbarButton>
              </Link>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="secondary" className="w-full">
                    Login
                  </NavbarButton>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="gradient" className="w-full">
                    Get Started
                  </NavbarButton>
                </Link>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default NavbarComponent;
