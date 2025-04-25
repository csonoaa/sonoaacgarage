import { Link } from "wouter";

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-blue-600">CarMarketValuator</a>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <a className="text-gray-600 hover:text-blue-600">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/valuation">
                  <a className="text-gray-600 hover:text-blue-600">Get Valuation</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
