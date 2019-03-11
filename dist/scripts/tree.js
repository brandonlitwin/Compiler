var TSC;
(function (TSC) {
    var Tree = /** @class */ (function () {
        function Tree() {
            this.root = null;
            this.currNode = null;
        }
        Tree.prototype.addNode = function (value) {
            var node = new TreeNode(value);
            // if there is no root, make this node the root
            if (this.root == null) {
                this.root = node;
                this.currNode = node;
            }
            else {
                node.parent = this.currNode;
                this.currNode.children.push(node);
            }
        };
        Tree.prototype.moveUp = function () {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
        };
        Tree.prototype.toString = function () {
            // print string representation of tree
            var traversalResult = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                if (!node.children || node.children.length == 0) {
                    traversalResult += "[" + node.name + "]\n";
                }
                else {
                    traversalResult += "<" + node.name + "> \n";
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            expand(this.root, 0);
            return traversalResult;
        };
        return Tree;
    }());
    TSC.Tree = Tree;
    var TreeNode = /** @class */ (function () {
        function TreeNode(value) {
            this.children = [];
            this.value = value;
        }
        return TreeNode;
    }());
    TSC.TreeNode = TreeNode;
})(TSC || (TSC = {}));
