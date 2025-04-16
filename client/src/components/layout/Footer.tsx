import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span>Sonoaac</span>
              <span className="text-secondary">Garage</span>
            </div>
            <p className="text-neutral-400 mb-4">The easiest way to sell your car for a fair price.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Home</a>
                </Link>
              </li>
              <li>
                <Link href="#how-it-works">
                  <a className="text-neutral-400 hover:text-white transition duration-200">How It Works</a>
                </Link>
              </li>
              <li>
                <Link href="#about">
                  <a className="text-neutral-400 hover:text-white transition duration-200">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="#contact">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="#blog">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Blog</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#faq">
                  <a className="text-neutral-400 hover:text-white transition duration-200">FAQs</a>
                </Link>
              </li>
              <li>
                <Link href="#privacy">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="#terms">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="#sitemap">
                  <a className="text-neutral-400 hover:text-white transition duration-200">Sitemap</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>123 Auto Lane, Car City, CC 90210</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>info@sonoaacgarage.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                <span>Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Sonoaac Garage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
