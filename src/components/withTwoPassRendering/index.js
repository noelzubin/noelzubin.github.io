import React, { useLayoutEffect, useState } from "react";

export default (WrappedComponent) => ({
  children,
  ...rest
}) => {
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

  return (
    <WrappedComponent {...rest} key={isClient}>
      {children}
    </WrappedComponent>
  );
};