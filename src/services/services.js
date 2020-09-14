import axios from "axios";
import { SERVER_URL, ROLL_NUMBER, PROFESSOR_URL } from "../utils/constants";

export function serviceCall() {
  return axios.post(`${SERVER_URL}`);
}

export async function callDetailsAPI(customerNumber) {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/customerdetails`,
    {
      params: { customerNumber: customerNumber },
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function callDetailsByNameAPI(customerName) {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/customerdetailsbyname`,
    {
      params: { customerName: customerName },
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function callDetailsStatsAPI(customerNumber) {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/fetchdetailsstats`,
    {
      params: { customerNumber: customerNumber },
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function callCustomerAPI() {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/dummy.do`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function callStats() {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/fetchstats`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function callSearchAPI() {
  return await axios.get(
    `${SERVER_URL}${ROLL_NUMBER}/searchcustomers`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function professorCall(message) {
  return await axios.post(`${PROFESSOR_URL}chat`, {
    data: {
      message: message,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShipTo(shipTo, id) {
  return await axios.post(`${SERVER_URL}${ROLL_NUMBER}/updatetableshipto`, {
    params: {
      shipTo: shipTo,
      pk_id: id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShipDate(shipDate, id) {
  return await axios.post(`${SERVER_URL}${ROLL_NUMBER}/updatetableshipdate`, {
    params: {
      shipDate: shipDate,
      pk_id: id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function prediction(data) {
  return axios.post(
    "http://127.0.0.1:5000/predict?",
    {},
    {
      headers: { "Content-Type": "application/json" },
      params: {
        data: data,
      },
    }
  );
}
