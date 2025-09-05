const axios = require("axios");

exports.main = async (context = {}) => {
  const METER_PROPERTIES = ["mpxn", "supply_start_date", "supply_end_date"];
  const METERS_OBJECT_ID = "2-132015735";

  const signature = context.headers?.["x-hubspot-signature-v3"];
  const timestamp = context.headers?.["x-hubspot-request-timestamp"];

  if (!signature || !timestamp) {
    return { statusCode: 401, body: { error: "Unauthorized" } };
  }

  const token = process.env.HS_ACCESS_TOKEN;
  const dealId = context.body.dealId;

  console.log("Token = ", token);

  if (!dealId) {
    throw new Error("Deal ID is required");
  }

  const getAssociatedMeterIds = async () => {
    const url = `https://api.hubapi.com/crm/v4/objects/0-3/${dealId}/associations/${METERS_OBJECT_ID}`;

    const meters = await axios(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const metersIds = meters.data.results.map((meter) => {
      return { id: meter.toObjectId };
    });

    return metersIds;
  };

  const fetchMeters = async (metersIds) => {
    try {
      const url = `https://api.hubapi.com/crm/v3/objects/${METERS_OBJECT_ID}/batch/read`;
      const body = {
        inputs: metersIds,
        properties: METER_PROPERTIES,
      };

      const meters = await axios(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: body,
      });

      return meters.data.results;
    } catch (error) {
      console.error(error);
    }
  };

  const meterIds = await getAssociatedMeterIds();
  const meters = await fetchMeters(meterIds);

  return meters;
};
