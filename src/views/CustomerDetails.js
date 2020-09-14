import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, Button } from "@material-ui/core";

import voiceIcon from "../assets/voiceIcon.svg";
import Footer from "../components/Footer";
import Fab from "@material-ui/core/Fab";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import { Redirect } from "react-router-dom";
import {
  callDetailsAPI,
  callDetailsByNameAPI,
  callDetailsStatsAPI,
} from "../services/services";
import DetailsTable from "../components/DetailsTable";
import Professor from "../components/Professor";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: "1vw",
    paddingRight: "1vw",
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
    marginRight: theme.spacing.unit * -1,
  },
  textStyle1: {
    color: "#FFFFFFA6",
    fontSize: "2.1vw",
    // marginTop: "1vh",
  },
  textStyle2: {
    color: "white",
    fontSize: "1vw",
    // marginTop: "2vh",
  },
  textStyle3: {
    color: "#FFFFFFA6",
    marginTop: "-2.7vh",
    marginLeft: "4.7vw",
  },
  fab: {
    margin: theme.spacing.unit * 1.1,
  },
});

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: this.props.location.state.custsearch,
      // customerData: [],
      totalOpenAmount: "$980K",
      isOpen: "1323",
      customerNumber: "",
      customerName: "",
      redirect: false,
      loading: false,
      toggle: false,
      gridxs: 12,
    };
    this.handleNavigation = this.handleNavigation.bind(this);
    this.toggleProfessor = this.toggleProfessor.bind(this);
  }

  handleNavigation(e) {
    // put the login here
    this.setState({
      redirect: true,
      loading: false,
    });
  }

  toggleProfessor(e) {
    if (this.state.toggle === false) {
      this.setState({
        toggle: true,
        gridxs: 9,
      });
    } else if (this.state.toggle === true) {
      this.setState({
        toggle: false,
        gridxs: 12,
      });
    }
  }

  handleLoadDataFromNumber = (s) => {
    callDetailsByNameAPI(s).then((response) => {
      this.setState({
        // customerData: response.data,
        customerNumber: response.data[0].customer_number,
        customerName: response.data[0].customer_name,
      });
    });
  };

  handleLoadDataFromName = (s) => {
    callDetailsAPI(s).then((response) => {
      this.setState({
        // customerData: response.data,
        customerNumber: response.data[0].customer_number,
        customerName: response.data[0].customer_name,
      });
    });
  };

  handleLoadStats = (s) => {
    callDetailsStatsAPI(s).then((response) => {
      this.setState({
        // customerData: response.data,
        totalOpenAmount: response.data[0].total_open_amount,
        isOpen: response.data[0].isOpen,
      });
    });
  };

  async componentWillMount() {
    if (!isNaN(this.state.searchTerm)) {
      console.log("in number:", this.state.searchTerm);
      await this.handleLoadDataFromName(this.state.searchTerm);
    } else if (isNaN(this.state.searchTerm)) {
      console.log("in not number:", this.state.searchTerm);
      await this.handleLoadDataFromNumber(this.state.searchTerm);
    }
  }

  render() {
    console.log("Data", this.props);
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Grid container spacing={24}>
              <Grid item xs>
                <div>
                  <Typography className={classes.textStyle1} autoid="customer-name">
                    <Fab
                      color="primary"
                      aria-label="Add"
                      className={classes.fab}
                      onClick={this.handleNavigation}
                      autoid="navigation-back-button"
                    >
                      <ArrowBackOutlinedIcon />
                    </Fab>

                    {this.state.customerName}
                    <Typography className={classes.textStyle3} autoid="customer-number">
                      {this.state.customerNumber}
                    </Typography>
                  </Typography>
                </div>
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
                  Customer Details
                </Typography>
              </Grid>
              <Grid item xs align="right">
                <Button
                  className={classes.button}
                  onClick={this.toggleProfessor}
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
          <Grid item xs={this.state.gridxs}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "center",
                height: "78vh",
                borderRadius: "0.7vh",
                backgroundColor: "#252C48",
                marginBottom: "3vh",
              }}
              // className={classes.root}
            >
              <DetailsTable
                custsearch={this.state.searchTerm}
                totalOpenAmount={this.state.totalOpenAmount}
                isOpen={this.state.isOpen}
              />
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
                  height: "82vh",
                  margin: "-10vh"
                  // borderRadius: "0.7vh",
                  // backgroundColor: "#252C48",
                  // marginBottom: "-1vh",
                }}
              >
              <Professor/>
              </div>
            </Grid>
          )}
        </Grid>
        {this.state.redirect === true && (
          <Redirect
            to={{
              pathname: "/customer-dashboard",
            }}
          />
        )}
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CustomerDetails);
