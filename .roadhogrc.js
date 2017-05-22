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
                    'react-dom':'ReactDOM',
                    'sql.js': 'SQL',
                    'jquery': '$',
                },
                /moment/,
                /ajv/,
            ],
        }
    }
}
