import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-800 text-center text-xs text-slate-400">
      <p>© {new Date().getFullYear()} ShopKeeper Pro Retail Systems. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
