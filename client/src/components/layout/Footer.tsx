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
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">© {new Date().getFullYear()} CarMarketValuator. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
