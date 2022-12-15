// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// QuadTree
class Point {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.userData = data;
  }

  // Skips Math.sqrt for faster comparisons
  sqDistanceFrom(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;

    return dx * dx + dy * dy;
  }

  // Pythagorus: a^2 = b^2 + c^2
  distanceFrom(other) {
    return Math.sqrt(this.sqDistanceFrom(other));
  }
}

class Rectangle {
  constructor(x, y, w, h, data) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.left = x - w / 2;
    this.right = x + w / 2;
    this.top = y - h / 2;
    this.bottom = y + h / 2;
  }

  contains(point) {
    return (
      this.left <= point.x && point.x <= this.right &&
      this.top <= point.y && point.y <= this.bottom
    );
  }

  intersects(range) {
    return !(
      this.right < range.left || range.right < this.left ||
      this.bottom < range.top || range.bottom < this.top
    );
  }

  // subdivide(quadrant) {
  //   switch (quadrant) {
  //     case 'ne':
  //       return new Rectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
  //     case 'nw':
  //       return new Rectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
  //     case 'se':
  //       return new Rectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
  //     case 'sw':
  //       return new Rectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
  //   }
  // }

  xDistanceFrom(point) {
    if (this.left <= point.x && point.x <= this.right) {
      return 0;
    }

    return Math.min(
      Math.abs(point.x - this.left),
      Math.abs(point.x - this.right)
    );
  }

  yDistanceFrom(point) {
    if (this.top <= point.y && point.y <= this.bottom) {
      return 0;
    }

    return Math.min(
      Math.abs(point.y - this.top),
      Math.abs(point.y - this.bottom)
    );
  }

  // Skips Math.sqrt for faster comparisons
  sqDistanceFrom(point) {
    const dx = this.xDistanceFrom(point);
    const dy = this.yDistanceFrom(point);

    return dx * dx + dy * dy;
  }

  // Pythagorus: a^2 = b^2 + c^2
  distanceFrom(point) {
    return Math.sqrt(this.sqDistanceFrom(point));
  }
}

// circle class for a circle shaped query
// class Circle {
//   constructor(x, y, r) {
//     this.x = x;
//     this.y = y;
//     this.r = r;
//     this.rSquared = this.r * this.r;
//   }
//
//   contains(point) {
//     // check if the point is in the circle by checking if the euclidean distance of
//     // the point and the center of the circle if smaller or equal to the radius of
//     // the circle
//     let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
//     return d <= this.rSquared;
//   }
//
//   intersects(range) {
//
//     let xDist = Math.abs(range.x - this.x);
//     let yDist = Math.abs(range.y - this.y);
//
//     // radius of the circle
//     let r = this.r;
//
//     let w = range.w / 2;
//     let h = range.h / 2;
//
//     let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);
//
//     // no intersection
//     if (xDist > (r + w) || yDist > (r + h))
//       return false;
//
//     // intersection within the circle
//     if (xDist <= w || yDist <= h)
//       return true;
//
//     // intersection on the edge of the circle
//     return edges <= this.rSquared;
//   }
// }

class QuadTree {
  DEFAULT_CAPACITY = 8;
  MAX_DEPTH = 8;

  constructor(boundary, capacity = this.DEFAULT_CAPACITY, _depth = 0) {
    if (!boundary) {
      throw TypeError('boundary is null or undefined');
    }
    if (!(boundary instanceof Rectangle)) {
      throw TypeError('boundary should be a Rectangle');
    }
    if (typeof capacity !== 'number') {
      throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    }
    if (capacity < 1) {
      throw RangeError('capacity must be greater than 0');
    }

    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;

    this.depth = _depth;
  }

  get children() {
    if (this.divided) {
      return [
        this.northeast,
        this.northwest,
        this.southeast,
        this.southwest
      ];
    } else {
      return [];
    }
  }

  clear() {
    this.points = [];

    if (this.divided) {
      this.divided = false;
      delete this.northwest;
      delete this.northeast;
      delete this.southwest;
      delete this.southeast;
    }
  }

  static create() {
    if (arguments.length === 0) {
      if (typeof width === "undefined") {
        throw new TypeError("No global width defined");
      }
      if (typeof height === "undefined") {
        throw new TypeError("No global height defined");
      }
      let bounds = new Rectangle(width / 2, height / 2, width, height);
      return new QuadTree(bounds, this.DEFAULT_CAPACITY);
    }
    if (arguments[0] instanceof Rectangle) {
      let capacity = arguments[1] || this.DEFAULT_CAPACITY;
      return new QuadTree(arguments[0], capacity);
    }
    if (typeof arguments[0] === "number" &&
        typeof arguments[1] === "number" &&
        typeof arguments[2] === "number" &&
        typeof arguments[3] === "number") {
      let capacity = arguments[4] || this.DEFAULT_CAPACITY;
      return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
    }
    throw new TypeError('Invalid parameters');
  }

