import React from "react";

const Footer = () => {
  return (
    <div className="mt-16 bg-black text-white py-10 text-center">
      <p>
        &copy; {new Date().getFullYear()} Ghana My Home. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
