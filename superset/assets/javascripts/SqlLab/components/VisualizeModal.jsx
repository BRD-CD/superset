/* global notify */
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Button, Col, Modal } from 'react-bootstrap';

import Select from 'react-select';
import { Table } from 'reactable';
import shortid from 'shortid';
import { getExploreUrl } from '../../explore/exploreUtils';
import * as actions from '../actions';
import { VISUALIZE_VALIDATION_ERRORS } from '../constants';
import { QUERY_TIMEOUT_THRESHOLD } from '../../constants';

const CHART_TYPES = [
  { value: 'dist_bar', label: '分布 - 柱形图', requiresTime: false },
  { value: 'pie', label: '饼图', requiresTime: false },
  { value: 'line', label: '时间序列 - 折线图', requiresTime: true },
  { value: 'bar', label: '时间序列 - 柱形图', requiresTime: true },
];

const propTypes = {
  actions: PropTypes.object.isRequired,
  onHide: PropTypes.func,
  query: PropTypes.object,
  show: PropTypes.bool,
  datasource: PropTypes.string,
  errorMessage: PropTypes.string,
};
const defaultProps = {
  show: false,
  query: {},
  onHide: () => {},
};

class VisualizeModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartType: CHART_TYPES[0],
      datasourceName: this.datasourceName(),
      columns: {},
      hints: [],
    };
  }
  componentDidMount() {
    this.validate();
  }
  componentWillReceiveProps(nextProps) {
    this.setStateFromProps(nextProps);
  }
  setStateFromProps(props) {
    if (!props ||
        !props.query ||
        !props.query.results ||
        !props.query.results.columns) {
      return;
    }
    const columns = {};
    props.query.results.columns.forEach((col) => {
      columns[col.name] = col;
    });
    this.setState({ columns });
  }
  datasourceName() {
    const { query } = this.props;
    const uniqueId = shortid.generate();
    let datasourceName = uniqueId;
    if (query) {
      datasourceName = query.user ? `${query.user}-` : '';
      datasourceName += query.db ? `${query.db}-` : '';
      datasourceName += `${query.tab}-${uniqueId}`;
    }
    return datasourceName;
  }
  validate() {
    const hints = [];
    const cols = this.mergedColumns();
    // const re = /^\w+$/;
    // Object.keys(cols).forEach((colName) => {
    //   if (!re.test(colName)) {
    //     hints.push(
    //       <div>
    //         "{colName}" is not right as a column name, please alias it
    //         (as in SELECT count(*) <strong>AS my_alias</strong>) using only
    //         alphanumeric characters and underscores
    //       </div>);
    //   }
    // });
    if (this.state.chartType === null) {
      hints.push('选择一种图表!');
    } else if (this.state.chartType.requiresTime) {
      let hasTime = false;
      for (const colName in cols) {
        const col = cols[colName];
        if (col.hasOwnProperty('is_date') && col.is_date) {
          hasTime = true;
        }
      }
      if (!hasTime) {
        hints.push(
          '要使用这种图表，必须包含至少一个时间字段');
      }
    }
    this.setState({ hints });
  }
  changeChartType(option) {
    this.setState({ chartType: option }, this.validate);
  }
  mergedColumns() {
    const columns = Object.assign({}, this.state.columns);
    if (this.props.query && this.props.query.results.columns) {
      this.props.query.results.columns.forEach((col) => {
        if (columns[col.name] === undefined) {
          columns[col.name] = col;
        }
      });
    }
    return columns;
  }
  buildVizOptions() {
    return {
      chartType: this.state.chartType.value,
      datasourceName: this.state.datasourceName,
      columns: this.state.columns,
      sql: this.props.query.sql,
      dbId: this.props.query.dbId,
    };
  }
  buildVisualizeAdvise() {
    let advise;
    const queryDuration = moment.duration(this.props.query.endDttm - this.props.query.startDttm);
    if (Math.round(queryDuration.asMilliseconds()) > QUERY_TIMEOUT_THRESHOLD) {
      advise = (
        <Alert bsStyle="warning">
          This query took {Math.round(queryDuration.asSeconds())} seconds to run,
          and the explore view times out at {QUERY_TIMEOUT_THRESHOLD / 1000} seconds,
          following this flow will most likely lead to your query timing out.
          We recommend your summarize your data further before following that flow.
          If activated you can use the <strong>CREATE TABLE AS</strong> feature
          to store a summarized data set that you can then explore.
        </Alert>);
    }
    return advise;
  }
  visualize() {
    this.props.actions.createDatasource(this.buildVizOptions(), this)
      .done(() => {
        const columns = Object.keys(this.state.columns).map(k => this.state.columns[k]);
        const mainMetric = columns.filter(d => d.agg)[0];
        const mainGroupBy = columns.filter(d => d.is_dim)[0];
        const formData = {
          datasource: this.props.datasource,
          viz_type: this.state.chartType.value,
          since: '100 years ago',
          limit: '0',
        };
        if (mainMetric) {
          formData.metrics = [mainMetric.name];
          formData.metric = mainMetric.name;
        }
        if (mainGroupBy) {
          formData.groupby = [mainGroupBy.name];
        }
        notify.info('Creating a data source and popping a new tab');

        window.open(getExploreUrl(formData));
      })
      .fail(() => {
        notify.error(this.props.errorMessage);
      });
  }
  changeDatasourceName(event) {
    this.setState({ datasourceName: event.target.value }, this.validate);
  }
  changeCheckbox(attr, columnName, event) {
    let columns = this.mergedColumns();
    const column = Object.assign({}, columns[columnName], { [attr]: event.target.checked });
    columns = Object.assign({}, columns, { [columnName]: column });
    this.setState({ columns }, this.validate);
  }
  changeAggFunction(columnName, option) {
    let columns = this.mergedColumns();
    const val = (option) ? option.value : null;
    const column = Object.assign({}, columns[columnName], { agg: val });
    columns = Object.assign({}, columns, { [columnName]: column });
    this.setState({ columns }, this.validate);
  }
  render() {
    if (!(this.props.query) || !(this.props.query.results) || !(this.props.query.results.columns)) {
      return (
        <div className="VisualizeModal">
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Body>
              这个查询没有可用的结果
            </Modal.Body>
          </Modal>
        </div>
      );
    }
    const tableData = this.props.query.results.columns.map(col => ({
      '字段': col.name,
      '是度量字段': (
        <input
          type="checkbox"
          onChange={this.changeCheckbox.bind(this, 'is_dim', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_dim : false}
          className="form-control"
        />
      ),

      '是时间字段': (
        <input
          type="checkbox"
          className="form-control"
          onChange={this.changeCheckbox.bind(this, 'is_date', col.name)}
          checked={(this.state.columns[col.name]) ? this.state.columns[col.name].is_date : false}
        />
      ),
      '聚合函数': (
        <Select
          options={[
            { value: 'sum', label: 'SUM(x)' },
            { value: 'min', label: 'MIN(x)' },
            { value: 'max', label: 'MAX(x)' },
            { value: 'avg', label: 'AVG(x)' },
            { value: 'count_distinct', label: 'COUNT(DISTINCT x)' },
          ]}
          onChange={this.changeAggFunction.bind(this, col.name)}
          value={(this.state.columns[col.name]) ? this.state.columns[col.name].agg : null}
        />
      ),
    }));
    const alerts = this.state.hints.map((hint, i) => (
      <Alert bsStyle="warning" key={i}>{hint}</Alert>
    ));
    const modal = (
      <div className="VisualizeModal">
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Visualize</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alerts}
            {this.buildVisualizeAdvise()}
            <div className="row">
              <Col md={6}>
                图表类型
                <Select
                  name="select-chart-type"
                  placeholder="[图表类型]"
                  options={CHART_TYPES}
                  value={(this.state.chartType) ? this.state.chartType.value : null}
                  autosize={false}
                  onChange={this.changeChartType.bind(this)}
                />
              </Col>
              <Col md={6}>
                数据表名
                <input
                  type="text"
                  className="form-control input-sm"
                  placeholder="数据表名"
                  onChange={this.changeDatasourceName.bind(this)}
                  value={this.state.datasourceName}
                />
              </Col>
            </div>
            <hr />
            <Table
              className="table table-condensed"
              columns={['字段', '是度量字段', '是时间字段', '聚合函数']}
              data={tableData}
            />
            <Button
              onClick={this.visualize.bind(this)}
              bsStyle="primary"
              disabled={(this.state.hints.length > 0)}
            >
              可视化
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    );
    return modal;
  }
}
VisualizeModal.propTypes = propTypes;
VisualizeModal.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    datasource: state.datasource,
    errorMessage: state.errorMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export { VisualizeModal };
export default connect(mapStateToProps, mapDispatchToProps)(VisualizeModal);
