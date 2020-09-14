import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
// import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// import DeleteIcon from "@material-ui/icons/Delete";
// import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { CSVLink } from "react-csv";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  callDetailsAPI,
  callDetailsByNameAPI,
  updateShipDate,
  updateShipTo,
  callDetailsStatsAPI,
} from "../services/services";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: "acct_doc_header_id",
    numeric: true,
    disablePadding: false,
    label: "Account ID",
  },
  {
    id: "document_number",
    numeric: true,
    disablePadding: false,
    label: "Document Number",
  },
  {
    id: "business_code",
    numeric: false,
    disablePadding: false,
    label: "Business Code",
  },
  {
    id: "doctype",
    numeric: false,
    disablePadding: false,
    label: "Document Type",
  },
  {
    id: "fk_customer_map_id",
    numeric: true,
    disablePadding: false,
    label: "Customer Map ID",
  },
  {
    id: "document_create_date",
    numeric: false,
    disablePadding: false,
    label: "Document Create Date",
  },
  {
    id: "baseline_create_date",
    numeric: false,
    disablePadding: false,
    label: "Baseline Date",
  },
  {
    id: "invoice_date_norm",
    numeric: false,
    disablePadding: false,
    label: "Invoice Date",
  },
  {
    id: "invoice_id",
    numeric: true,
    disablePadding: false,
    label: "Invoice ID",
  },
  {
    id: "total_open_amount",
    numeric: true,
    disablePadding: false,
    label: "Total Open Amount",
  },
  {
    id: "cust_payment_terms",
    numeric: true,
    disablePadding: false,
    label: "Customer Payment Terms",
  },
  {
    id: "clearing_date",
    numeric: false,
    disablePadding: false,
    label: "Clear Date",
  },
  {
    id: "isOpen",
    numeric: true,
    disablePadding: false,
    label: "Is Open Invoice",
  },
  {
    id: "ship_date",
    numeric: false,
    disablePadding: false,
    label: "Shipping Date",
  },
  {
    id: "ship_to",
    numeric: false,
    disablePadding: false,
    label: "Ship To",
  },
  {
    id: "paid_amount",
    numeric: true,
    disablePadding: false,
    label: "Payment Amount",
  },
  {
    id: "dayspast_due",
    numeric: true,
    disablePadding: false,
    label: "Days past Due date",
  },
  { id: "document_id", numeric: true, disablePadding: false, label: "Doc Id" },
  {
    id: "document_creation_date",
    numeric: false,
    disablePadding: false,
    label: "Document Create Date",
  },
  {
    id: "actual_open_amount",
    numeric: true,
    disablePadding: false,
    label: "Actual Amount Outstanding",
  },
  {
    id: "invoice_age",
    numeric: true,
    disablePadding: false,
    label: "Age of Invoice",
  },
  {
    id: "invoice_amount_doc_currency",
    numeric: true,
    disablePadding: false,
    label: "Invoice Currency",
  },
];

class DetailsTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      // onExportAllClick,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            (row) => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

DetailsTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  // onExportAllClick: PropTypes.func.isRequired,
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: "1 1 40%",
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: "0 0 auto",
  },
  button: {
    margin: theme.spacing.unit,
  },
});

