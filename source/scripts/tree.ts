module TSC {
    export class Tree {
        root: TreeNode;
        currNode: TreeNode;

        constructor() {
            this.root = null;
            this.currNode = null;
        }

        public addNode(value: any) {
            let node = new TreeNode(value);
            // if there is no root, make this node the root
            if (this.root == null) {
                this.root = node;
                this.currNode = node;
            } else {
                node.parent = this.currNode;
                this.currNode.children.push(node);
            }
        }

        public moveUp() {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
        }

        public toString() {
            // print string representation of tree
            let traversalResult = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }

                if (!node.children || node.children.length == 0) {
                    traversalResult += "[" + node.name + "]\n";
                } else {
                    traversalResult += "<" + node.name + "> \n";
                
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }

            expand(this.root, 0);
            return traversalResult;
        }
    }
    export class TreeNode {
        value: any;
        parent: TreeNode;
        children = [];
        constructor(value: any){
            this.value = value;
        }
    }
}