/* tree.ts  
Brandon Litwin
CMPT 432 - Compilers
Project 2

This is the tree object that stores all of the parsed tokens
*/
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
                this.currNode = node.parent;
                this.currNode.children.push(node);
                
            }
        }

        public moveUp() {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
        }

        public buildCST(treantTree, node) {
            let child = {};
            
            if (node.value.type != undefined) {
                child = {
                    text: { name: "[" + node.value.value + "]" },
                    children: []
                };
                treantTree.children.push(child);
            } else {
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

        }

        public toStringTree() {
            // print string representation of tree
            let traversalResult = "";
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
                } else {
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