const ALLOWED_NAME_PATTERN =
  /(class|classes|style|styles|shadow|shadows|keyframe|keyframes|accent|accents)$/i;

function isLiteralLike(node) {
  if (!node) {
    return false;
  }

  switch (node.type) {
    case "Literal": {
      return true;
    }
    case "TemplateLiteral": {
      return node.expressions.length === 0;
    }
    case "UnaryExpression": {
      return isLiteralLike(node.argument);
    }
    case "ArrayExpression": {
      return node.elements.length > 0 && node.elements.every(isLiteralLike);
    }
    case "ObjectExpression": {
      return (
        node.properties.length > 0 &&
        node.properties.every(
          (property) =>
            property.type === "Property" &&
            !property.computed &&
            isLiteralLike(property.value)
        )
      );
    }
    default: {
      return false;
    }
  }
}

export const presentationNoInlineDataRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow dataset-like array and object literals in presentation files.",
    },
    schema: [],
    messages: {
      moveData:
        "Move dataset-like array/object data out of presentation and into application/data or another non-presentation layer. Styling constants may stay if their name clearly reflects styling.",
    },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id.type !== "Identifier" || !node.init) {
          return;
        }

        if (ALLOWED_NAME_PATTERN.test(node.id.name)) {
          return;
        }

        if (
          (node.init.type === "ArrayExpression" ||
            node.init.type === "ObjectExpression") &&
          isLiteralLike(node.init)
        ) {
          context.report({
            node,
            messageId: "moveData",
          });
        }
      },
    };
  },
};
