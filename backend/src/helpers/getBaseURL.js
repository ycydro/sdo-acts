import os from "os";

const getLocalIPv4 = () => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};

const getBaseURL = () => {
  const ip = getLocalIPv4();
  return `http://${ip}:3000`;
};

export default getBaseURL;