  subdivide()
  {
    let nw = new Rectangle(this.boundary.x + this.boundary.w/2, this.boundary.y - this.boundary.h/2, this.boundary.w/2, this.boundary.h/2)
    let ne = new Rectangle(this.boundary.x - this.boundary.w/2, this.boundary.y - this.boundary.h/2, this.boundary.w/2, this.boundary.h/2)
    let se = new Rectangle(this.boundary.x - this.boundary.w/2, this.boundary.y + this.boundary.h/2, this.boundary.w/2, this.boundary.h/2)
    let sw = new Rectangle(this.boundary.x + this.boundary.w/2, this.boundary.y + this.boundary.h/2, this.boundary.w/2, this.boundary.h/2)
    this.northeast = new QuadTree(ne, 4);
    this.northwest = new QuadTree(nw, 4);
    this.southeast = new QuadTree(se, 4);
    this.southwest = new QuadTree(sw, 4);
  }

  insert(point)
  {
    if (!this.boundary.contains(point))
    {
      return;
    }
    if (this.points.length < this.capacity)
    {
      this.points.push(point);
    }
    else
    {
      if (!this.divided)
      {
        this.subdivide();
        this.divided = true;
      }
      this.northeast.insert(point);
      this.northwest.insert(point);
      this.southeast.insert(point);
      this.southwest.insert(point);
    }
  }

  closest(searchPoint, maxCount = 1, maxDistance = Infinity) {
    if (typeof searchPoint === "undefined") {
      throw TypeError("Method 'closest' needs a point");
    }

    const sqMaxDistance = maxDistance ** 2;
    return this.kNearest(searchPoint, maxCount, sqMaxDistance, 0, 0).found;
  }

  kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar) {
    let found = [];

    if (this.divided) {
      this.children
        .sort((a, b) => a.boundary.sqDistanceFrom(searchPoint) - b.boundary.sqDistanceFrom(searchPoint))
        .forEach((child) => {
          const sqDistance = child.boundary.sqDistanceFrom(searchPoint);
          if (sqDistance > sqMaxDistance) {
            return;
          } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
            const result = child.kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar);
            const childPoints = result.found;
            found = found.concat(childPoints);
            foundSoFar += childPoints.length;
            furthestSqDistance = result.furthestSqDistance;
          }
        });
    } else {
      this.points
        .sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint))
        .forEach((p) => {
          const sqDistance = p.sqDistanceFrom(searchPoint);
          if (sqDistance > sqMaxDistance) {
            return;
          } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
            found.push(p);
            furthestSqDistance = Math.max(sqDistance, furthestSqDistance);
            foundSoFar++;
          }
        });
    }

    return {
      found: found.sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint)).slice(0, maxCount),
      furthestSqDistance: Math.sqrt(furthestSqDistance),
    };
  }

  // forEach(fn) {
  //   if (this.divided) {
  //     this.northeast.forEach(fn);
  //     this.northwest.forEach(fn);
  //     this.southeast.forEach(fn);
  //     this.southwest.forEach(fn);
  //   } else {
  //     this.points.forEach(fn);
  //   }
  // }

  // filter(fn) {
  //   let filtered = new QuadTree(this.boundary, this.capacity);
  //
  //   this.forEach((point) => {
  //     if (fn(point)) {
  //       filtered.insert(point);
  //     }
  //   });
  //
  //   return filtered;
  // }
  //
  // merge(other, capacity) {
  //   let left = Math.min(this.boundary.left, other.boundary.left);
  //   let right = Math.max(this.boundary.right, other.boundary.right);
  //   let top = Math.min(this.boundary.top, other.boundary.top);
  //   let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
  //
  //   let height = bottom - top;
  //   let width = right - left;
  //
  //   let midX = left + width / 2;
  //   let midY = top + height / 2;
  //
  //   let boundary = new Rectangle(midX, midY, width, height);
  //   let result = new QuadTree(boundary, capacity);
  //
  //   this.forEach(point => result.insert(point));
  //   other.forEach(point => result.insert(point));
  //
  //   return result;
  // }

  // get length() {
  //   if (this.divided) {
  //     return (
  //       this.northwest.length +
  //       this.northeast.length +
  //       this.southwest.length +
  //       this.southeast.length
  //     );
  //   }
  //
  //   return this.points.length;
  // }

  show()
  {
    stroke(255);
    strokeWeight(1)
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
    if(this.divided)
    {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }

    for (let p of this.points)
    {
      strokeWeight(4);
      point(p.x, p.y);
    }
  }

}

if (typeof module !== "undefined") {
  module.exports = { Point, Rectangle, QuadTree, Circle };
}
const r = new Rectangle(0, 0, 23, 23);
const capacity = 4;
const quadtree = new QuadTree(r, capacity);
quadtree.insert(new Point(2, 2, 'sina'))
quadtree.insert(new Point(2, 1, 'reza'))