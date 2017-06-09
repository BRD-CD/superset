export const sections = {
  druidTimeSeries: {
    label: '时间',
    description: '时间相关设置',
    controlSetRows: [
      ['granularity', 'druid_time_origin'],
      ['since', 'until'],
    ],
  },
  datasourceAndVizType: {
    label: '数据源 & 图表类型',
    controlSetRows: [
      ['datasource'],
      ['viz_type'],
      ['slice_id', 'cache_timeout'],
    ],
  },
  sqlaTimeSeries: {
    label: '时间',
    description: '时间相关设置',
    controlSetRows: [
      ['granularity_sqla', 'time_grain_sqla'],
      ['since', 'until'],
    ],
  },
  sqlClause: {
    label: 'SQL',
    controlSetRows: [
      ['where'],
      ['having'],
    ],
    description: '如何包含SQL段',
  },
  NVD3TimeSeries: [
    {
      label: null,
      controlSetRows: [
        ['metrics'],
        ['groupby'],
        ['limit', 'timeseries_limit_metric'],
      ],
    },
    {
      label: '高级解析',
      description: 'This section contains options ' +
      'that allow for advanced analytical post processing ' +
      'of query results',
      controlSetRows: [
        ['rolling_type', 'rolling_periods'],
        ['time_compare'],
        ['num_period_compare', 'period_ratio_type'],
        ['resample_how', 'resample_rule'],
        ['resample_fillmethod'],
      ],
    },
  ],
  filters: [
    {
      label: '筛选',
      description: 'Filters are defined using comma delimited strings as in <US,FR,Other>' +
      'Leave the value control empty to filter empty strings or nulls' +
      'For filters with comma in values, wrap them in single quotes' +
      "as in <NY, 'Tahoe, CA', DC>",
      controlSetRows: [['filters']],
    },
    {
      label: '结果筛选',
      description: 'The filters to apply after post-aggregation.' +
      'Leave the value control empty to filter empty strings or nulls',
      controlSetRows: [['having_filters']],
    },
  ],
};

