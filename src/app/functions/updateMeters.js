const axios = require("axios");

exports.main = async (context = {}) => {
  if (!context.body) {
    throw new Error("Body is missing from request");
  }

  const METERS_OBJECT_ID = "2-132015735";

  const signature = context.headers?.["x-hubspot-signature-v3"];
  const timestamp = context.headers?.["x-hubspot-request-timestamp"];

  if (!signature || !timestamp) {
    return { statusCode: 401, body: { error: "Unauthorized" } };
  }

  const url = `https://api.hubapi.com/crm/v3/objects/${METERS_OBJECT_ID}/batch/update`;

  const token = process.env.HS_ACCESS_TOKEN;

  try {
    const inputs = context.body.map((meter) => {
      return {
        id: meter.id,
        properties: {
          mpxn: meter.properties.mpxn,
          supply_start_date: meter.properties.supply_start_date,
          supply_end_date: meter.properties.supply_end_date,
        },
      };
    });

    const updatedMeterData = await axios(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        inputs,
      },
    });

    return updatedMeterData.data;
  } catch (error) {
    console.error(error);
  }
};
