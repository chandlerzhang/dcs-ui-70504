export default {
  'entry': 'src/index.js',
  'theme': './theme.js',
  'env': {
    'development': {
      'extraBabelPlugins': [
        'dva-hmr',
        'transform-runtime',
        ['import', {'libraryName': 'antd', 'style': true}]
      ]
    },
    'production': {
      'extraBabelPlugins': [
        'transform-runtime',
        ['import', {'libraryName': 'antd', 'style': true}]
      ],
      'externals': [
        {
          'react': 'React',
          'sql.js': 'SQL',
          'jquery': '$',
        },
        /moment/,
        /ajv/,
      ],
    }
  }
}
