import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="text-primary font-bold text-2xl cursor-pointer">
              <span>Sonoaac</span>
              <span className="text-secondary">Garage</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link href="#how-it-works">
            <a className="text-neutral-600 hover:text-primary font-medium">How it Works</a>
          </Link>
          <Link href="#faq">
            <a className="text-neutral-600 hover:text-primary font-medium">FAQs</a>
          </Link>
          <Link href="#about">
            <a className="text-neutral-600 hover:text-primary font-medium">About Us</a>
          </Link>
          <Link href="#contact">
            <a className="text-neutral-600 hover:text-primary font-medium">Contact</a>
          </Link>
        </nav>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-white pt-2 pb-4 px-4",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="flex flex-col space-y-3">
          <Link href="#how-it-works">
            <a className="text-neutral-600 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              How it Works
            </a>
          </Link>
          <Link href="#faq">
            <a className="text-neutral-600 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              FAQs
            </a>
          </Link>
          <Link href="#about">
            <a className="text-neutral-600 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </a>
          </Link>
          <Link href="#contact">
            <a className="text-neutral-600 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
