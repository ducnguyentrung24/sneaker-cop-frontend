import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-400 flex items-center justify-center gap-1">
        
        <FontAwesomeIcon icon={faCopyright} />
        
        <span>2026 Sneaker Cop. All rights reserved.</span>

      </div>
    </footer>
  );
}

export default Footer;  