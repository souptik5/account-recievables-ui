import React, { Component } from "react";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { withStyles } from "@material-ui/core/styles";
import { callCustomerAPI } from "../services/services";

const styles = (theme) => ({
  chart: {
    height: "150px",
    position: "relative",
    // overflowY: 'auto',
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    color: theme.palette.secondary.grey,
  },
});

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: [],
      totalOpenAmount: [],
    };
  }

  async componentWillMount() {
    const response = await callCustomerAPI();
    var companyCode = [];
    var totalOpenAmount = [];
    for (var i = 0; i < response.data.length; i++) {
      companyCode.push(response.data[i].business_code);
      totalOpenAmount.push(Math.round(response.data[i].total_open_amount, 2));
    }
    this.setState({
      companyCode: companyCode,
      totalOpenAmount: totalOpenAmount,
    });
  }

  filterInvoice = (filteredPoints) => {
    this.props.filterInvoice({ filteredPoints });
  };

  render() {
    const { classes } = this.props;
    const { companyCode, totalOpenAmount } = this.state;

    const filter = (filteredPoints) => {
      console.log(this.props);
      this.filterInvoice(filteredPoints);
    };
    const options = {
      chart: {
        type: "bar",
        backgroundColor: "#252c48",
        colors: ["#747b95", "#5daae0"],
        scrollablePlotArea: {
          minHeight: 1800,
        },
        width: 400,
      },
      title: {
        text: "Total Amount By Company Code",
        style: { color: "#747b95" },
      },
      xAxis: {
        categories: companyCode,
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
      legend: {
        enabled: false,
        backgroundColor: "#747b95",
      },
      credits: {
        enabled: false,
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
          data: totalOpenAmount,
          name: "",
        },
      ],
      plotOptions: {
        series: {
          color: "#5DAAE0",
          borderWidth: 0,
          pointWidth: 30,
          pointPadding: 0.25,
          point: {
            events: {
              click: function () {
                this.select(null, false);
                var selectedPoint = this.series.chart.getSelectedPoints();
                var filteredPoints = [];
                console.log(selectedPoint);
                for (var i = 0; i < selectedPoint.length; i++) {
                  filteredPoints = selectedPoint[i].category;
                }
                console.log(filteredPoints);
                filter(filteredPoints);
              },
            },
          },
        },
      },
    };
    return (
      <div className={classes.chart} autoid="companycode-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    invoiceList: state.reducers.invoiceList,
    columns: state.reducers.columns,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    filterInvoice: (payload) =>
      dispatch({ type: "FILTER_INVOICE", payload: payload }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Analytics));
