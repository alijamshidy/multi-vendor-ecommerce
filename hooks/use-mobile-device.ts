import * as React from "react";

function detectMobileDevice() {
  if (typeof navigator === "undefined") return false;

  const uaData = (
    navigator as Navigator & { userAgentData?: { mobile: boolean } }
  ).userAgentData;

  if (uaData?.mobile) {
    return true;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function useIsMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    setIsMobileDevice(detectMobileDevice());
  }, []);

  return isMobileDevice;
}