const visTypes = {
  dist_bar: {
    label: '分布-柱状图',
    controlPanelSections: [
      {
        label: '图表设置',
        controlSetRows: [
          ['metrics'],
          ['groupby'],
          ['columns'],
          ['row_limit'],
          ['show_legend', 'show_bar_value'],
          ['bar_stacked', 'order_bars'],
          ['y_axis_format', 'bottom_margin'],
          ['x_axis_label', 'y_axis_label'],
          ['reduce_x_ticks', 'contribution'],
          ['show_controls'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '系列',
      },
      columns: {
        label: '子系列',
        description: 'Defines how each series is broken down',
      },
    },
  },

  pie: {
    label: '饼图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics', 'groupby'],
          ['limit'],
          ['pie_label_type'],
          ['donut', 'show_legend'],
          ['labels_outside'],
        ],
      },
    ],
  },

  line: {
    label: '时间序列-折线图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['rich_tooltip', null],
          ['show_markers', 'x_axis_showminmax'],
          ['line_interpolation', 'contribution'],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_label', 'x_axis_format'],
          ['y_axis_label', 'y_axis_bounds'],
          ['y_axis_format', 'y_log_scale'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  dual_line: {
    label: '时间序列-双轴线图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '图表设置',
        controlSetRows: [
          ['x_axis_format'],
        ],
      },
      {
        label: 'Y轴1',
        controlSetRows: [
          ['metric'],
          ['y_axis_format'],
        ],
      },
      {
        label: 'Y轴2',
        controlSetRows: [
          ['metric_2'],
          ['y_axis_2_format'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: '左轴度量',
        description: 'Choose a metric for left axis',
      },
      y_axis_format: {
        label: '左轴格式',
      },
    },
  },

  bar: {
    label: '时间序列-柱状图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表设置',
        controlSetRows: [
          ['show_brush', 'show_legend', 'show_bar_value'],
          ['rich_tooltip', 'contribution'],
          ['line_interpolation', 'bar_stacked'],
          ['bottom_margin', 'show_controls'],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_showminmax', 'reduce_x_ticks'],
          ['x_axis_label', 'y_axis_label'],
          ['y_axis_bounds', 'y_log_scale'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  compare: {
    label: '时间序列-百分比变化',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: 'Chart Options',
        controlSetRows: [
          ['x_axis_format', 'y_axis_format'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  area: {
    label: '时间序列-堆积图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表设置',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['line_interpolation', 'stacked_style'],
          ['rich_tooltip', 'contribution'],
          ['show_controls', null],
        ],
      },
      {
        label: 'Axes',
        controlSetRows: [
          ['x_axis_format', 'x_axis_showminmax'],
          ['y_axis_format', 'y_axis_bounds'],
          ['y_log_scale', null],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  table: {
    label: '表视图',
    controlPanelSections: [
      {
        label: '分组',
        description: 'Use this section if you want a query that aggregates',
        controlSetRows: [
          ['groupby', 'metrics'],
          ['include_time'],
        ],
      },
      {
        label: '不分组',
        description: 'Use this section if you want to query atomic rows',
        controlSetRows: [
          ['all_columns'],
          ['order_by_cols'],
        ],
      },
      {
        label: '设置',
        controlSetRows: [
          ['table_timestamp_format'],
          ['row_limit', 'page_length'],
          ['include_search', 'table_filter'],
        ],
      },
    ],
    controlOverrides: {
      metrics: {
        validators: [],
      },
      time_grain_sqla: {
        default: null,
      },
    },
  },

  markup: {
    label: '标记',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['markup_type'],
          ['code'],
        ],
      },
    ],
  },

  pivot_table: {
    label: '透视表',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metrics', 'pandas_aggfunc'],
          ['number_format'],
        ],
      },
    ],
  },

  separator: {
    label: '分隔符',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['code'],
        ],
      },
    ],
    controlOverrides: {
      code: {
        default: '####Section Title\n' +
        'A paragraph describing the section' +
        'of the dashboard, right before the separator line ' +
        '\n\n' +
        '---------------',
      },
    },
  },

  word_cloud: {
    label: '词汇云',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'metric', 'limit'],
          ['size_from', 'size_to'],
          ['rotation'],
        ],
      },
    ],
  },

  treemap: {
    label: '矩阵图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby'],
        ],
      },
      {
        label: '图表设置',
        controlSetRows: [
          ['treemap_ratio'],
          ['number_format'],
        ],
      },
    ],
  },

  cal_heatmap: {
    label: '时间热力图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['domain_granularity'],
          ['subdomain_granularity'],
        ],
      },
    ],
  },

  box_plot: {
    label: '箱线图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby', 'limit'],
        ],
      },
      {
        label: '图表设置',
        controlSetRows: [
          ['whisker_options'],
        ],
      },
    ],
  },

  bubble: {
    label: '气泡图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'entity'],
          ['x', 'y'],
          ['size', 'limit'],
        ],
      },
      {
        label: '图表设置',
        controlSetRows: [
          ['show_legend', 'max_bubble_size'],
          ['x_axis_label', 'y_axis_label'],
          ['x_log_scale', 'y_log_scale'],
        ],
      },
    ],
  },

  bullet: {
    label: '子弹图',
    requiresTime: false,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['ranges', 'range_labels'],
          ['markers', 'marker_labels'],
          ['marker_lines', 'marker_line_labels'],
        ],
      },
    ],
  },

  big_number: {
    label: '数字和趋势线',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['compare_lag'],
          ['compare_suffix'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  big_number_total: {
    label: '数字',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['subheader'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  histogram: {
    label: '直方图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x'],
          ['row_limit'],
        ],
      },
      {
        label: '直方图设置',
        controlSetRows: [
          ['link_length'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '数字字段',
        description: 'Select the numeric column to draw the histogram',
      },
      link_length: {
        label: '分段数',
        description: 'Select number of bins for the histogram',
        default: 5,
      },
    },
  },

  sunburst: {
    label: 'Sunburst',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric', 'secondary_metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: 'Primary Metric',
        description: 'The primary metric is used to define the arc segment sizes',
      },
      secondary_metric: {
        label: 'Secondary Metric',
        description: 'This secondary metric is used to ' +
        'define the color as a ratio against the primary metric. ' +
        'If the two metrics match, color is mapped level groups',
      },
      groupby: {
        label: 'Hierarchy',
        description: 'This defines the level of the hierarchy',
      },
    },
  },

  sankey: {
    label: '蛇形图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源 / 目标',
        description: 'Choose a source and a target',
      },
    },
  },

  directed_force: {
    label: 'Directed Force Layout',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
      {
        label: '有向图',
        controlSetRows: [
          ['link_length'],
          ['charge'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源 / 目标',
        description: 'Choose a source and a target',
      },
    },
  },
  country_map: {
    label: 'Country Map',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['select_country'],
          ['entity'],
          ['metric'],
          ['linear_color_scheme'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: 'ISO 3166-1 codes of region/province/department',
        description: "It's ISO 3166-1 of your region/province/department in your table. (see documentation for list of ISO 3166-1)",
      },
      metric: {
        label: 'Metric',
        description: 'Metric to display bottom title',
      },
    },
  },
  world_map: {
    label: '世界地图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['entity'],
          ['country_fieldtype'],
          ['metric'],
        ],
      },
      {
        label: '气泡',
        controlSetRows: [
          ['show_bubbles'],
          ['secondary_metric'],
          ['max_bubble_size'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: '国家',
        description: '3 letter code of the country',
      },
      metric: {
        label: '颜色度量',
        description: 'Metric that defines the color of the country',
      },
      secondary_metric: {
        label: '气泡大小',
        description: 'Metric that defines the size of the bubble',
      },
    },
  },

  filter_box: {
    label: '筛选器',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['date_filter', 'instant_filtering'],
          ['groupby'],
          ['metric'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '筛选',
        description: 'The controls you want to filter on',
        default: [],
      },
    },
  },

  iframe: {
    label: '内联框架',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['url'],
        ],
      },
    ],
  },

  para: {
    label: '平行坐标',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series'],
          ['metrics'],
          ['secondary_metric'],
          ['limit'],
          ['show_datatable', 'include_series'],
        ],
      },
    ],
  },

  heatmap: {
    label: '热力图',
    controlPanelSections: [
      {
        label: 'Axis & Metrics',
        controlSetRows: [
          ['all_columns_x'],
          ['all_columns_y'],
          ['metric'],
        ],
      },
      {
        label: '热力图设置',
        controlSetRows: [
          ['linear_color_scheme'],
          ['xscale_interval', 'yscale_interval'],
          ['canvas_image_rendering'],
          ['normalize_across'],
        ],
      },
    ],
  },

  horizon: {
    label: '水平图',
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表设置',
        controlSetRows: [
          ['series_height', 'horizon_color_scale'],
        ],
      },
    ],
  },

  mapbox: {
    label: '箱图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x', 'all_columns_y'],
          ['clustering_radius'],
          ['row_limit'],
          ['groupby'],
          ['render_while_dragging'],
        ],
      },
      {
        label: '点',
        controlSetRows: [
          ['point_radius'],
          ['point_radius_unit'],
        ],
      },
      {
        label: '标签',
        controlSetRows: [
          ['mapbox_label'],
          ['pandas_aggfunc'],
        ],
      },
      {
        label: '干扰可是',
        controlSetRows: [
          ['mapbox_style'],
          ['global_opacity'],
          ['mapbox_color'],
        ],
      },
      {
        label: '视窗',
        controlSetRows: [
          ['viewport_longitude'],
          ['viewport_latitude'],
          ['viewport_zoom'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '经度',
        description: 'Column containing longitude data',
      },
      all_columns_y: {
        label: '纬度',
        description: 'Column containing latitude data',
      },
      pandas_aggfunc: {
        label: '标签聚合函数',
        description: 'Aggregate function applied to the list of points ' +
        'in each cluster to produce the cluster label.',
      },
      rich_tooltip: {
        label: '提示',
        description: 'Show a tooltip when hovering over points and clusters ' +
        'describing the label',
      },
      groupby: {
        description: 'One or many controls to group by. If grouping, latitude ' +
        'and longitude columns must be present.',
      },
    },
  },
};

export default visTypes;

export function sectionsToRender(vizType, datasourceType) {
  const viz = visTypes[vizType];
  return [].concat(
    sections.datasourceAndVizType,
    datasourceType === 'table' ? sections.sqlaTimeSeries : sections.druidTimeSeries,
    viz.controlPanelSections,
    datasourceType === 'table' ? sections.sqlClause : [],
    datasourceType === 'table' ? sections.filters[0] : sections.filters,
  );
}
