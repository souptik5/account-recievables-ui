import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
// import TablePagination from "@material-ui/core/TablePagination";
import { AutoSizer } from "react-virtualized";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
// import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
// import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";

// import theme, { pxToVh } from "../utils/theme";
import { callSearchAPI } from "../services/services";
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
    id: "customer_number",
    numeric: true,
    disablePadding: false,
    label: "Customer Number",
  },
  {
    id: "customer_name",
    numeric: false,
    disablePadding: false,
    label: "Name Of Customer",
  },
  {
    id: "total_open_amount",
    numeric: true,
    disablePadding: false,
    label: "Total Open Amount",
  },
];

class SearchTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      // onSelectAllClick,
      order,
      orderBy,
      // numSelected,
      // rowCount,
    } = this.props;

    return (
      <TableHead>
        <TableRow style={{ height: "2vh" }}>
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

SearchTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const styles = (theme) => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing.unit * 3,
    // backgroundColor: "transparent",
  },
  table: {
    // minWidth: 100,
  },
  tableWrapper: {
    overflowX: "auto",
    // overflowY: "auto",
  },
});

class SearchTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      orderBy: "total_open_amount",
      selected: [],
      page: 0,
      rowsPerPage: 5,
      customerData: [],
      predicted_payment_type: "",
      predicted_amount: "",
    };
  }

  handleLoadCustomers = () => {
    callSearchAPI().then((response) => {
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
        selected: state.customerData.map((n) => n.customer_number),
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
    var height = "30vh";

    return (
      <Paper className={classes.root}>
        <div
          className={classes.tableWrapper}
          style={{ height: "25vh",}}
        >
          <AutoSizer>
            {({ height, width }) => (
              <Table className={classes.table} aria-labelledby="tableTitle">
                <SearchTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={customerData.length}
                />

                <TableBody>
                  {stableSort(customerData, getSorting(order, orderBy))
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)//check it
                    .map((n) => {
                      const isSelected = this.isSelected(n.customer_number);
                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            this.handleClick(event, n.customer_number)
                          }
                          //   role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.customer_number}
                          selected={isSelected}
                          style={{ height: "3vh",}}
                        >
                          <TableCell align="left">{n.customer_name}</TableCell>
                          <TableCell align="right">
                            {n.customer_number}
                          </TableCell>
                          <TableCell align="right">
                            ${Math.round(n.total_open_amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={1} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </AutoSizer>
        </div>
      </Paper>
    );
  }
}

SearchTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchTable);

