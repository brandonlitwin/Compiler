/* tree.ts
Brandon Litwin
CMPT 432 - Compilers
Project 2

This is the tree object that stores all of the parsed tokens
*/
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
                return;
                //this.currNode.children = [];
                //this.currNode.parent = null;
            }
            else {
                node.parent = this.currNode;
                this.currNode = node.parent;
                this.currNode.children.push(node);
                this.moveDown();
            }
        };
        // sometimes the child node will have the wrong parent, so this function gives it back to the correct parent
        Tree.prototype.makeNodeChildOf = function (child, newParent) {
            child.parent.children.splice(-1, 1);
            while (this.currNode.value != newParent) {
                this.moveUp();
            }
            child.parent = this.currNode;
            this.currNode.children.push(child);
        };
        Tree.prototype.moveUp = function () {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
        };
        Tree.prototype.moveDown = function () {
            if (this.currNode == null) {
                return;
            }
            var latestChild = this.currNode.children[this.currNode.children.length - 1];
            this.currNode = latestChild;
        };
        Tree.prototype.buildCST = function (treantTree, node) {
            var child = {};
            if (node.value.type != undefined) {
                child = {
                    text: { name: "[" + node.value.value + "]" },
                    children: []
                };
                treantTree.children.push(child);
            }
            else {
                child = {
                    text: { name: "<" + node.value + ">" },
                    children: []
                };
                treantTree.children.push(child);
            }
            for (var i = 0; i < node.children.length; i++) {
                this.buildCST(child, node.children[i]);
            }
            return treantTree;
        };
        Tree.prototype.buildAST = function (treantTree, node) {
            var child = {};
            if (node.value.type != undefined) {
                child = {
                    text: { name: node.value.value },
                    children: []
                };
                treantTree.children.push(child);
            }
            else {
                child = {
                    text: { name: node.value },
                    children: []
                };
                treantTree.children.push(child);
            }
            for (var i = 0; i < node.children.length; i++) {
                this.buildAST(child, node.children[i]);
            }
            return treantTree;
        };
        Tree.prototype.toStringTree = function () {
            // print string representation of tree
            var traversalResult = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
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
