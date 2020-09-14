import React, { Component } from "react";
import Highcharts from "highcharts";
import crossfilter from "crossfilter2";

import { callCustomerAPI } from "../services/services";
// import theme, { pxToVh } from "../utils/theme";

import {
  HighchartsChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  Title,
  Subtitle,
  Legend,
  BarSeries,
} from "react-jsx-highcharts";
import { withStyles } from "@material-ui/core";

// const styles = (theme) => ({
//   mainBackground: {
//     backgroundColor: theme.palette.primary.main,
//   },
// });

class AnalyticsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      categories: [],
      data: [],
      graphData:[],
    };
  }

  handleLoadData = () => {
    callCustomerAPI().then((response) => {
      // });
      this.setState({
        customerData: response.data,
      });
    });
  };

  handlecrossfilter() {
    var data = crossfilter(this.state.customerData);

    //create dimensions
    var company_idDim = data.dimension((d) => d.customer_name);
    var total_open_amountGroup = company_idDim
      .group()
      .reduceSum((d) => d.total_open_amount);
    var tempObj1 = this.prepareDataForCharts(total_open_amountGroup);
    console.log("crossfilter: ", tempObj1);
    console.log("cross", tempObj1.categories, tempObj1.data);
    
    // this.setValues(tempObj1.categories, tempObj1.data);
    return tempObj1;
  }

  setValues(categories, data){
      this.setState({
          categories: categories,
          data: data
      })
  }

  prepareDataForCharts(groups) {
    var categories = [];
    var data = [];
    var gdata = groups.top(4);
    gdata.forEach((d) => {
      categories.push(d.key);
      data.push(d.value);
    });
    // this.setState({
    //   categories: categories,
    //   data: data,
    // });
    return {
      categories: categories,
      data: data,
    };
  }

  componentDidMount() {
    this.handleLoadData();
    // this.setState({
    //     graphData: val,
    // })
  }
  // componentDidUpdate(){
    // const val= this.handlecrossfilter();
    // this.setState({
    //     graphData: val,
    // })
  // }

  render() {
    // console.log("chart props:",this.state.customerData);
    this.handlecrossfilter();
    // this.handleLoadData();
    return (
      <HighchartsChart>
        <Chart height={202} width={483} backgroundColor="transparent"
        style={{
            color: "#FFFFFF", 
        }}/>

        <Title style={{
            color: "#FFFFFF",
            fontFamily: "Roboto"
        }} align="left">Total Amount by Company Code</Title>
        <XAxis lables="false" categories={['USA', 'CAN', 'IND', 'UK']} />

        <YAxis gridLineColor="#00000" labels="false">
          <BarSeries data={[2, 1, 3, 4]} />
        </YAxis>
      </HighchartsChart>
    );
  } //['USA', 'CAN', 'IND', 'UK']   this.state.graphData.categories
} //[2, 1, 3, 4]   this.state.graphData.data

// Remember to inject Highcharts to component
export default withHighcharts(AnalyticsChart, Highcharts);
