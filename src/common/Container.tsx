import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-3">
      <div className="container overflow-hidden">{children}</div>

      <div className="text-left print:hidden ltr absolute bottom-5 left-1/2 -translate-x-1/2 text-white font-semibold">
        Made with ❤️ by <span>Amirhossein Mazaheri</span>
      </div>
    </div>
  );
};

export default Container;
