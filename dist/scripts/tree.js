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
                //this.currNode = node;
                console.log("node.value is " + node.value);
                console.log("this.currNode is " + this.currNode.value);
                node.parent = this.currNode;
                this.currNode = node.parent;
                this.currNode.children.push(node);
                for (var i = 0; i < this.currNode.children.length; i++)
                    console.log("this node's children are " + this.currNode.children[i].value);
                console.log("done");
            }
        };
        Tree.prototype.moveUp = function () {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
            //console.log(this.currNode.value.type);
        };
        Tree.prototype.toStringTree = function () {
            // print string representation of tree
            var traversalResult = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                console.log(node + " " + node.children);
                if (node.children.length == 0) {
                    if (node.value.value != undefined)
                        traversalResult += "[" + node.value.value + "]\n";
                    else
                        traversalResult += "[" + node.value + "]\n";
                }
                else {
                    if (node.value.type != undefined)
                        traversalResult += "<" + node.value.type + "> \n";
                    else
                        traversalResult += "<" + node.value + "> \n";
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
