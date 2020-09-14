import React, { Component } from "react";
import theme, { pxToVh } from "../utils/theme";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Footer from "../components/Footer";
import { Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { InputBase, TextField, OutlinedInput, Button } from "@material-ui/core";
import { callStats, callCustomerAPI } from "../services/services";
import formatter from "../utils/formatter";
import EnhancedTable from "../components/EnhancedTable";
import AnalyticsChart from "../components/AnalyticsChart";
// import Analytics from "../components/Analytics";
import SearchTable from "../components/SearchTable";
import Professor from "../components/Professor";

import voiceIcon from "../assets/voiceIcon.svg";
import companyLogo from "../assets/companyLogo.svg";
import { findByTestId } from "@testing-library/react";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: "1vw",
    paddingRight: "1vw",
    // backgroundColor: theme.palette.primary.main
  },
  textStyle1: {
    color: "white",
    fontSize: "2.5vw",
    marginTop: "1vh",
  },
  textStyle2: {
    color: "white",
    fontSize: "1vw",
    // marginTop: "2vh",
  },
  hellotext1: {
    fontSize: "1.2vw",
    // marginTop: "1.5vh",
    // padding: "1vh",
    color: "#FFFFFFA6",
    // backgroundColor: '#5DAAE0',
  },
  hellotext3: {
    fontSize: "1vw",
    marginTop: "5vh",
    padding: "0.5vh",
    color: "#FFFFFF",
    backgroundColor: "#5DAAE0",
  },
  hellotext2: {
    fontSize: "3vw",
    // marginTop: "-4vh",
    // padding: "1vh",
    color: "#FFFFFF",
    // backgroundColor: '#5DAAE0',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    backgroundColor: "#fc7500",
    borderRadius: "5vw",
    maxHeight: "4vh",
    "&:hover": {
      backgroundColor: "#5daae0",
    },
  },
  rightIcon: {
    marginRight: theme.spacing.unit * -1.2,
  },
  textfield: {
    color: "#FFFFFFA6",
    fontSize: "1.5vw",
  },
  nameInput: {
    fontSize: "1vw",
    color: "#FFFFFF",
  },
  notchedOutline: { borderWidth: "1px", borderColor: "#5DAAE0 !important" },
  searchBtn: {
    marginTop: "8vh",
    minWidth: "5vw",
    minHeight: "2.188vw",
    fontSize: "0.95vw",
    border: "solid 0.75px #3B617C",
    // marginRight: '0.5rem',
    alignSelf: "center",
    color: "#5DAAE0",
    "&:hover": {
      backgroundColor: "#5daae0",
      color: "white",
    },
  },
  searchBtnDisabled: {
    minWidth: "5vw",
    minHeight: "2.188vw",
    fontSize: "0.95vw",
    border: "solid 0.75px #3B617C",
    // marginRight: '0.5rem',
    alignSelf: "center",
    color: "white !important",
    background: "#FFFFFFa5",
    "&:hover": {
      cursor: "default",
      backgroundColor: "#FFFFFFa5",
    },
    margin: {
      // margin: '2vh',
      // padding:"2vh",
    },
    cssLabel: {
      "&$cssFocused": {
        color: "rgb(93,175,240,0.5)",
      },
    },
    cssFocused: {
      color: "rgb(93,175,240,0.5)",
    },
    cssOutlinedInput: {
      "&$cssFocused $notchedOutline": {
        borderColor: "rgb(93,175,240,0.5)",
      },
    },
    input: {
      // color:"rgb(93,175,240,0.5)",
      height: 10,
    },
    notchedOutline: {},
  },
});

class CollectorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: 0,
      total_customer: "0",
      total_open_ar: "$",
      average_days_delay: "0",
      total_open_invoice: "0",
      stats: [],
      customerData: [],
      custsearch: "",
      redirect: false,
      loading: false,
      statgridxs: 3,
      tablexs: 8,
      leftxs: 4,
      toggle: false,
    };
    // this.handleNameChange = this.handleNameChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.toggleProfessor = this.toggleProfessor.bind(this);
  }

  toggleProfessor(e) {
    if (this.state.toggle === false) {
      this.setState({
        toggle: true,
        // statgridxs: 9,
        tablexs: 6,
        leftxs: 3,
      });
    } else if (this.state.toggle === true) {
      this.setState({
        toggle: false,
        // statgridxs: 12,
        tablexs: 8,
        leftxs: 4,
      });
    }
  }

  handleChange(e) {
    this.setState({ custsearch: e.target.value });
    console.log("change: ", this.state.custsearch);
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      console.log("search: ", e.target.value);
      // var index = this.state.customerData.indexOf(e.target.value);
      // var n= this.state.customerData[index].customer_number;
      this.setState({
        // custsearch: n,
        redirect: true,
        loading: false,
      });
    }
  }

  handleLoadStats = () => {
    callStats().then((response) => {
      // });
      console.log("Stat response: ", response.data);
      var ar = formatter(response.data[0].actual_open_amount);
      this.setState({
        stats: response.data,
        total_customer: response.data[0].customer_name,
        // total_open_ar: Math.trunc(response.data[0].actual_open_amount),
        total_open_ar: "$" + ar,
        average_days_delay: Math.ceil(response.data[0].dayspast_due),
        total_open_invoice: response.data[0].isOpen,
      });
      console.log("this.state.stats: ", this.state.stats);
    });
  };

  // handleLoadCustomers = () => {
  //   callCustomerAPI().then((response) => {
  //     this.setState({
  //       customerData: response.data,
  //     });
  //     console.log(this.state.customerData);
  //   });
  // };

  componentWillMount() {
    this.handleLoadStats();
    // this.handleLoadCustomers();
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container spacing={24}>
              <Grid item xs>
                <Typography className={classes.textStyle1}>
                  <img
                    src={companyLogo}
                    style={{ paddingRight: "1vh", maxHeight: "4.5vh" }}
                    alt="Company Logo"
                  />
                  ABC Products
                </Typography>
              </Grid>
              <Grid item xs align="center">
                <Typography
                  style={{
                    height: "2.9vh",
                    width: "28vh",
                    fontSize: "1.8vh",
                    backgroundColor: "#fc7500",
                    color: "white",
                    borderBottomLeftRadius: "0.7vh",
                    borderBottomRightRadius: "0.7vh",
                  }}
                >
                  Receivables Dashboard
                </Typography>
              </Grid>
              <Grid item xs align="right">
                <Button
                  className={classes.button}
                  onClick={this.toggleProfessor}
                  autoid="professor-button"
                >
                  <Typography className={classes.textStyle2}>
                    PROFESSOR
                  </Typography>
                  <img
                    src={voiceIcon}
                    className={classes.rightIcon}
                    style={{ marginLeft: "0.6vw", maxHeight: "4vh" }}
                    alt="Voice Logo"
                  />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={this.state.statgridxs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
                // margin: "2vh",
              }}
              className={classes.root}
            >
              <Typography
                className={classes.hellotext1}
                // color={theme.palette.primary.light}
                gutterBottom
              >
                Total Customer
              </Typography>
              <Typography
                className={classes.hellotext2}
                autoid="total-customers-text-collector"
              >
                {this.state.total_customer}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={this.state.statgridxs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
                // margin: "2vh",
              }}
              className={classes.root}
            >
              <Typography className={classes.hellotext1} gutterBottom>
                Total Open A/R
              </Typography>
              <Typography
                className={classes.hellotext2}
                autoid="total-open-ar-text-collector"
              >
                {this.state.total_open_ar}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={this.state.statgridxs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
                // margin: "2vh",
              }}
              className={classes.root}
            >
              <Typography className={classes.hellotext1} gutterBottom>
                Average Days Delay
              </Typography>
              <Typography
                className={classes.hellotext2}
                autoid="average-days-delay-text-collector"
              >
                {this.state.average_days_delay} Days
              </Typography>
            </div>
          </Grid>
          <Grid item xs={this.state.statgridxs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
                // margin: "2vh",
              }}
              className={classes.root}
            >
              <Typography className={classes.hellotext1} gutterBottom>
                Total Open Invoice
              </Typography>
              <Typography
                className={classes.hellotext2}
                autoid="total-open-invoice-text-collector"
              >
                {this.state.total_open_invoice}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={this.state.leftxs}>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "27.5vh",
                  borderRadius: "0.7vh",
                  backgroundColor: "#252C48",
                  marginBottom: "3vh",
                }}
                className={classes.root}
              >
                <AnalyticsChart />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "27.5vh",
                  borderRadius: "0.7vh",
                  backgroundColor: "#252C48",
                }}
              >
                <div
                  style={{
                    width: "27vw",
                    padding: "0.7vh",
                    // color: "rgb(93,175,240,0.5)",
                  }}
                >
                  <TextField
                    margin="dense"
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      },
                    }}
                    InputProps={{
                      className: classes.input,
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                        // input: classes.input,
                      },
                    }}
                    style={{
                      borderRadius: "5vh",
                    }}
                    // palceholder="Search Customers by Customer ID or Customer Name"
                    label="Search Customers by Customer ID or Customer Name"
                    variant="outlined"
                    id="custom-css-outlined-input"
                    fullWidth="true"
                    value={this.state.custsearch}
                    onKeyDown={this.keyPress}
                    onChange={this.handleChange}
                    autoid="search-text-field"
                  />
                </div>
                <SearchTable />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={this.state.tablexs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "55vh",
                marginBottom: "3.5vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
              }}
              // className={classes.root}
              autoid="invoice-table-collector"
            >
              <EnhancedTable />
            </div>
          </Grid>
          {this.state.toggle === true && (
            <Grid item xs={3}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: "82vh",
                  height: "55vh",
                  // borderRadius: "0.7vh",
                  // backgroundColor: "#252C48",
                  marginBottom: "-1vh",
                }}
              >
                <Professor />
              </div>
            </Grid>
          )}
        </Grid>
        {this.state.redirect === true && (
          <Redirect
            to={{
              pathname: "/customer-details",
              state: { custsearch: this.state.custsearch },
            }}
          />
        )}
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CollectorDashboard);
