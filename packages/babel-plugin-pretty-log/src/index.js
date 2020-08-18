export default function ({ types: t }) {
  return {
    visitor: {
      ExpressionStatement(path) {
        const { node } = path
        if (
          t.isCallExpression(node.expression) &&
          t.isMemberExpression(node.expression.callee) &&
          t.isIdentifier(node.expression.callee.property, { name: 'log' })
        ) {
          const tips = [
            t.stringLiteral('%c>>>>> '),
            t.stringLiteral(
              'background: #1890ff; color: #fff; padding: 0 4px;'
            ),
          ]
          node.expression.arguments = [...tips, ...node.expression.arguments]
        }
      },
    },
  }
}
