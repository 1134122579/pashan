function _iterableToArrayLimit(r, t) {
    if ("undefined" != typeof Symbol && Symbol.iterator in Object(r)) {
        var e = [], i = !0, o = !1, l = void 0;
        try {
            for (var n, a = r[Symbol.iterator](); !(i = (n = a.next()).done) && (e.push(n.value), 
            !t || e.length !== t); i = !0) ;
        } catch (r) {
            o = !0, l = r;
        } finally {
            try {
                i || null == a.return || a.return();
            } finally {
                if (o) throw l;
            }
        }
        return e;
    }
}

module.exports = _iterableToArrayLimit;