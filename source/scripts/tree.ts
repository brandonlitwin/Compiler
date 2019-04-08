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
                return;
                //this.currNode.children = [];
                //this.currNode.parent = null;
            } else {
                node.parent = this.currNode;
                this.currNode = node.parent;
                this.currNode.children.push(node);
                this.moveDown();
                
            }
        }

        // sometimes the child node will have the wrong parent, so this function gives it back to the correct parent
        public makeNodeChildOf(child, newParent) {
            child.parent.children.splice(-1,1);
            while (this.currNode.value != newParent) {
                this.moveUp()
            }
            child.parent = this.currNode;
            this.currNode.children.push(child);
        }

        public moveUp() {
            // move up the tree
            if (this.currNode.parent != null)
                this.currNode = this.currNode.parent;
        }

        public moveDown(){
            if(this.currNode == null){
                return;
            }
            let latestChild = this.currNode.children[this.currNode.children.length-1];
            this.currNode = latestChild;
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
        public buildAST(treantTree, node) {
            let child = {};
            
            if (node.value.type != undefined) {
                child = {
                    text: { name: node.value.value },
                    children: []
                };
                treantTree.children.push(child);
            } else {
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

        }

        public toStringTree() {
            // print string representation of tree
            let traversalResult = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
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