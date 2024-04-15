/**
 * 官方文档 https://www.prettier.cn/docs/options.html
 */
module.exports = {
    /** 每行代码最大长度 默认为80 */
    printWidth: 120,
    /** 使用制表符进行缩进: true 使用制表符，false 使用空格 */
    useTabs: false,
    /** 一个tab代表的空格数 */
    tabWidth: 4,
    /** 语句结束是否加分号 */
    semi: false,
    /** 字符串是否使用单引号 */
    singleQuote: true,
    /** 箭头函数参数是否加括号：'always' 始终加括号，'avoid' 非必要（只有一个参数时）不加括号 */
    arrowParens: 'always',
    /** 是否添加尾逗号 */
    trailingComma: 'none',
    /** 对象字面量的大括号两侧是否加空格 */
    bracketSpacing: true,
    /** 行结束符：'lf', 'crlf', 'cr', 'auto' */
    endOfLine: 'auto',
    /** HTML开始标签的结束符是否和最后一个属性放在同一行 */
    jsxBracketSameLine: false,
    /** 根据文件类型覆写配置项 */
    overrides: [
        {
            files: '*.md',
            options: {
                tabWidth: 3
            }
        },
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        }
    ]
}
