const axios = require("axios");

exports.main = async (context = {}) => {
  if (!context.body) {
    throw new Error("Body is missing from request");
  }

  const METERS_OBJECT_ID = "2-132015735";
  const DEALS_OBJECT_ID = "0-3";

  const signature = context.headers?.["x-hubspot-signature-v3"];
  const timestamp = context.headers?.["x-hubspot-request-timestamp"];

  if (!signature || !timestamp) {
    return { statusCode: 401, body: { error: "Unauthorized" } };
  }

  const url = `https://api.hubapi.com/crm/v4/associations/${DEALS_OBJECT_ID}/${METERS_OBJECT_ID}/batch/archive`;

  const token = process.env.HS_ACCESS_TOKEN;

  const { objectId, meterIds } = context.body;

  console.log("Object ID", objectId, typeof objectId);
  console.log("Meters", meterIds);

  try {
    const meterInputs = meterIds.map((meter) => {
      console.log("--- meter ---");
      console.log(meter);
      const meterIdStr = meter.id;
      return { id: meterIdStr };
    });

    const inputs = [
      {
        from: objectId,
        to: meterInputs,
      },
    ];

    await axios(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        inputs,
      },
    });
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
};
