import { JoyConLeft, JoyConRight } from "./joycon.js";

const connectedJoyCons = new Map();

const connectJoyCon = () => {
  // Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
  const filters = [
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2006 // Joy-Con Left
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2007 // Joy-Con Right
    }
  ];
  // Prompt user to select a Joy-Con device.
  try {
    navigator.hid
      .requestDevice({ filters })
      .then((devices) => {
        const device = devices[0];
        connectDevice(device).then((joycon) => {
          connectedJoyCons.set(device.productId, joycon);
        });
      })
      .catch((error) => {
        console.log(`ERROR: ${error.message}`);
        return;
      });
  } catch (error) {
    console.error(error.name, error.message);
  }
};

const connectDevice = (device) => {
  let joyCon;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    joyCon = new JoyConRight(device);
  }
  const chain = joyCon.open().then(() => {
    joyCon.enableStandardFullMode().then(() => {
      joyCon.enableIMUMode();
    });
  });

  return chain.then(() => {
    return new Promise((resolve) => {
      resolve(joyCon);
    });
  });
};

export { connectJoyCon, connectedJoyCons, JoyConLeft, JoyConRight };
