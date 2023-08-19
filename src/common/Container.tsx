import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {children}
      <div className="text-left ltr absolute bottom-5 left-1/2 -translate-x-1/2 text-white font-semibold">
        Made with ❤️ by <span>Amirhossein Mazaheri</span>
      </div>
    </div>
  );
};

export default Container;
