function include(file) {

    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = true;
    document.getElementsByTagName('head').item(0).appendChild(script);
}
include('quadtree.js')
include('Map.js')
const r = new Rectangle(0, 0, 100, 100);
let m = new Map(r, 8)
m.buildMap()
let p = new Point(21, 26, 'sina')
let a = m.suggestLocation(p, 'restaurant')
console.log(a)
