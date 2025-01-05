
module.exports = {
    // transpileDependencies: ['uview-ui'],
    devServer: {
        proxy: {
            '/wx/users': {
                target: 'http://localhost:4005',
                changeOrigin: true,
                pathRewrite: {
                    '/wx/users': ''
                }
            },
            '/wx/project': {
                target: 'http://localhost:3005',
                changeOrigin: true,
                pathRewrite: {
                    '/wx/project': ''
                }
            },
        },
    }
}
