// words.js — expand [token] shorthand into Baba Is You word/object image tags.
//   [baba]   -> <img class="babatext" src="images/ot/baba-t.gif" alt="BABA">  (text sprite, default)
//   [baba-o] -> <img class="babatext" src="images/ot/baba-o.gif" alt="BABA">  (object sprite)
// alt is the token base uppercased. Unknown tokens are left as plain text so a
// typo shows as literal "[foo]" rather than a broken image. No build step; runs
// once the DOM is ready. Multi-hyphen sprites (arrow-o-white, bird-o-pink) don't
// fit the scheme — write those as literal <img> tags.
(function () {
    var TEXT = new Set("a all and b baba box c defeat door empty facing fall flag float ghost grass group has hot is key lava lonely make melt more move not on open phantom pull push right rock shift shut sink skull sleep stop swap tele text up wall water weak win word you".split(" "));
    var OBJ = new Set("baba box door flag ghost grass keke key lava me rock skull wall water".split(" "));
    var TOKEN = /\[([a-z]+)(-o)?\]/gi;

    function sprite(base, isObj) {
        base = base.toLowerCase();
        if (!(isObj ? OBJ : TEXT).has(base)) return null;
        var img = document.createElement("img");
        img.className = "babatext";
        img.src = "images/ot/" + base + (isObj ? "-o" : "-t") + ".gif";
        img.alt = base.toUpperCase();
        return img;
    }

    function expand(node) {
        var s = node.nodeValue;
        var frag = document.createDocumentFragment();
        var last = 0, m, changed = false;
        TOKEN.lastIndex = 0;
        while ((m = TOKEN.exec(s))) {
            var img = sprite(m[1], !!m[2]);
            if (!img) continue; // unknown token: leave as literal text
            if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
            frag.appendChild(img);
            last = m.index + m[0].length;
            changed = true;
        }
        if (!changed) return;
        if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
        node.parentNode.replaceChild(frag, node);
    }

    function run() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                var p = n.parentNode && n.parentNode.nodeName;
                if (p === "SCRIPT" || p === "STYLE") return NodeFilter.FILTER_REJECT;
                return n.nodeValue.indexOf("[") === -1 ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [], n;
        while ((n = walker.nextNode())) nodes.push(n);
        nodes.forEach(expand);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();
