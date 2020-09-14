import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import crossfilter from "crossfilter2";
import { prepareDataForHighcharts, formatter } from "../utils/formatter";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { updateInvoice } from "../actions/updateInvoice";
import { setTotalCustomer } from "../actions/setTotalCustomer";
import { setAverageDayDelay } from "../actions/setAverageDayDelay";
import { setTotalOpenInvoice } from "../actions/setTotalOpenInvoice";
import { setTotalOpenAR } from "../actions/setTotalOpenAR";
const style = (theme) => {};
class Chart extends Component {
  state = {
    invoices: [],
    isFetching: true,
  };

  render() {
    const {
      invoices,
      updateInvoice,
      setTotalCustomer,
      setTotalOpenAR,
      setTotalOpenInvoice,
      setAverageDayDelay,
    } = this.props;
    console.log("invoices", invoices);
    const invoiceData = crossfilter(invoices);
    const buisnessCodeDim = invoiceData.dimension((d) => d.businessCode);
    const totalAmountGroup = buisnessCodeDim
      .group()
      .reduceSum((d) => d.totalOpenAmount);
    const customerNumberDim = invoiceData.dimension((d) => d.customerNumber);
    const custNumberGroup = customerNumberDim.group().reduceCount().all();
    // const totalOpenAmountGroup = customerNumberDim.group().reduceSum(d => d.totalOpenAmount).all()
    const buisnessCode = prepareDataForHighcharts(totalAmountGroup);
    console.log("buisness", buisnessCode);
    var options = {
      chart: {
        type: "bar",
        height: 200,
        scrollablePlotArea: {
          minHeight: 1800,
        },
        backgroundColor: "#252c48",
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "Total Amount by Company Code",
        style: {
          color: "#747b95",
        },
      },
      yAxis: {
        gridLineWidth: 0,
        labels: {
          style: {
            display: "none",
          },
        },
        title: false,
      },
      plotOptions: {
        series: {
          color: "#5DAAE0",
          borderWidth: 0,
          pointWidth: 30,
          pointPadding: 0.25,
          point: {
            events: {
              click: function () {
                this.select(null, true);
                var selectedPoints = this.series.chart.getSelectedPoints();
                console.log("selected-points", selectedPoints);
                var filteredPoints = [];
                selectedPoints.map((point) => {
                  return filteredPoints.push(point.category);
                });
                console.log("filtered-points", filteredPoints);
                function mutliValueFilter(values) {
                  return function (v) {
                    return values.indexOf(v) !== -1;
                  };
                }
                if (filteredPoints.length > 0) {
                  buisnessCodeDim.filterFunction(
                    mutliValueFilter(filteredPoints)
                  );
                } else {
                  buisnessCodeDim.filterAll();
                }
                const data = invoiceData.allFiltered();
                updateInvoice(data);
                var countCustomers = 0;
                custNumberGroup.map((row) => {
                  if (row.value !== 0) {
                    countCustomers += 1;
                  }
                });
                var totalOpenAmount = 0;
                var averageDaysDelay = 0;
                var totalOpenInvoices = 0;
                data.map((row) => {
                  totalOpenAmount += row.totalOpenAmount;
                  averageDaysDelay += row.daysPastDue;
                  totalOpenInvoices += row.isOpen;
                });
                averageDaysDelay = averageDaysDelay / data.length;
                const tileData = {
                  totalCustomer: countCustomers,
                  totalOpenAmount: "$" + formatter(totalOpenAmount),
                  averageDaysDelay: Math.ceil(averageDaysDelay) + " Days",
                  totalOpenInvoices,
                };
                setTotalCustomer(tileData.totalCustomer);
                setAverageDayDelay(tileData.averageDaysDelay);
                setTotalOpenAR(tileData.totalOpenAmount);
                setTotalOpenInvoice(tileData.totalOpenInvoices);
              },
            },
          },
        },
      },
      xAxis: {
        categories: buisnessCode.categories,
        labels: {
          style: {
            color: "#cfd6e3",
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
      series: [
        {
          data: buisnessCode.data,
          showInLegend: false,
        },
      ],
    };
    console.log("chart-prop", this.props);
    return (
      <div
        autoid="companycode-chart"
        style={{
          height: "200px",
          position: "relative",
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

const getStates = (state) => {
  return { invoices: state.invoices };
};

export default connect(getStates, {
  updateInvoice,
  setTotalCustomer,
  setTotalOpenAR,
  setTotalOpenInvoice,
  setAverageDayDelay,
})(withStyles(style, { withTheme: true })(Chart));