let DetailsTableToolbar = (props) => {
  const {
    numSelected,
    onExportAllClick,
    dataToDownload,
    isModalOpen,
    modalOpen,
    modalClose,
    headerList,
    selectedRow,
    openAmount,
    openInvoice,
    ToChange,
    DateChange,
    send,
    classes,
  } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography>
            {numSelected === 1 ? (
              <Button
                variant="contained"
                color="primary"
                // disabled= {numSelected === 1 ? "false" : "true"}
                // disabled= "false"
                className={classes.button}
                onClick={modalOpen}
                autoid="modify-button"
              >
                MODIFY
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled
                className={classes.button}
                onClick={modalOpen}
                autoid="modify-button"
              >
                MODIFY
              </Button>
            )}
            <Dialog
              open={isModalOpen}
              onClose={modalClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Modify</DialogTitle>
              <DialogContent>
                <Typography>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="shipTo"
                    label="Ship To"
                    type="text"
                    paddingRight="5vw"
                    fullWidth
                    style={{ align: "center" }}
                    onChange={DateChange}
                    autoid="open-amount-input"
                  />
                </Typography>

                <Typography>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="shipDate"
                    label="Ship Date"
                    type="date"
                    paddingRight="5vw"
                    fullWidth
                    style={{ align: "center" }}
                    onChange={ToChange}
                    autoid="doctype-input"
                  />
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={modalClose} color="primary" autoid="modify-cancel-button">
                  CANCEL
                </Button>
                <Button onClick={send} color="primary" autoid="modify-save-button">
                  SAVE
                </Button>
              </DialogActions>
            </Dialog>

            <CSVLink
              data={dataToDownload}
              headers={headerList}
              filename="1704147_exportedData.csv"
              className="hidden"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={onExportAllClick}
                autoid="export-button"
              >
                EXPORT
              </Button>
            </CSVLink>
          </Typography>
        ) : (
          <Typography>
            <Button variant="contained" disabled className={classes.button} autoid="modify-button">
              MODIFY
            </Button>
            <Button variant="contained" disabled className={classes.button} autoid="export-button">
              EXPORT
            </Button>
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Grid container spacing={24}>
          <Grid
            item
            xs
            style={{
              textAlign: "left",
              color: "#FFFFFFA6",
              //   borderStyle: "solid",
              //   borderRight: "2px",
              //   borderColor: "FFFFFFA6"
            }}
          >
            <Typography style={{ fontSize: "4.5vh", fontWeight: "4vh " }} autoid="total-open-amount-customer">
              {openAmount}
            </Typography>
            <Typography>Total Open Amount</Typography>
          </Grid>
          <Grid
            item
            xs
            style={{
              textAlign: "left",
              color: "#FFFFFFA6",
              borderRight: "#FFFFFFA6",
            }}
          >
            <Typography style={{ fontSize: "4.5vh", fontWeight: "4vh " }} autoid="total-open-invoices-customer">
              {openInvoice}
            </Typography>
            <Typography>Total Open Invoice</Typography>
          </Grid>
          <Grid
            item
            xs
            style={{
              textAlign: "left",
              color: "#FFFFFFA6",
              borderRight: "#FFFFFFA6",
              paddingRight: "2vw",
            }}
          >
            <Typography style={{ fontSize: "4.5vh", fontWeight: "4vh " }}>
              $12.1M
            </Typography>
            <Typography>Predicted Amount</Typography>
          </Grid>
        </Grid>
      </div>
    </Toolbar>
  );
};

DetailsTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

DetailsTableToolbar = withStyles(toolbarStyles)(DetailsTableToolbar);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
  },
});

class DetailsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      custProp: this.props.custsearch,
      order: "asc",
      orderBy: "pk_id",
      selected: [],
      page: 0,
      rowsPerPage: 8,
      //   customerData: this.props.state.customerData,
      customerData: [],
      customerStats: [],
      dataToDownload: [],
      customerName: "",
      customerNumber: "",
      openAmount: this.props.totalOpenAmount,
      openInvoice: this.props.isOpen,
      modalOpen: false,
      headers: [
        { label: "Account ID", key: "acct_doc_header_id" },
        { label: "Customer Name", key: "customer_name" },
        { label: "Customer Number", key: "customer_number" },
        { label: "Document Number", key: "document_number" },
        { label: "Business Code", key: "business_code" },
        { label: "Document Type", key: "doctype" },
        { label: "Customer Map ID", key: "fk_customer_map_id" },
        { label: "Document Create Date", key: "document_create_date" },
        { label: "Baseline Date", key: "baseline_create_date" },
        { label: "Invoice Date", key: "invoice_date_norm" },
        { label: "Invoice ID", key: "invoice_id" },
        { label: "Total Open Amount", key: "total_open_amount" },
        { label: "Customer Payment Terms", key: "cust_payment_terms" },
        { label: "Clear Date", key: "clearing_date" },
        { label: "Is Open Invoice", key: "isOpen" },
        { label: "Shipping Date", key: "ship_date" },
        { label: "Ship To", key: "ship_to" },
        { label: "Payment Amount", key: "paid_amount" },
        { label: "Days past Due date", key: "dayspast_due" },
        { label: "Doc Id", key: "document_id" },
        { label: "Document Create Date", key: "document_creation_date" },
        { label: "Actual Amount Outstanding", key: "actual_open_amount" },
        { label: "Age of Invoice", key: "invoice_age" },
        { label: "Invoice Currency", key: "invoice_amount_doc_currency" },
      ],
      toInput: "",
      dateInput:"",
    };
    this.handleToChange = this.handleToChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.sendPress = this.sendPress.bind(this);
  }

  handleToChange(e) {
    this.setState({ toInput: e.target.value });
  }

  handleDateChange(e) {
    this.setState({ dateInput: e.target.value });
  }

  sendPress(e) {
      console.log("post: ", e.target.value);
      updateShipTo(this.state.toInput, this.state.selected);
      updateShipTo(this.state.dateInput, this.state.selected);
      this.setState({ modalOpen: false });    
  }

  handleLoadDataFromNumber = (s) => {
    callDetailsByNameAPI(s)
      .then((response) => {
        this.setState({
          customerData: response.data,
          customerNumber: response.data[0].customer_number,
          customerName: response.data[0].customer_name,
        });
      })
    // console.log("response data:", this.state.customerData);
    // this.handleLoadTableStats(num);
  };

  handleLoadDataFromName = (s) => {
    callDetailsAPI(s)
      .then((response) => {
        this.setState({
          customerData: response.data,
          customerNumber: response.data[0].customer_number,
          customerName: response.data[0].customer_name,
        });
      })
    // console.log("response data:", this.state.customerData);
    // this.handleLoadTableStats(num);
  };

  // handleLoadTableStats = (s) => {
  //   callDetailsStatsAPI(s).then((response) => {
  //     this.setState({
  //       customerStats: response.data,
  //       openAmount: response.data[0].total_open_amount,
  //       openInvoice: response.data[0].isOpen,
  //     });
  //   });
  //   console.log("stat data:", this.state.customerStats);
  // };

  async componentDidMount() {
    if (!isNaN(this.props.custsearch)) {
      this.handleLoadDataFromName(this.props.custsearch);
    } else if (isNaN(this.props.custSearch)) {
      this.handleLoadDataFromNumber(this.props.custsearch);
    }
    // this.handleLoadTableStats(219001);
  }

  //   componentDidUpdate(){
  // this.handleLoadTableStats(219001);
  //   }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      this.setState((state) => ({
        selected: state.customerData.map((n) => n.pk_id),
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleExportAllClick = (event) => {
    console.log("Export: ", this.state.customerData);
    let s= this.state.selected;
    for(var i=0;i<this.state.customerData.length; i++){
      if(s.indexOf(i)===false){
        this.state.dataToDownload.push(this.state.customerData[i])
      }
    }
  };

  handleModalClickOpen = (e) => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = (e) => {
    this.setState({ modalOpen: false });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  render() {
    // console.log("Table Data", this.props);
    const { classes } = this.props;
    const {
      customerData,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
    } = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, customerData.length - page * rowsPerPage);

    // console.log("table state: ", this.state.custProp);
    // console.log("table props: ", this.props.custsearch);
    return (
      <Paper className={classes.root}>
        <DetailsTableToolbar
          numSelected={selected.length}
          onExportAllClick={this.handleExportAllClick}
          dataToDownload={this.state.customerData}
          // dataToDownload={this.state.dataToDownload}
          headerList={this.state.headers}
          modalOpen={this.handleModalClickOpen}
          modalClose={this.handleModalClose}
          isModalOpen={this.state.modalOpen}
          selectedRow={this.state.selected}
          openAmount={this.state.openAmount}
          openInvoice={this.state.openInvoice}
          ToChange={this.handleToChange}
          DateChange={this.handleDateChange}
          send={this.sendPress}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle" autoid="invoice-table-customer">
            <DetailsTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={customerData.length}
            />
            <TableBody>
              {stableSort(customerData, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n) => {
                  const isSelected = this.isSelected(n.pk_id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => this.handleClick(event, n.pk_id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="right">
                        {n.acct_doc_header_id}
                      </TableCell>
                      <TableCell align="right">{n.document_number}</TableCell>
                      <TableCell align="right">{n.business_code}</TableCell>
                      <TableCell align="right">{n.doctype}</TableCell>
                      <TableCell align="right">
                        {n.fk_customer_map_id}
                      </TableCell>
                      <TableCell align="right">
                        {n.document_create_date}
                      </TableCell>
                      <TableCell align="right">
                        {n.baseline_create_date}
                      </TableCell>
                      <TableCell align="right">{n.invoice_date_norm}</TableCell>
                      <TableCell align="right">{n.invoice_id}</TableCell>
                      <TableCell align="right">{n.total_open_amount}</TableCell>
                      <TableCell align="right">
                        {n.cust_payment_terms}
                      </TableCell>
                      <TableCell align="right">{n.clearing_date}</TableCell>
                      <TableCell align="right">{n.isOpen}</TableCell>
                      <TableCell align="right">{n.ship_date}</TableCell>
                      <TableCell align="right">{n.ship_to}</TableCell>
                      <TableCell align="right">{n.paid_amount}</TableCell>
                      <TableCell align="right">{n.dayspast_due}</TableCell>
                      <TableCell align="right">{n.document_id}</TableCell>
                      <TableCell align="right">
                        {n.document_creation_date}
                      </TableCell>
                      <TableCell align="right">
                        {n.actual_open_amount}
                      </TableCell>
                      <TableCell align="right">{n.invoice_age}</TableCell>
                      <TableCell align="right">
                        {n.invoice_amount_doc_currency}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
                autoid="invoice-table-pagination-customer"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customerData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

DetailsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailsTable);
