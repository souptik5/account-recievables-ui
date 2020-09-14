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
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";

// import theme, { pxToVh } from "../utils/theme";
import { callCustomerAPI } from "../services/services";
import Button from "@material-ui/core/Button";

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
    id: "company_id",
    numeric: true,
    disablePadding: true,
    label: "Company ID",
  },
  {
    id: "acct_doc_header_id",
    numeric: true,
    disablePadding: false,
    label: "Account Header ID",
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
    id: "customer_number",
    numeric: true,
    disablePadding: false,
    label: "Customer Number",
  },
  {
    id: "fk_customer_map_id",
    numeric: true,
    disablePadding: false,
    label: "Customer Map ID",
  },
  {
    id: "customer_name",
    numeric: false,
    disablePadding: false,
    label: "Name Of Customer",
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
  {
    id: "predicted_payment_type",
    numeric: false,
    disablePadding: false,
    label: "Predicted Payment Type",
  },
  {
    id: "predicted_amount",
    numeric: false,
    disablePadding: false,
    label: "Predicted Amount",
  },
];

class EnhancedTableHead extends React.Component {
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: "0 0 auto",
  },
  mainBackground: {
    background: theme.palette.primary.dark,
  },
});

let EnhancedTableToolbar = (props) => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Invoices
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Predict">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              autoid="predict-button"
            >
              Predict
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Predict">
          <div><Button disabled>Predict</Button></div>
          </Tooltip>
          
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    // backgroundColor: "transparent",
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
    // overflowY: "auto",
  },
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "pk_id",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      customerData: [],
      predicted_payment_type: [],
      predicted_amount: [],
    };
  }

  handleLoadCustomers = () => {
    callCustomerAPI().then((response) => {
      this.setState({
        customerData: response.data,
      });
    });
  };

  async componentWillMount() {
    this.handleLoadCustomers();
  }

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
    // console.log("customer: ", this.state.customerData);
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

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
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
                      key={n.pk_id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="right">{n.company_id}</TableCell>
                      <TableCell align="right">
                        {n.acct_doc_header_id}
                      </TableCell>
                      <TableCell align="right">{n.document_number}</TableCell>
                      <TableCell align="right">{n.business_code}</TableCell>
                      <TableCell align="right">{n.doctype}</TableCell>
                      <TableCell align="right">{n.customer_number}</TableCell>
                      <TableCell align="right">
                        {n.fk_customer_map_id}
                      </TableCell>
                      <TableCell align="right">{n.customer_name}</TableCell>
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
                      <TableCell align="right">
                        {n.predicted_payment_type}
                      </TableCell>
                      <TableCell align="right">{n.predicted_amount}</TableCell>
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
          autoid="invoice-table-pagination-collector"
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
