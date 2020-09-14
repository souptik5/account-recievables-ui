import { combineReducers } from "redux";
const selectedCustomerReducer = (selectedCustomer = null, action) => {
  if (action.type === "CUSTOMER_SELECTED") return action.payload;
  return selectedCustomer;
};
const loadInvoiceReducer = (invoices = [], action) => {
  if (action.type === "LOAD_INVOICES") return action.payload;
  return invoices;
};

const updateInvoiceReducer = (invoices = [], action) => {
  if (action.type === "UPDATE_INVOICES") return action.payload;
  return invoices;
};

const storeChatsReducer = (chats = [], action) => {
  if (action.type === "CHAT_MESSAGE") return [...chats, action.payload];
  return chats;
};

const setPredictedDataReducer = (predictedData = [], action) => {
  if (action.type === "SET_PREDICTED_DATA") {
    return [...predictedData, ...action.payload];
  }
  return predictedData;
};

const setAverageDayDelay = (averageDayDelay = null, action) => {
  if (action.type === "AVERAGE_DAY_DELAY") return action.payload;
  return averageDayDelay;
}

const setTotalCustomer = (totalCustomer = null, action) => {
  if (action.type === "TOTAL_CUSTOMER") { console.log("rowvaluess", action.payload); return action.payload; }
  return totalCustomer;
}
const setTotalOpenAR = (totalOpenAR = null, action) => {
  if (action.type === "TOTAL_OPEN_AR") return action.payload;
  return totalOpenAR;
}
const setTotalOpenInvoice = (totalOpenInvoice = null, action) => {
  if (action.type === "TOTAL_OPEN_INVOICE") return action.payload;
  return totalOpenInvoice;
}

export default combineReducers({
  selectedCustomer: selectedCustomerReducer,
  invoices: loadInvoiceReducer,
  chats: storeChatsReducer,
  predictedData: setPredictedDataReducer,
  totalCustomer: setTotalCustomer,
  totalOpenAR: setTotalOpenAR,
  averageDayDelay: setAverageDayDelay,
  totalOpenInvoice: setTotalOpenInvoice,
  updatedInvoices: updateInvoiceReducer
});
