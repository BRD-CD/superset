import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { Table } from 'reactable';
import { Label, ProgressBar, Well } from 'react-bootstrap';
import Link from './Link';
import VisualizeModal from './VisualizeModal';
import ResultSet from './ResultSet';
import ModalTrigger from '../../components/ModalTrigger';
import HighlightedSql from './HighlightedSql';
import { STATE_BSSTYLE_MAP } from '../constants';
import { fDuration } from '../../modules/dates';
import { storeQuery } from '../../../utils/common';

const propTypes = {
  columns: PropTypes.array,
  actions: PropTypes.object,
  queries: PropTypes.array,
  onUserClicked: PropTypes.func,
  onDbClicked: PropTypes.func,
};
const defaultProps = {
  columns: ['开始时间', '耗时', '行数'],
  queries: [],
  onUserClicked: () => {},
  onDbClicked: () => {},
};


class QueryTable extends React.PureComponent {
  constructor(props) {
    super(props);
    const uri = window.location.toString();
    const cleanUri = uri.substring(0, uri.indexOf('#'));
    this.state = {
      cleanUri,
      showVisualizeModal: false,
      activeQuery: null,
    };
  }
  callback(url) {
    window.open(url);
  }
  openQuery(dbId, schema, sql) {
    const newQuery = {
      dbId,
      title: '未命名查询',
      schema,
      sql,
    };
    storeQuery(newQuery, this.callback);
  }
  hideVisualizeModal() {
    this.setState({ showVisualizeModal: false });
  }
  showVisualizeModal(query) {
    this.setState({ activeQuery: query, showVisualizeModal: true });
  }
  restoreSql(query) {
    this.props.actions.queryEditorSetSql({ id: query.sqlEditorId }, query.sql);
  }

  openQueryInNewTab(query) {
    this.props.actions.cloneQueryToNewTab(query);
  }
  openAsyncResults(query) {
    this.props.actions.fetchQueryResults(query);
  }
  clearQueryResults(query) {
    this.props.actions.clearQueryResults(query);
  }
  removeQuery(query) {
    this.props.actions.removeQuery(query);
  }
  render() {
    const data = this.props.queries.map((query) => {
      const q = Object.assign({}, query);
      if (q.endDttm) {
        q.耗时 = fDuration(q.startDttm, q.endDttm);
      }
      const time = moment(q.startDttm).format().split('T');
      q.time = (
        <div>
          <span>
            {time[0]} <br /> {time[1]}
          </span>
        </div>
      );
      q.用户 = (
        <button
          className="btn btn-link btn-xs"
          onClick={this.props.onUserClicked.bind(this, q.userId)}
        >
          {q.user}
        </button>
      );
      q.数据库 = (
        <button
          className="btn btn-link btn-xs"
          onClick={this.props.onDbClicked.bind(this, q.dbId)}
        >
          {q.db}
        </button>
      );
      q.执行时间 = moment(q.startDttm).format('HH:mm:ss');
      q.查询链接 = (
        <div style={{ width: '100px' }}>
          <button
            className="btn btn-link btn-xs"
            onClick={this.openQuery.bind(this, q.dbId, q.schema, q.sql)}
          >
            <i className="fa fa-external-link" />Open in SQL Editor
          </button>
        </div>
      );
      q.sql = (
        <Well>
          <HighlightedSql sql={q.sql} rawSql={q.executedSql} shrink maxWidth={60} />
        </Well>
      );
      if (q.resultsKey) {
        q.输出 = (
          <ModalTrigger
            bsSize="large"
            className="ResultsModal"
            triggerNode={(
              <Label
                bsStyle="info"
                style={{ cursor: 'pointer' }}
              >
                view results
              </Label>
            )}
            modalTitle={'数据预览'}
            beforeOpen={this.openAsyncResults.bind(this, query)}
            onExit={this.clearQueryResults.bind(this, query)}
            modalBody={
              <ResultSet showSql query={query} actions={this.props.actions} height={400} />
            }
          />
        );
      } else {
        // if query was run using ctas and force_ctas_schema was set
        // tempTable will have the schema
        const schemaUsed = q.ctas && q.tempTable && q.tempTable.includes('.') ? '' : q.schema;
        q.输出 = [schemaUsed, q.tempTable].filter(v => (v)).join('.');
      }
      q.进度 = (
        <ProgressBar
          style={{ width: '75px' }}
          striped
          now={q.progress}
          label={`${q.progress}%`}
        />
      );
      let errorTooltip;
      if (q.errorMessage) {
        errorTooltip = (
          <Link tooltip={q.errorMessage}>
            <i className="fa fa-exclamation-circle text-danger" />
          </Link>
        );
      }
      q.状态 = (
        <div>
          <span className={'m-r-3 label label-' + STATE_BSSTYLE_MAP[q.state]}>
            {q.state}
          </span>
          {errorTooltip}
        </div>
      );
      q.操作 = (
        <div style={{ width: '75px' }}>
          <Link
            className="fa fa-line-chart m-r-3"
            tooltip="可视化次查询"
            onClick={this.showVisualizeModal.bind(this, query)}
          />
          <Link
            className="fa fa-pencil m-r-3"
            onClick={this.restoreSql.bind(this, query)}
            tooltip="将SQL覆盖编辑器中的文本"
            placement="top"
          />
          <Link
            className="fa fa-plus-circle m-r-3"
            onClick={this.openQueryInNewTab.bind(this, query)}
            tooltip="在新的tab中执行查询"
            placement="top"
          />
          <Link
            className="fa fa-trash m-r-3"
            tooltip="从日志中删除查询"
            onClick={this.removeQuery.bind(this, query)}
          />
        </div>
      );
      return q;
    }).reverse();
    return (
      <div className="QueryTable">
        <VisualizeModal
          show={this.state.showVisualizeModal}
          query={this.state.activeQuery}
          onHide={this.hideVisualizeModal.bind(this)}
        />
        <Table
          columns={this.props.columns}
          className="table table-condensed"
          data={data}
          itemsPerPage={50}
        />
      </div>
    );
  }
}
QueryTable.propTypes = propTypes;
QueryTable.defaultProps = defaultProps;

export default QueryTable;
