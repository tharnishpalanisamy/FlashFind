class Node{
    constructor(){
        this.children = {}
        this.is_end = false
    }
}

export class Trie{
    constructor(){
        this.root = new Node()
    }

    insert(word){ 
        let cur = this.root 
        
        for(let c of word) {
            if (!cur.children[c]) {
                cur.children[c] = new Node()
            } 
            cur = cur.children[c] 
        } 
        cur.is_end = true 
    }

    search(word) {
        let cur = this.root 

        for(let c of word) {
            if(!cur.children[c]) {
                return false 
            }
            cur = cur.children[c] 
        }
        return cur.is_end 
    } 

    startsWith(prefix) {
        let cur = this.root  

        for(let c of prefix) {
            if(!cur.children[c]) {
                return false 
            }
            cur = cur.children[c] 
        }
        return true 

    } 

    collect(node, prefix, result) {
        if (node.is_end) {
            result.push(prefix);
        }

        for (let ch in node.children) {
            this.collect(
                node.children[ch],
                prefix + ch,
                result
            );
        }
    } 

    suggest(prefix) {
        let cur = this.root;

        for (let c of prefix) {
            if (!cur.children[c]) {
                return [];
            }
            cur = cur.children[c];
        }

        const result = [];
        this.collect(cur, prefix, result);
        return result;
    }



}



