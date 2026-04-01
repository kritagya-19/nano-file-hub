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
    { name: "Pricing", link: "#pricing" },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo href="#">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <Cloud className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground text-xl">
            Nano<span className="text-primary font-extrabold">File</span>
          </span>
        </NavbarLogo>

        <NavItems items={navItems} />

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <NavbarButton href="/dashboard" variant="gradient">
              Dashboard
            </NavbarButton>
          ) : (
            <>
              <Link to="/auth">
                <NavbarButton variant="secondary">Sign In</NavbarButton>
              </Link>
              <Link to="/auth">
                <NavbarButton variant="gradient">Start Free</NavbarButton>
              </Link>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo href="#">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <Cloud className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground text-xl">
              Nano<span className="text-primary font-extrabold">File</span>
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
              className="relative text-foreground/80 hover:text-foreground w-full py-3 px-2 text-base font-medium transition-colors rounded-lg hover:bg-muted/50"
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-3 pt-6 mt-2 border-t border-border/50">
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
                    Sign In
                  </NavbarButton>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <NavbarButton variant="gradient" className="w-full">
                    Start Free
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
