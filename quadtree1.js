// https://www.ernst-schmidt.com/coding/5d70ea631d0a070017666552
// Quadtree and Flocking Simulation by Kubi

class Point
{
  constructor(x, y, data)
  {
    this.x = x;
    this.y = y;
    this.userData = data;
  }

  // Skips Math.sqrt for faster comparisons
  sqDistanceFrom(other)
  {
    const dx = other.x - this.x;
    const dy = other.y - this.y;

    return dx * dx + dy * dy;
  }

  // Pythagorus: a^2 = b^2 + c^2
  distanceFrom(other)
  {
    return Math.sqrt(this.sqDistanceFrom(other));
  }
}

class Rectangle
{
  constructor(x, y, w, h)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point)
  {
    return (point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h);
  }

  intersects(range)
  {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  }

  xDistanceFrom(point)
  {
    if (this.left <= point.x && point.x <= this.right)
    {
      return 0;
    }

    return Math.min(
        Math.abs(point.x - this.left),
        Math.abs(point.x - this.right)
    );
  }

  yDistanceFrom(point) {
    if (this.top <= point.y && point.y <= this.bottom)
    {
      return 0;
    }

    return Math.min(
        Math.abs(point.y - this.top),
        Math.abs(point.y - this.bottom)
    );
  }

  // Skips Math.sqrt for faster comparisons
  sqDistanceFrom(point)
  {
    const dx = this.xDistanceFrom(point);
    const dy = this.yDistanceFrom(point);

    return dx * dx + dy * dy;
  }

  // Pythagorus: a^2 = b^2 + c^2
  distanceFrom(point)
  {
    return Math.sqrt(this.sqDistanceFrom(point));
  }

}

class QuadTree
{
  constructor(boundary, n)
  {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }

  get children()
  {
    if (this.divided)
    {
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

  subdivide()
  {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }
  kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar)
  {
    let found = [];

    if (this.divided)
    {
      this.children
          .sort((a, b) => a.boundary.sqDistanceFrom(searchPoint) - b.boundary.sqDistanceFrom(searchPoint))
          .forEach((child) => {
            const sqDistance = child.boundary.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance)
            {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance)
            {
              const result = child.kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar);
              const childPoints = result.found;
              found = found.concat(childPoints);
              foundSoFar += childPoints.length;
              furthestSqDistance = result.furthestSqDistance;
            }
          });
    }
    else
    {
      this.points
          .sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint))
          .forEach((p) => {
            const sqDistance = p.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance)
            {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance)
            {
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
  forEach(fn)
  {
    if (this.divided)
    {
      this.northeast.forEach(fn);
      this.northwest.forEach(fn);
      this.southeast.forEach(fn);
      this.southwest.forEach(fn);
    }
    else
    {
      this.points.forEach(fn);
    }
  }

  insert(point)
  {

    if (!this.boundary.contains(point))
    {
      return false;
    }

    if (this.points.length < this.capacity)
    {
      this.points.push(point);
      return true;
    }
    else
    {
      if (!this.divided)
      {
        this.subdivide();
      }
      if (this.northeast.insert(point))
      {
        return true;
      } else if (this.northwest.insert(point))
      {
        return true;
      } else if (this.southeast.insert(point))
      {
        return true;
      } else if (this.southwest.insert(point))
      {
        return true;
      }
    }
  }

  query(range, found)
  {
    if (!found)
    {
      found = [];
    }
    if (!this.boundary.intersects(range))
    {
      return;
    }
    else
    {
      for (let p of this.points)
      {
        if (range.contains(p))
        {
          found.push(p);
        }
      }
      if (this.divided)
      {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
    return found;
  }


  show()
  {
    stroke(255);
    noFill();
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
    for (let p of this.points)
    {
      strokeWeight(2);
      point(p.x, p.y);
    }

    if (this.divided)
    {
      this.northeast.show();
      this.northwest.show();
      this.southeast.show();
      this.southwest.show();
    }
  }

}
class Map
{
  DEFAULT_CAPACITY = 8;

  constructor(qTree, capacity = this.DEFAULT_CAPACITY)
  {
    this.capacity = capacity;
    this.quadtree = qTree;
  }

  buildMap()
  {
    const places = ['restaurant', 'hospital', 'shopping center', 'cinema', 'hotel']
    const nums = [300, -300]
    for (let i = 0; i < 500; i++)
    {
      const random = Math.floor(Math.random() * places.length);
      let m = Math.floor(Math.random() * nums.length);
      let n = Math.floor(Math.random() * nums.length)
      let x = Math.floor(Math.random() * nums[m]);
      let y = Math.floor(Math.random() * nums[n]);
      let p = new Point(x, y, places[random])
      this.quadtree.insert(p)
    }
  }

  suggestLocation(point, place)
  {
    let points = [];
    points = this.quadtree.kNearest(point, 8, 10000, 10000, 6);
    // if (place === 'all') {
    if (place === 'all') {
      return points.found;
    }
    let res = [];
    for (let i = 0; i < points.found.length; i++)
    {
      if (points.found[i].userData === place)
      {
        res.push(points.found[i]);
      }
    }
    return res;
  }
}

