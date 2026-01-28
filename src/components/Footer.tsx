import { Link } from 'react-router-dom';
import { Plane, Github, Twitter, Linkedin } from 'lucide-react';
export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    product: [
    {
      label: 'Search Flights',
      href: '/search'
    },
    {
      label: 'Destinations',
      href: '/destinations'
    },
    {
      label: 'Budget Planner',
      href: '/budget'
    },
    {
      label: 'Nearby Airports',
      href: '/nearby'
    }],
    legal: [
    {
      label: 'Privacy Policy',
      href: '#'
    },
    {
      label: 'Terms of Service',
      href: '#'
    },
    {
      label: 'Cookie Policy',
      href: '#'
    }]

  };
  return (
    <footer className="border-t border-border bg-card">
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                SkySearch
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Find the best flights, explore destinations, and plan your perfect
              trip.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">

                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">

                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">

                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) =>
              <li key={link.label}>
                  <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) =>
              <li key={link.label}>
                  <a
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors">

                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SkySearch. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for travelers everywhere
          </p>
        </div>
      </div>
    </footer>);

}